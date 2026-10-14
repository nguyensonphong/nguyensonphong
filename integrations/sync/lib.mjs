// Shared clients: Shopify Admin GraphQL, Supabase Postgres, Lark (Feishu) Open API
import pg from 'pg';

const need = (k) => { const v = process.env[k]; if (!v) throw new Error(`Missing env ${k}`); return v; };

export const db = new pg.Pool({ connectionString: need('SUPABASE_DB_URL'), ssl: { rejectUnauthorized: false } });

// Gợi ý cách sửa khi không kết nối được Supabase (in trước stack trace, không in mật khẩu)
export function dbErrorHint(e) {
  const msg = String(e?.message || e);
  const host = (process.env.SUPABASE_DB_URL || '').split('@').pop();
  if (/tenant\/user .* not found/i.test(msg))
    return `Sai host pooler (${host}). Dùng đúng host trong Supabase → Connect → Session pooler, ví dụ aws-0-ap-south-1.pooler.supabase.com:5432/postgres, user postgres.<project-ref>.`;
  if (/password authentication failed/i.test(msg))
    return 'Sai mật khẩu database. Đặt lại ở Supabase → Project Settings → Database → Reset database password rồi cập nhật secret SUPABASE_DB_URL.';
  if (e?.code === 'ENOTFOUND' && /getaddrinfo/.test(msg))
    return `Không phân giải được host ${host}. Kiểm tra lại phần host trong SUPABASE_DB_URL.`;
  return null;
}
process.on('uncaughtExceptionMonitor', (e) => {
  const hint = dbErrorHint(e);
  if (hint) console.error(`\n[Supabase] ${hint}\n`);
});

// Token: SHOPIFY_ADMIN_TOKEN (app cũ tạo trong admin) hoặc SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET
// (app tạo ở Dev Dashboard, lấy token 24h bằng client credentials grant)
let shopToken = process.env.SHOPIFY_ADMIN_TOKEN;
async function shopifyToken() {
  if (shopToken) return shopToken;
  const r = await fetch(`https://${need('SHOPIFY_STORE')}/admin/oauth/access_token`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: need('SHOPIFY_CLIENT_ID'), client_secret: need('SHOPIFY_CLIENT_SECRET'), grant_type: 'client_credentials' }),
  });
  if (!r.ok) throw new Error(`Shopify token: ${r.status} ${await r.text()}`);
  return (shopToken = (await r.json()).access_token);
}

export async function shopify(query, variables = {}) {
  const res = await fetch(`https://${need('SHOPIFY_STORE')}/admin/api/2025-10/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': await shopifyToken() },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  const cost = json.extensions?.cost?.throttleStatus;
  if (cost && cost.currentlyAvailable < 200) await new Promise((r) => setTimeout(r, 2000));
  return json.data;
}

// Iterate every node of a paginated connection; `path` = top-level field name
export async function* paginate(query, path, variables = {}) {
  let after = null;
  do {
    const data = await shopify(query, { ...variables, after });
    const conn = data[path];
    yield* conn.nodes;
    after = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null;
  } while (after);
}

let larkToken = null;
export async function lark(method, path, body) {
  const base = process.env.LARK_DOMAIN || 'https://open.larksuite.com';
  if (!larkToken) {
    const r = await fetch(`${base}/open-apis/auth/v3/tenant_access_token/internal`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: need('LARK_APP_ID'), app_secret: need('LARK_APP_SECRET') }),
    }).then((r) => r.json());
    if (r.code) throw new Error(`Lark auth: ${r.msg}`);
    larkToken = r.tenant_access_token;
  }
  const r = await fetch(`${base}/open-apis${path}`, {
    method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${larkToken}` },
    body: body ? JSON.stringify(body) : undefined,
  }).then((r) => r.json());
  if (r.code) throw new Error(`Lark ${path}: ${r.msg}`);
  return r.data;
}
export const larkTable = (envKey) => `/bitable/v1/apps/${need('LARK_BASE_TOKEN')}/tables/${need(envKey)}`;

export async function logJob(job, fn) {
  const { rows: [l] } = await db.query('insert into ops.sync_log(job) values ($1) returning id', [job]);
  try {
    const n = await fn();
    await db.query('update ops.sync_log set finished_at=now(), ok=true, rows=$2 where id=$1', [l.id, n]);
    console.log(`${job}: ${n} rows`);
  } catch (e) {
    await db.query('update ops.sync_log set finished_at=now(), ok=false, message=$2 where id=$1', [l.id, String(e)]);
    throw e;
  }
}
