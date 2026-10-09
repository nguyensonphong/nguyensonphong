(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const toastEl = $('[data-toast]');
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove('is-on'), 1800);
  }

  // Banner trượt
  $$('[data-slider]').forEach((el) => {
    const track = $('[data-track]', el);
    const slides = track ? track.children : [];
    const dots = $('[data-dots]', el);
    let i = 0;
    if (slides.length < 2) { $$('[data-prev],[data-next]', el).forEach((b) => (b.hidden = true)); return; }
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      $$('button', dots).forEach((d, k) => d.classList.toggle('is-active', k === i));
    };
    for (let k = 0; k < slides.length; k++) {
      const d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', `Slide ${k + 1}`);
      d.addEventListener('click', () => go(k));
      dots.appendChild(d);
    }
    $('[data-prev]', el).addEventListener('click', () => go(i - 1));
    $('[data-next]', el).addEventListener('click', () => go(i + 1));
    go(0);
    const sec = Number(el.dataset.autoplay || 0);
    if (sec > 0 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let timer = setInterval(() => go(i + 1), sec * 1000);
      el.addEventListener('mouseenter', () => clearInterval(timer));
      el.addEventListener('mouseleave', () => (timer = setInterval(() => go(i + 1), sec * 1000)));
    }
  });

  // Mega menu
  const mega = $('[data-mega]');
  $$('[data-mega-toggle]').forEach((b) =>
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = mega.classList.toggle('is-open');
      b.setAttribute('aria-expanded', open);
    })
  );
  document.addEventListener('click', (e) => { if (mega && !mega.contains(e.target)) mega.classList.remove('is-open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mega) mega.classList.remove('is-open'); });
  $$('[data-mega-tab]').forEach((b) => {
    const show = () => {
      $$('[data-mega-tab]').forEach((x) => x.classList.toggle('is-active', x === b));
      $$('[data-mega-panel]').forEach((p) => (p.hidden = p.dataset.megaPanel !== b.dataset.megaTab));
    };
    b.addEventListener('mouseenter', show);
    b.addEventListener('click', show);
  });

  // Tab trong dải sản phẩm
  $$('[data-tabs]').forEach((sec) => {
    $$('[data-tab]', sec).forEach((t) =>
      t.addEventListener('click', () => {
        $$('[data-tab]', sec).forEach((x) => x.classList.toggle('is-active', x === t));
        $$('[data-panel]', sec).forEach((p) => (p.hidden = p.dataset.panel !== t.dataset.tab));
      })
    );
  });

  // Đếm ngược Flash Sale
  $$('[data-countdown]').forEach((el) => {
    const end = new Date(el.dataset.countdown).getTime();
    if (isNaN(end)) return;
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      const s = Math.max(0, Math.floor((end - Date.now()) / 1000));
      $('[data-h]', el).textContent = pad(Math.floor(s / 3600));
      $('[data-m]', el).textContent = pad(Math.floor(s / 60) % 60);
      $('[data-s]', el).textContent = pad(s % 60);
      if (s > 0) setTimeout(tick, 1000);
    };
    tick();
  });

  // Coupon: Shopify áp dụng 1 mã mỗi đơn. "Dùng mã" gọi /discount/MÃ để gắn mã vào phiên thanh toán.
  let current = null;
  try { current = localStorage.getItem('coupon'); } catch (e) {}
  const markCoupon = () => {
    $$('[data-coupon]').forEach((b) => {
      const on = b.dataset.coupon === current;
      b.textContent = on ? 'Đang dùng' : 'Dùng mã';
      b.classList.toggle('is-done', on);
    });
    $$('[data-coupon-current]').forEach((el) => (el.textContent = current || 'Chưa có'));
  };
  $$('[data-coupon]').forEach((b) =>
    b.addEventListener('click', async () => {
      const code = b.dataset.coupon;
      try { await fetch(`/discount/${encodeURIComponent(code)}`, { credentials: 'same-origin' }); } catch (e) {}
      current = code;
      try { localStorage.setItem('coupon', code); } catch (e) {}
      markCoupon();
      toast(`Đã chọn mã ${code}. Mã sẽ tự áp dụng khi thanh toán`);
    })
  );
  markCoupon();

  // Thêm vào giỏ bằng AJAX
  $$('[data-add-form]').forEach((f) =>
    f.addEventListener('submit', async (e) => {
      if (!window.fetch) return;
      e.preventDefault();
      try {
        const res = await fetch('/cart/add.js', { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(f) });
        if (!res.ok) throw new Error((await res.json()).description || 'error');
        const cart = await (await fetch('/cart.js')).json();
        $$('[data-cart-count]').forEach((c) => (c.textContent = cart.item_count));
        toast('Đã thêm vào giỏ');
      } catch (err) {
        toast(err.message === 'error' ? 'Không thêm được sản phẩm, hãy thử lại' : err.message);
      }
    })
  );

  // Yêu thích (lưu trên trình duyệt)
  let favs = [];
  try { favs = JSON.parse(localStorage.getItem('favs') || '[]'); } catch (e) {}
  $$('[data-fav]').forEach((b) => {
    const id = b.closest('.pcard')?.querySelector('a')?.getAttribute('href');
    if (favs.includes(id)) b.classList.add('is-on');
    b.addEventListener('click', () => {
      b.classList.toggle('is-on');
      favs = b.classList.contains('is-on') ? [...favs, id] : favs.filter((x) => x !== id);
      try { localStorage.setItem('favs', JSON.stringify(favs)); } catch (e) {}
    });
  });

  // Đoạn SEO: đọc tất cả
  $$('[data-clamp-toggle]').forEach((b) =>
    b.addEventListener('click', () => {
      const c = b.previousElementSibling;
      const open = c.classList.toggle('clamp');
      b.textContent = open ? 'Đọc tiếp' : 'Thu gọn';
    })
  );

  window.HP = { toast };
})();

