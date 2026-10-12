// Kéo toàn bộ dữ liệu Shopify -> Supabase, chia 3 nhóm: catalog / pricing / content
import { db, paginate, logJob } from './lib.mjs';

// Thương hiệu = vendor (metaobject brand dùng cùng handle)
const slug = (s) => s ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : null;

const PRODUCTS = `query($after:String){ products(first:50, after:$after){ pageInfo{hasNextPage endCursor} nodes{
  id handle title productType vendor status tags totalInventory createdAt updatedAt descriptionHtml
  seo{title description} featuredMedia{preview{image{url}}}
  collections(first:50){ nodes{ id } }
  variants(first:100){ nodes{ id title sku barcode inventoryQuantity price compareAtPrice
    selectedOptions{name value} inventoryItem{ requiresShipping unitCost{amount} } } } } } }`;

const COLLECTIONS = `query($after:String){ collections(first:100, after:$after){ pageInfo{hasNextPage endCursor} nodes{
  id handle title ruleSet{appliedDisjunctively} productsCount{count} } } }`;

const BRANDS = `query($after:String){ metaobjects(type:"brand", first:100, after:$after){ pageInfo{hasNextPage endCursor} nodes{
  id handle displayName fields{key value} } } }`;

const DISCOUNTS = `query($after:String){ discountNodes(first:50, after:$after){ pageInfo{hasNextPage endCursor} nodes{ id discount{
  __typename
  ... on DiscountCodeBasic{ title status startsAt endsAt asyncUsageCount codes(first:1){nodes{code}}
      customerGets{ value{ ... on DiscountPercentage{percentage} ... on DiscountAmount{amount{amount}} } } }
  ... on DiscountAutomaticBasic{ title status startsAt endsAt asyncUsageCount
      customerGets{ value{ ... on DiscountPercentage{percentage} ... on DiscountAmount{amount{amount}} } } }
  ... on DiscountCodeBxgy{ title status startsAt endsAt asyncUsageCount }
  ... on DiscountAutomaticBxgy{ title status startsAt endsAt asyncUsageCount }
  ... on DiscountCodeFreeShipping{ title status startsAt endsAt asyncUsageCount }
  ... on DiscountAutomaticFreeShipping{ title status startsAt endsAt asyncUsageCount } } } } }`;

const ARTICLES = `query($after:String){ articles(first:50, after:$after){ pageInfo{hasNextPage endCursor} nodes{
  id handle title tags summary body isPublished publishedAt author{name} blog{handle} } } }`;

const PAGES = `query($after:String){ pages(first:50, after:$after){ pageInfo{hasNextPage endCursor} nodes{
  id handle title body isPublished } } }`;

const syncCollections = () => logJob('collections', async () => {
  let n = 0;
  for await (const c of paginate(COLLECTIONS, 'collections')) {
    await db.query(`insert into catalog.collections(shopify_id,handle,title,is_smart,products_count,synced_at)
      values($1,$2,$3,$4,$5,now()) on conflict(shopify_id) do update set handle=excluded.handle,title=excluded.title,
      is_smart=excluded.is_smart,products_count=excluded.products_count,synced_at=now()`,
      [c.id, c.handle, c.title, !!c.ruleSet, c.productsCount?.count]);
    n++;
  }
  return n;
});

const syncBrands = () => logJob('brands', async () => {
  let n = 0;
  for await (const b of paginate(BRANDS, 'metaobjects')) {
    const fields = Object.fromEntries(b.fields.map((f) => [f.key, f.value]));
    await db.query(`insert into catalog.brands(shopify_id,handle,name,fields,synced_at) values($1,$2,$3,$4,now())
      on conflict(shopify_id) do update set handle=excluded.handle,name=excluded.name,fields=excluded.fields,synced_at=now()`,
      [b.id, b.handle, b.displayName, fields]);
    n++;
  }
  return n;
});

