// Render trang chủ của theme thành một file HTML tĩnh để xem trước (không cần Shopify).
// Chạy: npm install && node tools/render-preview.mjs  → ghi ra preview/index.html
import { Liquid, Tag } from 'liquidjs';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const T = (...p) => path.join(ROOT, 'theme', ...p);
const read = (f) => fs.readFileSync(f, 'utf8');

const engine = new Liquid({ root: [T('snippets')], extname: '.liquid', dynamicPartials: true, strictFilters: false });

// --- Tag/filter riêng của Shopify (bản giản lược đủ để xem trước) ---
class SkipTag extends Tag {
  constructor(token, remain, liquid, end) {
    super(token, remain, liquid);
    while (remain.length) { const t = remain.shift(); if (t.name === end) return; }
  }
  * render() {}
}
engine.registerTag('schema', class extends SkipTag { constructor(t, r, l) { super(t, r, l, 'endschema'); } });
engine.registerTag('form', class extends Tag {
  constructor(token, remain, liquid) {
    super(token, remain, liquid);
    this.cls = (token.args.match(/class:\s*'([^']+)'/) || [])[1] || '';
    this.tpls = [];
    const stream = liquid.parser.parseStream(remain).on('tag:endform', () => stream.stop()).on('template', (t) => this.tpls.push(t)).on('end', () => { throw new Error('form not closed'); });
    stream.start();
  }
  * render(ctx, emitter) {
    emitter.write(`<form class="${this.cls}" onsubmit="event.preventDefault()">`);
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    emitter.write('</form>');
  }
});
const money = (c) => (Math.round(Number(c || 0) / 100)).toLocaleString('vi-VN') + '₫';
engine.registerFilter('money_without_trailing_zeros', money);
engine.registerFilter('money', money);
engine.registerFilter('image_url', (img) => (img && img.src) || '');
engine.registerFilter('image_tag', (src, ...a) => (src ? `<img src="${src}" alt="">` : ''));
engine.registerFilter('video_tag', () => '');
engine.registerFilter('default_errors', () => '');

