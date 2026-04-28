const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
const sunIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>';
const moonIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5z"></path></svg>';

function setThemeIcon(theme) {
  const icon = theme === 'light' ? moonIcon : sunIcon;
  themeToggle.querySelector('.theme-icon').innerHTML = icon;
}

if (savedTheme === 'light') {
  root.setAttribute('data-theme', 'light');
  setThemeIcon('light');
} else {
  setThemeIcon('dark');
}
themeToggle.addEventListener('click', () => {
  const cur = root.getAttribute('data-theme');
  const next = cur === 'light' ? 'dark' : 'light';
  if (next === 'dark') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', 'light');
  localStorage.setItem('theme', next);
  setThemeIcon(next);
});

const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c => {
      if (f === 'all' || c.dataset.cat === f) c.classList.remove('hidden');
      else c.classList.add('hidden');
    });
  });
});

const form = document.getElementById('contactForm');
const statusEl = document.getElementById('form-status');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;
  document.querySelectorAll('.form-error').forEach(err => err.classList.remove('show'));

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name) { valid = false; document.querySelector('[data-for="name"]').classList.add('show'); }
  if (!email || !emailRe.test(email)) { valid = false; document.querySelector('[data-for="email"]').classList.add('show'); }
  if (!message) { valid = false; document.querySelector('[data-for="message"]').classList.add('show'); }

  if (valid) {
    const subject = encodeURIComponent(form.subject.value.trim() || 'Hello from your portfolio!');
    const body = encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message);
    const mailto = 'mailto:uddiniftekhar84@gmail.com?subject=' + subject + '&body=' + body;

    statusEl.className = 'success';
    statusEl.textContent = '✓ Thanks ' + name.split(' ')[0] + ' — opening your mail client...';

    setTimeout(() => { window.location.href = mailto; }, 600);
    form.reset();
    setTimeout(() => { statusEl.style.display = 'none'; }, 6000);
  }
});

const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
window.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});
function rafRing() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(rafRing);
}
rafRing();
document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

function updateClock() {
  const now = new Date();
  const opts = { timeZone: 'Asia/Dhaka', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  document.getElementById('liveTime').textContent = now.toLocaleTimeString('en-GB', opts) + ' BDT';
}
updateClock();
setInterval(updateClock, 1000);

const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let nodes = [];
let mouseX = -1000, mouseY = -1000;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initNodes();
}
function initNodes() {
  nodes = [];
  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5
    });
  }
}
function getAccent() {
  const isLight = root.getAttribute('data-theme') === 'light';
  return isLight ? '3, 105, 161' : '125, 211, 252';
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const accent = getAccent();

  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

    const dx = n.x - mouseX;
    const dy = n.y - mouseY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 120) {
      n.x += dx / dist * 0.8;
      n.y += dy / dist * 0.8;
    }

    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(' + accent + ', 0.6)';
    ctx.fill();
  });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i+1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 130) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = 'rgba(' + accent + ', ' + (0.18 * (1 - d/130)) + ')';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}
window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animate();
