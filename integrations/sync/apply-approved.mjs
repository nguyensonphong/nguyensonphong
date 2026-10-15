// Đẩy các đề xuất đã duyệt (status=approved) lên Shopify, rồi cập nhật Supabase + Lark
import { db, shopify, lark, larkTable } from './lib.mjs';

const M = {
  variantPrice: `mutation($productId:ID!,$variants:[ProductVariantsBulkInput!]!){ productVariantsBulkUpdate(productId:$productId, variants:$variants){ userErrors{field message} } }`,
  product: `mutation($product:ProductUpdateInput!){ productUpdate(product:$product){ userErrors{field message} } }`,
  article: `mutation($id:ID!,$article:ArticleUpdateInput!){ articleUpdate(id:$id, article:$article){ userErrors{field message} } }`,
  page: `mutation($id:ID!,$page:PageUpdateInput!){ pageUpdate(id:$id, page:$page){ userErrors{field message} } }`,
};

// Trường được phép sửa theo đối tượng -> hàm tạo mutation
const PRODUCT_FIELDS = { title: (v) => ({ title: v }), status: (v) => ({ status: v.toUpperCase() }),
  product_type: (v) => ({ productType: v }), vendor: (v) => ({ vendor: v }), tags: (v) => ({ tags: v.split(',').map((s) => s.trim()) }),
  description_html: (v) => ({ descriptionHtml: v }), seo_title: (v) => ({ seo: { title: v } }), seo_description: (v) => ({ seo: { description: v } }) };

async function apply(r) {
  if (r.entity === 'variant' && ['price', 'compare_at_price'].includes(r.field)) {
    const { rows: [v] } = await db.query('select product_id from catalog.variants where shopify_id=$1', [r.shopify_id]);
    if (!v) throw new Error('variant không tồn tại trong Supabase');
    const key = r.field === 'price' ? 'price' : 'compareAtPrice';
    const d = await shopify(M.variantPrice, { productId: v.product_id, variants: [{ id: r.shopify_id, [key]: r.new_value || null }] });
    return d.productVariantsBulkUpdate.userErrors;
  }
  if (r.entity === 'product' && PRODUCT_FIELDS[r.field]) {
    const d = await shopify(M.product, { product: { id: r.shopify_id, ...PRODUCT_FIELDS[r.field](r.new_value) } });
    return d.productUpdate.userErrors;
  }
  if (r.entity === 'article' && ['title', 'body_html', 'summary_html'].includes(r.field)) {
    const k = { title: 'title', body_html: 'body', summary_html: 'summary' }[r.field];
    return (await shopify(M.article, { id: r.shopify_id, article: { [k]: r.new_value } })).articleUpdate.userErrors;
  }
  if (r.entity === 'page' && ['title', 'body_html'].includes(r.field)) {
    const k = { title: 'title', body_html: 'body' }[r.field];
    return (await shopify(M.page, { id: r.shopify_id, page: { [k]: r.new_value } })).pageUpdate.userErrors;
  }
  throw new Error(`Chưa hỗ trợ ${r.entity}.${r.field}`);
}

try {
  const { rows } = await db.query(`select * from ops.change_requests where status='approved' order by id`);
  for (const r of rows) {
    let status = 'applied', error = null;
    try {
      const errs = await apply(r);
      if (errs?.length) { status = 'failed'; error = JSON.stringify(errs); }
    } catch (e) { status = 'failed'; error = String(e.message ?? e); }
    await db.query(`update ops.change_requests set status=$2, error=$3, applied_at=case when $2='applied' then now() end where id=$1`,
      [r.id, status, error]);
    if (r.lark_record_id && process.env.LARK_TABLE_APPROVALS)
      await lark('PUT', `${larkTable('LARK_TABLE_APPROVALS')}/records/${r.lark_record_id}`,
        { fields: { 'Trạng thái': status === 'applied' ? 'Đã áp dụng' : 'Lỗi', 'Ghi chú hệ thống': error ?? '' } });
    console.log(`#${r.id} ${r.entity}.${r.field} -> ${status}${error ? ' ' + error : ''}`);
  }
} finally { await db.end(); }