// --- Dữ liệu mẫu ---
const P = (title, vendor, price, compare, extra = {}) => ({
  title, vendor, url: '#', price: price * 100, compare_at_price: compare ? compare * 100 : null,
  featured_image: null, tags: extra.tags || [], selected_or_first_available_variant: { id: 1, available: true },
  metafields: { custom: { sold: extra.sold, final_price: extra.final ? extra.final * 100 : null, extra_offer: extra.offer }, reviews: { rating: { value: extra.rating ? { rating: extra.rating } : null } } },
});
const C = (title, products) => ({ title, url: '#', products, products_count: products.length });
const flash = [P('Máy lạnh Inverter 1 HP tiết kiệm điện', 'CoolAir', 7990000, 10490000), P('Máy giặt cửa trước 9 kg Inverter', 'WashPro', 7490000, 9990000), P('Tivi 55 inch 4K Smart', 'VisionMax', 9990000, 13990000), P('Nồi chiên không dầu 6 lít', 'KitchenJoy', 1290000, 1990000), P('Bồn cầu một khối xả xoáy', 'AquaLux', 4590000, 6290000), P('Gạch lát nền porcelain 60x60 vân đá', 'StoneArt', 189000, 259000), P('Máy khoan pin 18V kèm 2 pin', 'ToolMaster', 1590000, 2290000)];
const shock = [P('Máy lạnh Inverter 1.5 HP lọc bụi mịn', 'CoolAir', 10990000, 13990000), P('Tủ lạnh 2 cửa 256 lít ngăn đông mềm', 'FrostLine', 6490000, 8290000), P('Máy sấy quần áo 8 kg thông hơi', 'WashPro', 5990000, 7490000), P('Máy pha cà phê espresso', 'BrewLab', 3290000, 4590000), P('Robot hút bụi lau nhà tự động', 'CleanBot', 4990000, 6990000), P('Sofa vải 3 chỗ phong cách Bắc Âu', 'CasaNova', 8990000, 12990000)];
const popular = [P('Gạch lát nền porcelain 60x60 vân đá', 'StoneArt', 189000, 259000, { tags: ['best-price'], sold: '78k+' }), P('Nồi chiên không dầu 6 lít', 'KitchenJoy', 1290000, 1990000, { tags: ['best-price'], sold: '25k+', offer: 'Tặng giấy lót 50 tờ' }), P('Máy lạnh Inverter 1 HP tiết kiệm điện', 'CoolAir', 7990000, 10490000, { tags: ['free-install'], sold: '12k+', offer: 'Trả góp 0%, tặng ống đồng 3m' }), P('Nồi cơm điện tử 1.8 lít', 'KitchenJoy', 990000, 1490000, { tags: ['best-price'], sold: '18k+' }), P('Kệ giày 5 tầng có cửa', 'CasaNova', 590000, 890000, { tags: ['best-price'], sold: '15k+' }), P('Sen tắm cây nóng lạnh', 'AquaLux', 1890000, 2690000, { sold: '4k+' })];
const fresh = [P('Loa thanh soundbar 2.1 kênh', 'VisionMax', 2490000, 3490000), P('Robot hút bụi lau nhà tự động', 'CleanBot', 4990000, 6990000), P('Máy lọc không khí phòng 40m²', 'PureHome', 2790000, 3590000), P('Đèn LED âm trần 12W (bộ 4)', 'BrightLite', 399000, 599000), P('Khóa cửa vân tay thông minh', 'SafeHome', 3490000, 4990000), P('Bàn ghế sân vườn 4 chỗ', 'GardenLife', 3990000, 5490000)];
const inject = {
  shock: { collection: C('Double Shock', shock) },
  flash: { collection: C('Flash Sale', flash), ends_at: (() => { const d = new Date(Date.now() + 7 * 864e5 / 4); return d.toISOString(); })() },
  popular: { _tabs: [popular, shock, flash.slice(2), popular.slice(0, 3)] },
  new_products: { collection: C('สินค้าใหม่', fresh) },
};
const style = { new_products: 'new' };

