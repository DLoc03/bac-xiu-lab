// Blog nhật ký Bạc Xỉu — trang chủ: tải data/posts.json, lọc theo chủ đề, phân trang 4 bài/trang.
const PAGE_SIZE = 4;
let posts = [], filter = 'Tất cả', page = 1;

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
  if (!card || !posts.length) return;
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date))[0];
  card.href = 'post/' + latest.slug + '/';
  const img = card.querySelector('img');
  img.src = latest.image; img.alt = latest.title;
  card.querySelector('.latest-date').textContent = fmtDate(latest.date) + ' · ' + latest.category;
  card.querySelector('.latest-title').textContent = latest.title;
}
fetch('data/posts.json', { cache: 'no-store' })
  .then(r => r.json())
  .then(d => { posts = d.posts || []; render(); renderLatest(); })
  .catch(() => { $('#feed').innerHTML = '<div class="empty">Chưa tải được danh sách bài viết. Bạn thử tải lại trang nhé.</div>'; });
