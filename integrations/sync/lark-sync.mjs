// Supabase <-> Lark Base
//  push-report   : ops.v_product_report -> bảng báo cáo (ghi đè toàn bộ)
//  push-requests : change_requests status=pending -> bảng phê duyệt
//  pull-approvals: đọc trạng thái Đã duyệt / Từ chối từ Lark -> change_requests
import { db, lark, larkTable, logJob } from './lib.mjs';

const chunk = (a, n) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

async function listAll(table, filter) {
  const out = []; let page_token;
  do {
    const q = new URLSearchParams({ page_size: '500', ...(page_token && { page_token }), ...(filter && { filter }) });
    const d = await lark('GET', `${table}/records?${q}`);
    out.push(...(d.items || [])); page_token = d.has_more ? d.page_token : null;
  } while (page_token);
  return out;
}

const pushReport = () => logJob('lark:report', async () => {
  const t = larkTable('LARK_TABLE_REPORT');
  const old = await listAll(t);
  for (const c of chunk(old.map((r) => r.record_id), 500)) await lark('POST', `${t}/records/batch_delete`, { records: c });
  const { rows } = await db.query('select * from ops.v_product_report order by handle, sku');
  for (const c of chunk(rows, 500))
    await lark('POST', `${t}/records/batch_create`, { records: c.map((r) => ({ fields: {
      'Handle': r.handle, 'Sản phẩm': r.title, 'Thương hiệu': r.vendor ?? '', 'Loại': r.product_type ?? '',
      'Trạng thái': r.status, 'Tồn kho': r.total_inventory ?? 0, 'SKU': r.sku ?? '', 'Biến thể': r.variant_title ?? '',
      'Giá bán': Number(r.price ?? 0), 'Giá gốc': Number(r.compare_at_price ?? 0), '% Giảm': Number(r.discount_pct ?? 0),
      'SEO đủ': r.seo_ok, 'Độ dài mô tả': r.description_len,
    } })) });
  return rows.length;
});

const CAT = { catalog: 'Sản phẩm/Dịch vụ', pricing: 'Giá & Khuyến mãi', content: 'Content' };

const pushRequests = () => logJob('lark:requests', async () => {
  const t = larkTable('LARK_TABLE_APPROVALS');
  const { rows } = await db.query(`select * from ops.change_requests where status='pending' and lark_record_id is null order by id`);
  for (const r of rows) {
    const d = await lark('POST', `${t}/records`, { fields: {
      'Mã đề xuất': r.id, 'Nhóm dữ liệu': CAT[r.category], 'Đối tượng': r.entity, 'Shopify ID': r.shopify_id,
      'Trường': r.field, 'Giá trị cũ': r.old_value ?? '', 'Giá trị mới': r.new_value, 'Lý do': r.reason ?? '',
      'Người đề xuất': r.requested_by ?? '', 'Trạng thái': 'Chờ duyệt',
    } });
    await db.query('update ops.change_requests set lark_record_id=$2 where id=$1', [r.id, d.record.record_id]);
  }
  return rows.length;
});

const pullApprovals = () => logJob('lark:approvals', async () => {
  const t = larkTable('LARK_TABLE_APPROVALS');
  const recs = await listAll(t, 'OR(CurrentValue.[Trạng thái]="Đã duyệt",CurrentValue.[Trạng thái]="Từ chối")');
  let n = 0;
  for (const r of recs) {
    const status = r.fields['Trạng thái'] === 'Đã duyệt' ? 'approved' : 'rejected';
    const approver = [].concat(r.fields['Người duyệt'] ?? []).map((u) => u.name ?? u).join(', ') || null;
    const res = await db.query(`update ops.change_requests set status=$2, approver=$3, approved_at=now()
      where lark_record_id=$1 and status='pending'`, [r.record_id, status, approver]);
    n += res.rowCount;
  }
  return n;
});

const steps = { 'push-report': pushReport, 'push-requests': pushRequests, 'pull-approvals': pullApprovals };
try {
  const arg = process.argv[2];
  for (const [k, fn] of Object.entries(steps)) if (!arg || arg === k) await fn();
} finally { await db.end(); }