const M = (title, kids = []) => ({ title, url: '#', links: kids });
const L = (...t) => t.map((x) => M(x));
const linklists = {
  'main-menu': { links: L("Mua theo phòng", "Thương hiệu", "Flash Sale", "Double Shock", "Sản phẩm mới", "Bán chạy", "Dịch vụ lắp đặt", "Ưu đãi hot") },
  'category-shortcuts': { links: L("Điện máy", "Đồ gia dụng", "Tivi & âm thanh", "Nội thất", "Phòng ngủ & chăn ga", "Phòng tắm", "Vật liệu xây dựng", "Dụng cụ", "Đèn & bóng đèn", "Thiết bị an ninh", "Sân vườn") },
  'help-center': { links: L("Hỏi đáp", "Khiếu nại", "Theo dõi đơn hàng") },
  'all-categories': { links: [{"title": "Điện máy", "url": "#", "links": [{"title": "Máy lạnh", "url": "#", "links": [{"title": "Treo tường", "url": "#", "links": []}, {"title": "Âm trần", "url": "#", "links": []}, {"title": "Di động", "url": "#", "links": []}, {"title": "Phụ kiện lắp đặt", "url": "#", "links": []}]}, {"title": "Máy giặt & máy sấy", "url": "#", "links": [{"title": "Cửa trước", "url": "#", "links": []}, {"title": "Cửa trên", "url": "#", "links": []}, {"title": "Máy sấy", "url": "#", "links": []}]}, {"title": "Tủ lạnh", "url": "#", "links": [{"title": "2 cửa", "url": "#", "links": []}, {"title": "Side by Side", "url": "#", "links": []}, {"title": "Multi Door", "url": "#", "links": []}]}]}, {"title": "Đồ gia dụng", "url": "#", "links": [{"title": "Nhà bếp", "url": "#", "links": [{"title": "Nồi chiên không dầu", "url": "#", "links": []}, {"title": "Nồi cơm điện", "url": "#", "links": []}, {"title": "Máy pha cà phê", "url": "#", "links": []}]}, {"title": "Vệ sinh & không khí", "url": "#", "links": [{"title": "Robot hút bụi", "url": "#", "links": []}, {"title": "Máy lọc không khí", "url": "#", "links": []}, {"title": "Quạt", "url": "#", "links": []}]}]}, {"title": "Tivi & âm thanh", "url": "#", "links": [{"title": "Tivi", "url": "#", "links": [{"title": "Smart TV", "url": "#", "links": []}, {"title": "Tivi 4K", "url": "#", "links": []}]}, {"title": "Âm thanh", "url": "#", "links": [{"title": "Loa thanh", "url": "#", "links": []}, {"title": "Loa bluetooth", "url": "#", "links": []}]}]}, {"title": "Nội thất", "url": "#", "links": [{"title": "Phòng khách", "url": "#", "links": [{"title": "Sofa", "url": "#", "links": []}, {"title": "Kệ & tủ", "url": "#", "links": []}]}, {"title": "Lưu trữ", "url": "#", "links": [{"title": "Kệ giày", "url": "#", "links": []}, {"title": "Tủ đồ", "url": "#", "links": []}]}]}, {"title": "Phòng ngủ & chăn ga", "url": "#", "links": [{"title": "Nệm", "url": "#", "links": [{"title": "Nệm lò xo", "url": "#", "links": []}, {"title": "Nệm foam", "url": "#", "links": []}]}, {"title": "Chăn ga gối", "url": "#", "links": []}]}, {"title": "Phòng tắm", "url": "#", "links": [{"title": "Thiết bị vệ sinh", "url": "#", "links": [{"title": "Bồn cầu", "url": "#", "links": []}, {"title": "Lavabo", "url": "#", "links": []}]}, {"title": "Sen & vòi", "url": "#", "links": [{"title": "Sen cây", "url": "#", "links": []}, {"title": "Vòi lavabo", "url": "#", "links": []}]}]}, {"title": "Vật liệu xây dựng", "url": "#", "links": [{"title": "Gạch ốp lát", "url": "#", "links": [{"title": "Gạch lát nền", "url": "#", "links": []}, {"title": "Gạch ốp tường", "url": "#", "links": []}]}, {"title": "Sơn", "url": "#", "links": [{"title": "Sơn nội thất", "url": "#", "links": []}, {"title": "Sơn ngoại thất", "url": "#", "links": []}]}]}, {"title": "Dụng cụ", "url": "#", "links": [{"title": "Dụng cụ điện", "url": "#", "links": [{"title": "Máy khoan", "url": "#", "links": []}, {"title": "Máy mài", "url": "#", "links": []}]}, {"title": "Dụng cụ cầm tay", "url": "#", "links": [{"title": "Bộ dụng cụ", "url": "#", "links": []}]}]}, {"title": "Đèn & bóng đèn", "url": "#", "links": [{"title": "Đèn trong nhà", "url": "#", "links": [{"title": "Đèn âm trần", "url": "#", "links": []}, {"title": "Đèn trang trí", "url": "#", "links": []}]}]}, {"title": "Thiết bị an ninh", "url": "#", "links": [{"title": "Khóa cửa", "url": "#", "links": [{"title": "Khóa vân tay", "url": "#", "links": []}]}, {"title": "Camera", "url": "#", "links": []}]}, {"title": "Sân vườn", "url": "#", "links": [{"title": "Nội thất ngoài trời", "url": "#", "links": [{"title": "Bàn ghế sân vườn", "url": "#", "links": []}]}]}] },
  'footer-help': { links: L("Hướng dẫn mua online", "Câu hỏi thường gặp", "Đổi trả & bảo hành", "Theo dõi đơn hàng") },
  'footer-benefits': { links: L("Thành viên", "Trả góp 0%", "Ưu đãi thẻ") },
  'footer-policy': { links: L("Điều khoản sử dụng", "Chính sách giao hàng", "Chính sách bảo mật", "Chính sách đổi trả") },
  'footer-about': { links: L("Giới thiệu", "Hệ thống cửa hàng", "Tuyển dụng", "Liên hệ") },
};
const globals = {
  shop: { name: 'Gia Khang' }, cart: { item_count: 0 }, customer: null, search: {},
  request: { locale: { iso_code: 'vi' } }, localization: { available_languages: [] },
  routes: { root_url: '/', search_url: '/search', cart_url: '/cart', cart_add_url: '/cart/add', account_url: '/account', account_login_url: '/account/login', account_register_url: '/account/register', account_addresses_url: '/account/addresses', collections_url: '/collections', all_products_collection_url: '/collections/all' },
  linklists,
  settings: { font_family: 'roboto', color_primary: '#0066B3', color_footer: '#0065B2', color_accent: '#F7931E', color_price: '#E4002B', color_soft: '#EAF4FC', chat_url: '#', social_facebook: '#', social_line: '#', social_instagram: '#', social_youtube: '#', social_x: '#' },
};

