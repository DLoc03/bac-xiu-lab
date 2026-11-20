// Blog nhật ký Bạc Xỉu — trang chủ: tải data/posts.json, lọc theo chủ đề, phân trang 4 bài/trang.
const PAGE_SIZE = 4;
// Số bài hiện có — cập nhật con số này mỗi khi đăng bài mới, để skeleton hiện đúng số card của trang 1.
const EXPECTED_POSTS = 1;
let posts = [], filter = 'Tất cả', page = 1;

// Skeleton chờ tải: chỉnh số card skeleton trong danh sách cho khớp số bài của trang 1.
(function syncSkeletons(){
  const feed = document.querySelector('#feed');
  if (!feed) return;
  const want = Math.max(1, Math.min(EXPECTED_POSTS, PAGE_SIZE));
  const proto = feed.querySelector('.skl');
  if (!proto) return;
  while (feed.querySelectorAll('.skl').length < want) feed.appendChild(proto.cloneNode(true));
  while (feed.querySelectorAll('.skl').length > want) feed.querySelector('.skl').remove();
})();

const $ = s => document.querySelector(s);

function fmtDate(iso){
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
}
function filtered(){
  return filter === 'Tất cả' ? posts : posts.filter(p => p.category === filter);
}
function renderFilters(){
  const cats = ['Tất cả', ...new Set(posts.map(p => p.category))];
  const box = $('#filters'); box.innerHTML = '';
  cats.forEach(c => {
    const b = document.createElement('button');
    b.className = 'fchip' + (c === filter ? ' on' : '');
    b.textContent = c;
    b.addEventListener('click', () => { filter = c; page = 1; render(); });
    box.appendChild(b);
  });
}
function render(){
  renderFilters();
  const list = filtered();
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  if (page > totalPages) page = totalPages;
  const start = (page - 1) * PAGE_SIZE;
  const slice = list.slice(start, start + PAGE_SIZE);
  const feed = $('#feed'); feed.innerHTML = '';
  if (!slice.length){
    feed.innerHTML = '<div class="empty">Chưa có bài nào ở mục này. Quay lại sau nhé — nhật ký này viết thi thoảng thôi.</div>';
  }
  slice.forEach(p => {
    const a = document.createElement('a');
    a.className = 'post glass'; a.href = 'post/' + p.slug + '/';
    a.innerHTML = '<img loading="lazy" alt=""><div class="body"><div class="date"></div><h3></h3><p></p><div class="tags"></div></div>';
    a.querySelector('img').src = p.image; a.querySelector('img').alt = p.title;
    a.querySelector('.date').textContent = fmtDate(p.date) + ' · ' + p.category;
    a.querySelector('h3').textContent = p.title;
    a.querySelector('p').textContent = p.excerpt;
    (p.tags || []).forEach(t => {
      const s = document.createElement('span'); s.className = 'tag'; s.textContent = t;
      a.querySelector('.tags').appendChild(s);
    });
    feed.appendChild(a);
  });
  $('#countLabel').textContent = list.length + ' bài';
  const stat = $('#statPosts'); if (stat) stat.textContent = posts.length;
  const pager = $('#pager');
  if (totalPages <= 1){ pager.className = 'pager'; pager.innerHTML = ''; return; }
  pager.className = 'pager show'; pager.innerHTML = '';
  const mk = (label, go, opts = {}) => {
    const b = document.createElement('button');
    b.textContent = label;
    if (opts.on) b.className = 'on';
    if (opts.disabled) b.disabled = true;
    b.addEventListener('click', () => { page = go; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    pager.appendChild(b);
  };
  mk('← Trước', page - 1, { disabled: page <= 1 });
  for (let i = 1; i <= totalPages; i++) mk(String(i), i, { on: i === page });
  mk('Sau →', page + 1, { disabled: page >= totalPages });
  const info = document.createElement('div');
  info.className = 'info';
  info.textContent = 'Trang ' + page + '/' + totalPages + ' · Hiển thị ' + slice.length + ' trong ' + list.length + ' bài';
  pager.appendChild(info);
}
function renderLatest(){
  const card = $('#latestCard');
  const skl = $('#latestSkl');
  if (skl) skl.remove();
  if (!card) return;
  card.hidden = false;
  if (!posts.length) return;
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date))[0];
  card.href = 'post/' + latest.slug + '/';
  const img = card.querySelector('img');
  img.src = latest.image; img.alt = latest.title;
  card.querySelector('.latest-date').textContent = fmtDate(latest.date) + ' · ' + latest.category;
  card.querySelector('.latest-title').textContent = latest.title;
}
// Banner hero kiểu "Live Photo": ảnh chuyển động rất nhẹ theo con trỏ chuột (desktop)
// hoặc theo hướng nghiêng điện thoại (mobile, cảm biến deviceorientation).
(function heroLivePhoto(){
  const hero = document.querySelector('.hero');
  const bg = document.querySelector('.hero-bg');
  if (!hero || !bg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let tx = 0, ty = 0, cx = 0, cy = 0, running = false, visible = true;
  function loop(){
    cx += (tx - cx) * 0.055;
    cy += (ty - cy) * 0.055;
    bg.style.transform = 'translate(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px) scale(1.12)';
    if (visible && (Math.abs(tx - cx) > 0.02 || Math.abs(ty - cy) > 0.02 || tx !== 0 || ty !== 0)) {
      requestAnimationFrame(loop);
    } else { running = false; }
  }
  function kick(){ if (!running && visible){ running = true; requestAnimationFrame(loop); } }
  if ('IntersectionObserver' in window){
    new IntersectionObserver(en => { visible = en[0].isIntersecting; if (visible) kick(); }).observe(hero);
  }
  // Desktop: con trỏ chuột di chuyển trên banner
  hero.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    const r = hero.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    tx = -nx * 12; ty = -ny * 8; kick();
  });
  hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
  // Mobile: nghiêng điện thoại (gamma = trái/phải, beta = trước/sau)
  let base = null;
  function onOrientation(e){
    if (e.gamma === null || e.beta === null) return;
    if (!base) base = { g: e.gamma, b: e.beta };
    const dx = Math.max(-1, Math.min(1, (e.gamma - base.g) / 14));
    const dy = Math.max(-1, Math.min(1, (e.beta - base.b) / 14));
    tx = dx * 12; ty = dy * 9; kick();
  }
  if (window.DeviceOrientationEvent){
    if (typeof DeviceOrientationEvent.requestPermission === 'function'){
      // iOS: cần người dùng chạm một lần để cấp quyền cảm biến — chạm vào banner là bật, không bật hộp thoại lạ.
      hero.addEventListener('click', async () => {
        try {
          const res = await DeviceOrientationEvent.requestPermission();
          if (res === 'granted') window.addEventListener('deviceorientation', onOrientation);
        } catch (_) { /* người dùng không cấp quyền thì thôi, banner đứng yên */ }
      }, { once: true });
    } else {
      window.addEventListener('deviceorientation', onOrientation);
    }
  }
})();

fetch('data/posts.json', { cache: 'no-store' })
  .then(r => r.json())
  .then(d => { posts = d.posts || []; render(); renderLatest(); })
  .catch(() => {
    $('#feed').innerHTML = '<div class="empty">Chưa tải được danh sách bài viết. Bạn thử tải lại trang nhé.</div>';
    const skl = $('#latestSkl'); if (skl) skl.remove();
    const card = $('#latestCard'); if (card) card.hidden = false;
  });