// Trang chi tiết: đổi ảnh khi bấm thumbnail
document.querySelectorAll('[data-thumb]').forEach((b) => b.addEventListener('click', () => {
  const img = document.querySelector('[data-stage]');
  if (img) { img.src = b.dataset.thumb; img.removeAttribute('srcset'); }
}));
// Trang danh mục: tự áp dụng khi đổi bộ lọc / sắp xếp, "Xem thêm", mở bộ lọc trên điện thoại
const filterForm = document.querySelector('[data-filters]');
if (filterForm) {
  const submit = () => {
    const params = new URLSearchParams(new FormData(filterForm));
    for (const [k, v] of [...params]) if (v === '') params.delete(k);
    location.search = params.toString();
  };
  filterForm.addEventListener('change', (e) => { if (e.target.type === 'checkbox') submit(); });
  filterForm.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
  document.querySelectorAll('[data-sort]').forEach((s) => s.addEventListener('change', submit));
  filterForm.querySelectorAll('[data-more]').forEach((b) => b.addEventListener('click', () => {
    const f = b.closest('.facet'); f.classList.toggle('is-expanded');
    b.textContent = f.classList.contains('is-expanded') ? 'Thu gọn' : 'Xem thêm';
  }));
  document.querySelectorAll('[data-filter-toggle]').forEach((b) => b.addEventListener('click', () => filterForm.classList.toggle('is-open')));
}

// Hệ thống cửa hàng: lọc theo khu vực
document.querySelectorAll('[data-region-tabs]').forEach((bar) => bar.addEventListener('click', (e) => {
  const b = e.target.closest('[data-region]'); if (!b) return;
  bar.querySelectorAll('[data-region]').forEach((x) => x.classList.toggle('is-active', x === b));
  document.querySelectorAll('[data-store-region]').forEach((c) => { c.hidden = !!b.dataset.region && c.dataset.storeRegion !== b.dataset.region; });
}));

// Giỏ hàng: nút +/- rồi tự cập nhật
document.querySelectorAll('[data-cart-form] [data-step]').forEach((b) => b.addEventListener('click', () => {
  const input = b.parentElement.querySelector('[data-qty]');
  input.value = Math.max(0, (parseInt(input.value, 10) || 0) + Number(b.dataset.step));
  clearTimeout(window.__cartT);
  window.__cartT = setTimeout(() => { const f = b.closest('form'); const u = document.createElement('input'); u.type = 'hidden'; u.name = 'update'; u.value = '1'; f.appendChild(u); f.submit(); }, 500);
}));
// Mega menu trên điện thoại: bấm nhóm thì mở danh mục con ngay bên dưới
(() => {
  const mq = matchMedia('(max-width:760px)');
  document.querySelectorAll('[data-mega-tab]').forEach((b) => b.addEventListener('click', () => {
    if (!mq.matches) return;
    const panel = document.querySelector(`[data-mega-panel="${b.dataset.megaTab}"]`);
    if (!panel) return;
    const li = b.closest('li');
    const open = panel.parentElement === li && !panel.hidden;
    document.querySelectorAll('[data-mega-panel]').forEach((p) => (p.hidden = true));
    if (!open) { li.appendChild(panel); panel.hidden = false; }
  }));
  document.querySelectorAll('[data-mega-close]').forEach((b) => b.addEventListener('click', () => document.querySelector('[data-mega]')?.classList.remove('is-open')));
})();