const syncProducts = () => logJob('products', async () => {
  let n = 0;
  for await (const p of paginate(PRODUCTS, 'products')) {
    const v = p.variants.nodes;
    const isService = v.length > 0 && v.every((x) => x.inventoryItem && !x.inventoryItem.requiresShipping);
    const c = await db.connect();
    try {
      await c.query('begin');
      // 1. catalog
      await c.query(`insert into catalog.products(shopify_id,handle,title,product_type,vendor,brand_handle,status,tags,is_service,
        total_inventory,featured_image,shopify_created_at,shopify_updated_at,synced_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,now())
        on conflict(shopify_id) do update set handle=excluded.handle,title=excluded.title,product_type=excluded.product_type,
        vendor=excluded.vendor,brand_handle=excluded.brand_handle,status=excluded.status,tags=excluded.tags,is_service=excluded.is_service,
        total_inventory=excluded.total_inventory,featured_image=excluded.featured_image,shopify_updated_at=excluded.shopify_updated_at,synced_at=now()`,
        [p.id, p.handle, p.title, p.productType, p.vendor, slug(p.vendor), p.status, p.tags, isService,
         p.totalInventory, p.featuredMedia?.preview?.image?.url ?? null, p.createdAt, p.updatedAt]);
      for (const x of v) {
        await c.query(`insert into catalog.variants(shopify_id,product_id,title,sku,barcode,inventory_quantity,options,synced_at)
          values($1,$2,$3,$4,$5,$6,$7,now()) on conflict(shopify_id) do update set title=excluded.title,sku=excluded.sku,
          barcode=excluded.barcode,inventory_quantity=excluded.inventory_quantity,options=excluded.options,synced_at=now()`,
          [x.id, p.id, x.title, x.sku, x.barcode, x.inventoryQuantity, JSON.stringify(x.selectedOptions)]);
        // 2. pricing
        await c.query(`insert into pricing.variant_prices(variant_id,product_id,price,compare_at_price,unit_cost,synced_at)
          values($1,$2,$3,$4,$5,now()) on conflict(variant_id) do update set price=excluded.price,
          compare_at_price=excluded.compare_at_price,unit_cost=excluded.unit_cost,synced_at=now()`,
          [x.id, p.id, x.price, x.compareAtPrice, x.inventoryItem?.unitCost?.amount ?? null]);
      }
      await c.query('delete from catalog.variants where product_id=$1 and not (shopify_id = any($2))', [p.id, v.map((x) => x.id)]);
      await c.query('delete from catalog.product_collections where product_id=$1', [p.id]);
      for (const col of p.collections.nodes)
        await c.query(`insert into catalog.product_collections select $1,$2 where exists
          (select 1 from catalog.collections where shopify_id=$2) on conflict do nothing`, [p.id, col.id]);
      // 3. content
      await c.query(`insert into content.product_content(product_id,description_html,seo_title,seo_description,synced_at)
        values($1,$2,$3,$4,now()) on conflict(product_id) do update set description_html=excluded.description_html,
        seo_title=excluded.seo_title,seo_description=excluded.seo_description,synced_at=now()`,
        [p.id, p.descriptionHtml, p.seo?.title, p.seo?.description]);
      await c.query('commit');
    } catch (e) { await c.query('rollback'); throw e; } finally { c.release(); }
    n++;
  }
  return n;
});

const syncDiscounts = () => logJob('discounts', async () => {
  let n = 0;
  for await (const d of paginate(DISCOUNTS, 'discountNodes')) {
    const x = d.discount, val = x.customerGets?.value;
    const type = /Bxgy/.test(x.__typename) ? 'bxgy' : /FreeShipping/.test(x.__typename) ? 'free_shipping'
      : val?.percentage != null ? 'percentage' : 'fixed_amount';
    const value = val?.percentage != null ? val.percentage * 100 : val?.amount?.amount ?? null;
    await db.query(`insert into pricing.discounts(shopify_id,title,code,discount_type,value,status,starts_at,ends_at,usage_count,raw,synced_at)
      values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now()) on conflict(shopify_id) do update set title=excluded.title,code=excluded.code,
      discount_type=excluded.discount_type,value=excluded.value,status=excluded.status,starts_at=excluded.starts_at,
      ends_at=excluded.ends_at,usage_count=excluded.usage_count,raw=excluded.raw,synced_at=now()`,
      [d.id, x.title, x.codes?.nodes?.[0]?.code ?? null, type, value, x.status, x.startsAt, x.endsAt, x.asyncUsageCount, x]);
    n++;
  }
  return n;
});

const syncArticles = () => logJob('articles', async () => {
  let n = 0;
  for await (const a of paginate(ARTICLES, 'articles')) {
    await db.query(`insert into content.articles(shopify_id,blog_handle,handle,title,author,tags,summary_html,body_html,is_published,published_at,synced_at)
      values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now()) on conflict(shopify_id) do update set blog_handle=excluded.blog_handle,handle=excluded.handle,
      title=excluded.title,author=excluded.author,tags=excluded.tags,summary_html=excluded.summary_html,body_html=excluded.body_html,
      is_published=excluded.is_published,published_at=excluded.published_at,synced_at=now()`,
      [a.id, a.blog?.handle, a.handle, a.title, a.author?.name, a.tags, a.summary, a.body, a.isPublished, a.publishedAt]);
    n++;
  }
  return n;
});

const syncPages = () => logJob('pages', async () => {
  let n = 0;
  for await (const p of paginate(PAGES, 'pages')) {
    await db.query(`insert into content.pages(shopify_id,handle,title,body_html,is_published,synced_at) values($1,$2,$3,$4,$5,now())
      on conflict(shopify_id) do update set handle=excluded.handle,title=excluded.title,body_html=excluded.body_html,
      is_published=excluded.is_published,synced_at=now()`, [p.id, p.handle, p.title, p.body, p.isPublished]);
    n++;
  }
  return n;
});

const only = process.argv[2]; // catalog | pricing | content | (all)
try {
  if (!only || only === 'catalog' || only === 'pricing') { await syncCollections(); await syncBrands(); await syncProducts(); }
  if (!only || only === 'pricing') await syncDiscounts();
  if (!only || only === 'content') { await syncArticles(); await syncPages(); }
} finally { await db.end(); }
