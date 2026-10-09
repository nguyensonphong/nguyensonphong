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
const money = (c) => '฿' + (Number(c || 0) / 100).toLocaleString('en-US', { maximumFractionDigits: 2 });
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
const flash = [P('บ้านสัตว์เลี้ยง DPETT สีเทา-ฟ้า', 'DPETT', 2690, 6500), P('สุขภัณฑ์ 1 ชิ้น COTTO C1006H EXC. 3/4.5 ลิตร', 'COTTO', 5390, 8990), P('กระเบื้องพื้น 60x60 ซม. TARA เอด้า ขาว', 'TARA', 319, 459), P('ตู้เหล็กบานเปิด BANTEX BJ7603', 'BANTEX', 4499, 6290), P('เตา BBQ แก๊ส 3 หัว SPRING NOVA', 'SPRING', 17900, 25900), P('ทีวี LG 65" QNED 4K', 'LG', 18490, 32990), P('แอร์ผนัง MITSUBISHI 18000 BTU อินเวอร์เตอร์', 'MITSUBISHI', 33955, 41900)];
const shock = [P('แอร์ผนัง HAIER 12000 BTU อินเวอร์เตอร์', 'Haier', 12990, 17990), P('เตารีดไอน้ำแยกหม้อต้ม PHILIPS PSG6066', 'PHILIPS', 1899, 3290), P('เครื่องชงกาแฟอัตโนมัติ BOSCH TIE20119', 'BOSCH', 2890, 5990), P('เครื่องดูดฝุ่นหุ่นยนต์ XIAOMI X20+', 'Xiaomi', 1449, 2490), P('ตู้เย็น 2 ประตู ELECTROLUX 12 คิว', 'Electrolux', 13990, 18990), P('ตู้เย็น MITSUBISHI Multi Door', 'MITSUBISHI', 29990, 39990)];
const popular = [P('กระเบื้องพื้นพอร์ซเลน 60x60 ซม. TARA แกรนิโต้ เบจ', 'TARA', 269, 419, { tags: ['best-price'], sold: '78k+', rating: 4.89 }), P('กระเบื้องพื้นพอร์ซเลน 60x60 ซม. TARA ซูก้า เบจ', 'TARA', 223, 399, { tags: ['best-price'], sold: '16k+', rating: 5 }), P('แอร์ผนัง MITSUBISHI MSY-KA13VF 12283 BTU อินเวอร์เตอร์', 'MITSUBISHI', 17785, 22300, { tags: ['free-install'], final: 13523.93, offer: 'ลดเพิ่ม 8%, มีผ่อน 0%, ของแถม' }), P('แอร์ผนัง MITSUBISHI MSY-GZ18VF 17742 BTU อินเวอร์เตอร์', 'MITSUBISHI', 33955, 38900, { tags: ['free-install'], final: 26984.04, offer: 'ลดเพิ่ม 8%, มีผ่อน 0%, ของแถม' }), P('แอร์ผนัง MIDEA CHIONE SERIES 18000 BTU อินเวอร์เตอร์', 'midea', 13300, 21990, { tags: ['free-shipping'], final: 12125 }), P('ไมโครเวฟ TOSHIBA 20 ลิตร', 'TOSHIBA', 1790, 2590, { tags: ['free-shipping'] })];
const fresh = [P('จอมอนิเตอร์ 32 นิ้ว SAMSUNG LS32H800', 'SAMSUNG', 8990), P('จอมอนิเตอร์ 27 นิ้ว SAMSUNG LS27HG510', 'SAMSUNG', 3490), P('กล้องดิจิทัลพกพา พร้อมจอพับเซลฟี่ สีขาว', 'Home Brand', 599, 990), P('เครื่องปริ้นเตอร์มัลติฟังก์ชันอิงค์เจ็ท BROTHER', 'BROTHER', 8990), P('สายชาร์จ USB TYPE-C TO USB TYPE-C RIZZ', 'RIZZ', 159), P('แผ่นเกม NINTENDO SWITCH 2', 'NINTENDO', 1590)];
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
  'main-menu': { links: L('ช้อปตามห้อง', 'ช้อปตามแบรนด์', 'Mall', 'สินค้าช่าง-งาน D.I.Y', 'โฮมกูรู', 'ช่างมืออาชีพ', 'โปรเด็ด', 'บริการพิเศษ') },
  'category-shortcuts': { links: L('เครื่องใช้ไฟฟ้า', 'เครื่องใช้ไฟฟ้าขนาดเล็ก', 'เฟอร์นิเจอร์และของแต่งบ้าน', 'ทีวี เครื่องเสียง เกม', 'จัดเก็บและของใช้ในบ้าน', 'ห้องน้ำ', 'งานระบบประปา', 'ห้องครัวและอุปกรณ์', 'วัสดุปูพื้นและผนัง', 'วัสดุก่อสร้าง', 'เครื่องมือช่างและฮาร์ดแวร์') },
  'help-center': { links: L('สอบถาม', 'ร้องเรียน', 'ติดต่อกรรมการตรวจสอบ') },
  'all-categories': { links: [
    M('เครื่องใช้ไฟฟ้า', [M('เครื่องปรับอากาศ', L('ติดผนัง', 'ตั้งพื้น', 'แขวน', 'เคลื่อนที่', 'ฝัง', 'ซ่อนเพดาน', 'ตู้ตั้ง', 'แผ่นกรองอากาศ', 'อุปกรณ์ติดตั้งแอร์')), M('เครื่องซักผ้าและอบผ้า', L('ฝาหน้า', 'ฝาบน', '2 ถัง', 'ซักอบผ้า', 'อบผ้าฝาหน้า', 'ซักอบผ้า ทาวเวอร์', 'อบทำความสะอาดผ้า', 'อุปกรณ์เสริม')), M('ตู้เย็น', L('1 ประตู', '2 ประตู', 'Side by Side', 'Multi Door', 'บิวท์อิน', 'อุปกรณ์จัดเก็บ', 'ถาดทำน้ำแข็ง')), M('ตู้แช่ไวน์ และเครื่องแช่ไวน์'), M('ตู้น้ำดื่ม'), M('ตู้แช่เค้ก')]),
    M('เครื่องใช้ไฟฟ้าขนาดเล็ก', [M('เครื่องใช้ไฟฟ้าในครัว', L('เตาอบ & ไมโครเวฟ', 'หม้อหุงข้าว', 'เครื่องชงกาแฟ & ชา', 'หม้อทอด')), M('เครื่องใช้ในบ้าน', L('พัดลม', 'เครื่องฟอกอากาศ', 'เครื่องดูดฝุ่น'))]),
    ...['เฟอร์นิเจอร์และของแต่งบ้าน', 'ทีวี เครื่องเสียง เกม', 'จัดเก็บและของใช้ในบ้าน', 'ห้องน้ำ', 'งานระบบประปา', 'ห้องครัวและอุปกรณ์', 'วัสดุปูพื้นและผนัง', 'วัสดุก่อสร้าง', 'เครื่องมือช่างและฮาร์ดแวร์', 'โคมไฟและหลอดไฟ', 'ประตูและหน้าต่าง', 'ระบบไฟฟ้าและความปลอดภัย', 'เฟอร์นิเจอร์นอกบ้าน & งานสวน', 'ห้องนอนและเครื่องนอน', 'สีและอุปกรณ์ทาสี', 'กีฬาและท่องเที่ยว', 'สุขภาพ', 'มือถือ ไอที แกดเจ็ต', 'ความงามและของใช้ส่วนตัว', 'ยานยนต์', 'อาหารและอุปกรณ์สัตว์เลี้ยง', 'แม่และเด็ก'].map((t) => M(t, [M(t, L('สินค้าแนะนำ', 'สินค้าขายดี', 'สินค้าใหม่'))])),
  ] },
  'footer-help': { links: L('วิธีการช้อปออนไลน์', 'คำถามที่พบบ่อย', 'การเปลี่ยน คืน เคลมสินค้า', 'ติดตามสินค้า') },
  'footer-benefits': { links: L('สมาชิก Home Card', 'บัตรเครดิตร่วม', 'บัตรผ่อนชำระ') },
  'footer-policy': { links: L('เงื่อนไขการใช้งาน', 'การส่งสินค้า', 'นโยบายความเป็นส่วนตัว', 'เอกสารการใช้คุกกี้', 'คำร้องขอใช้สิทธิ') },
  'footer-about': { links: L('ประวัติบริษัท', 'สาขาของเรา', 'นักลงทุนสัมพันธ์', 'ข่าวสารและกิจกรรม', 'สมัครงาน', 'ติดต่อเรา', 'Call Center 1284') },
};
const globals = {
  shop: { name: 'HomeStyle' }, cart: { item_count: 0 }, customer: null, search: {},
  request: { locale: { iso_code: 'th' } }, localization: { available_languages: [] },
  routes: { root_url: '/', search_url: '/search', cart_url: '/cart', cart_add_url: '/cart/add', account_url: '/account', account_login_url: '/account/login', account_register_url: '/account/register', account_addresses_url: '/account/addresses', collections_url: '/collections', all_products_collection_url: '/collections/all' },
  linklists,
  settings: { color_primary: '#0066B3', color_footer: '#0065B2', color_accent: '#F7931E', color_price: '#E4002B', color_soft: '#EAF4FC', chat_url: '#', social_facebook: '#', social_line: '#', social_instagram: '#', social_youtube: '#', social_x: '#' },
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&family=Lato:wght@400;700&display=swap">
<style>${css}</style>
${header}
<main id="main">${main}</main>
${footer}
<a class="chatfab" href="#"><i>🤖</i>แชท</a>
<div class="toast" role="status" data-toast></div>
<script>${stub}</script>
<script>${js}</script>
`;
fs.mkdirSync(path.join(ROOT, 'preview'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'preview', 'index.html'), html);
console.log('preview/index.html', (html.length / 1024).toFixed(0) + 'KB');