// --- Ghép section ---
function schemaOf(src) { const m = src.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/); return m ? JSON.parse(m[1]) : {}; }
function defaults(list = []) { const o = {}; for (const s of list) if ('default' in s) o[s.id] = s.default; return o; }
async function renderSection(id, cfg) {
  const src = read(T('sections', cfg.type + '.liquid'));
  const sc = schemaOf(src);
  const settings = { ...defaults(sc.settings), ...(cfg.settings || {}), ...(inject[id] || {}) };
  let blocks = [];
  if (cfg.block_order) blocks = cfg.block_order.map((k) => cfg.blocks[k]);
  else if (sc.default?.blocks) blocks = sc.default.blocks;
  blocks = blocks.map((b, i) => {
    const bs = sc.blocks?.find((x) => x.type === b.type);
    const s = { ...defaults(bs?.settings), ...(b.settings || {}) };
    if (settings._tabs) s.collection = C(s.label, settings._tabs[i % settings._tabs.length]);
    return { type: b.type, settings: s };
  });
  return engine.parseAndRender(src, { ...globals, section: { id, settings, blocks } });
}
async function renderGroup(file) {
  const g = JSON.parse(read(T('sections', file)));
  let out = '';
  for (const id of g.order) out += await renderSection(id, g.sections[id]);
  return out;
}

const index = JSON.parse(read(T('templates', 'index.json')));
let main = '';
for (const id of index.order) main += await renderSection(id, index.sections[id]);
const header = await renderGroup('header-group.json');
const footer = await renderGroup('footer-group.json');

const css = read(T('assets', 'theme.css'));
const js = read(T('assets', 'theme.js'));
const stub = `// Bản xem trước: giả lập giỏ hàng vì không có máy chủ Shopify
(function(){let n=0;const f=window.fetch;window.fetch=async(u,o)=>{u=String(u);if(u.startsWith('/cart/add')){n++;return new Response('{}',{status:200})}if(u.startsWith('/cart.js'))return new Response(JSON.stringify({item_count:n}));if(u.startsWith('/discount/'))return new Response('');return f(u,o)};document.addEventListener('click',e=>{const a=e.target.closest('a[href="#"],a[href^="/"]');if(a)e.preventDefault()})})();`;

const html = `<title>HomeStyle Storefront</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap">
<style>${css}</style>
${header}
<main id="main">${main}</main>
${footer}
<a class="chatfab" href="#"><i>🤖</i>Chat</a>
<div class="toast" role="status" data-toast></div>
<script>${stub}</script>
<script>${js}</script>
`;
fs.mkdirSync(path.join(ROOT, 'preview'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'preview', 'index.html'), html);
console.log('preview/index.html', (html.length / 1024).toFixed(0) + 'KB');
