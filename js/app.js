/* Partes comunes a todas las páginas: encabezado, pie, carrito y utilidades */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const money = n => "$" + Math.round(n).toLocaleString("es-AR");
const waLink = msg => `https://wa.me/${SHOP.wa}?text=${encodeURIComponent(msg)}`;
const getCat = id => CATS.find(c => c.id === id) || CATS[0];
const getProd = id => PRODUCTS.find(p => p.id === +id);
const prodName = p => (p.brand === "Full Tech" ? "" : p.brand + " ") + p.name;
const thumb = p => p.img ? `<img src="${p.img}" alt="${esc(prodName(p))}" loading="lazy">` : ICONS[p.icon];
const tone = p => p.img ? "" : getCat(p.cat).t;
const params = new URLSearchParams(location.search);

/* ---------- abierto / cerrado ---------- */
function isOpen(d = new Date()) {
  const m = d.getHours() * 60 + d.getMinutes();
  return SHOP.hours.some(([day, a, b]) => day === d.getDay() && m >= a && m < b);
}

/* ---------- carrito (se guarda en el navegador) ---------- */
const Cart = {
  key: "ft_cart_v2",
  read() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return this._mem || []; } },
  write(list) { this._mem = list; try { localStorage.setItem(this.key, JSON.stringify(list)); } catch (e) {} updateCount(); },
  items() { return this.read().map(l => ({ ...l, p: getProd(l.id) })).filter(l => l.p); },
  add(id, qty = 1, opt = "") {
    const list = this.read();
    const line = list.find(l => l.id === id && l.opt === opt);
    if (line) line.q += qty; else list.push({ id, opt, q: qty });
    this.write(list);
  },
  set(i, q) { const list = this.read(); if (q <= 0) list.splice(i, 1); else list[i].q = q; this.write(list); },
  count() { return this.read().reduce((s, l) => s + l.q, 0); },
  total() { return this.items().reduce((s, l) => s + l.p.price * l.q, 0); },
  clear() { this.write([]); }
};
function updateCount() {
  const n = $("#cartN"); if (n) n.textContent = Cart.count();
}
function addToCart(id, qty = 1, opt = "") {
  Cart.add(id, qty, opt);
  const p = getProd(id);
  toast(`${prodName(p)} al carrito`, true);
  const b = $("#cartBtn"); if (b) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
}

/* ---------- tarjeta de producto ---------- */
function card(p) {
  const url = `producto.html?id=${p.id}`;
  return `<article class="prod">
    <a href="${url}" class="pic ${tone(p)}">${thumb(p)}${p.badge ? `<span class="badge">${p.badge}</span>` : ""}</a>
    <div class="body">
      <span class="brand">${p.brand}</span>
      <h3><a href="${url}">${p.name}</a></h3>
      <span class="spec">${p.spec}</span>
      <div class="foot"><span class="price">${money(p.price)}</span>
        ${p.opts ? `<a class="add" href="${url}">Elegir</a>` : `<button class="add" data-add="${p.id}">+ Agregar</button>`}</div>
    </div>
  </article>`;
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-add]"); if (!b) return;
  addToCart(+b.dataset.add);
  b.classList.add("ok"); b.textContent = "✓ Agregado";
  setTimeout(() => { b.classList.remove("ok"); b.textContent = "+ Agregar"; }, 1200);
});

/* ---------- toast ---------- */
let toastT;
function toast(text, withLink) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
  t.innerHTML = `<span>${esc(text)}</span>${withLink ? '<a href="carrito.html">Ver carrito</a>' : ""}`;
  t.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- encabezado y pie ---------- */
const LOGO = `F<svg viewBox="0 0 24 24" fill="none" stroke="#76AD2C" stroke-width="3.2" stroke-linecap="round"><path d="M12 3v8"/><path d="M6.6 7.2a7.5 7.5 0 1 0 10.8 0"/></svg>ll<em>Tech</em>`;
const NAV = [
  ["index.html", "Inicio"], ["catalogo.html", "Catálogo"], ["servicio-tecnico.html", "Servicio técnico"], ["local.html", "El local"]
];
function renderChrome() {
  const page = document.body.dataset.page;
  const open = isOpen();
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="demo">Demo armada por TNR · Los productos y precios son de ejemplo: el catálogo real lo carga Full Tech.</div>
    <header class="hdr"><div class="wrap nav">
      <a href="index.html" class="logo" aria-label="Full Tech, inicio">${LOGO}</a>
      <nav class="links" id="links">${NAV.map(([h, t]) => `<a href="${h}" class="${h.startsWith(page) ? "on" : ""}">${t}</a>`).join("")}</nav>
      <a href="local.html" class="status ${open ? "on" : "off"}"><i></i><span>${open ? "Abierto ahora" : "Cerrado ahora"}</span></a>
      <a href="carrito.html" class="cart-btn" id="cartBtn" aria-label="Ver carrito">${ICONS.cart.replace("<svg", '<svg class="ico"')}<span class="lbl">Carrito</span><span class="n" id="cartN">0</span></a>
      <button class="burger" id="burger" aria-label="Menú"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    </div></header>`);
  document.body.insertAdjacentHTML("beforeend", `
    <footer class="ftr"><div class="wrap">
      <div class="ftr-grid">
        <div><a href="index.html" class="logo">${LOGO}</a><p>Celulares, accesorios y servicio técnico en Merlo.</p></div>
        <div><h4>Tienda</h4><ul>${CATS.map(c => `<li><a href="catalogo.html?cat=${c.id}">${c.name}</a></li>`).join("")}</ul></div>
        <div><h4>Ayuda</h4><ul><li><a href="carrito.html">Mi carrito</a></li><li><a href="servicio-tecnico.html">Servicio técnico</a></li><li><a href="local.html">Horarios y ubicación</a></li><li><a href="servicio-tecnico.html#preguntas">Preguntas frecuentes</a></li></ul></div>
        <div><h4>Contacto</h4><ul><li>${SHOP.address}, Merlo</li><li><a href="${waLink("Hola Full Tech!")}" target="_blank" rel="noopener">WhatsApp ${SHOP.waShow}</a></li><li><a href="${SHOP.instagram}" target="_blank" rel="noopener">Instagram @ffulltech</a></li><li><a href="${SHOP.channel}" target="_blank" rel="noopener">Canal de novedades</a></li></ul></div>
      </div>
      <div class="ftr-bottom"><span>© ${new Date().getFullYear()} Full Tech · Merlo</span><span>Web hecha por TNR · Tu Negocio en las Redes</span></div>
    </div></footer>
    <a href="${waLink("Hola Full Tech! Quería hacer una consulta.")}" target="_blank" rel="noopener" class="fab" aria-label="Escribinos por WhatsApp">${ICONS.wa}</a>`);
  $("#burger").onclick = () => $("#links").classList.toggle("open");
  document.querySelectorAll("[data-wa]").forEach(a => { a.href = waLink(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
  updateCount();
}
renderChrome();
window.addEventListener("storage", updateCount);
