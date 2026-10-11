/* Panel de administración del catálogo */
const PASS_KEY = "ft_admin_pass";
let pass = "";
let items = [];        // copia de trabajo del catálogo
let saved = "";        // JSON de lo último guardado (para saber si hay cambios)
let editing = null;    // producto abierto en el editor
let filterQ = "", filterCat = "all";

const dirty = () => JSON.stringify(items) !== saved;
function getPass() { try { return sessionStorage.getItem(PASS_KEY) || ""; } catch (e) { return ""; } }
function setPass(v) { try { v ? sessionStorage.setItem(PASS_KEY, v) : sessionStorage.removeItem(PASS_KEY); } catch (e) {} }

let noteT;
function note(text, bad) {
  const t = $("#toast"); t.textContent = text; t.className = "toast show" + (bad ? " bad" : "");
  clearTimeout(noteT); noteT = setTimeout(() => t.classList.remove("show"), 3000);
}

async function api(path, body) {
  const r = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-pass": pass },
    body: JSON.stringify(body)
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(d.error || "Error " + r.status), { status: r.status });
  return d;
}

/* ---------- ingreso ---------- */
async function login(p) {
  pass = p;
  await api("/api/catalog", { check: true });
  setPass(p);
  await READY;
  items = PRODUCTS.map(normalize);
  saved = JSON.stringify(items);
  $("#login").hidden = true; $("#app").hidden = false;
  renderFilters(); renderList(); renderSave();
}
$("#loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const btn = $("#loginBtn"); btn.disabled = true; btn.textContent = "Entrando…";
  $("#loginErr").style.display = "none";
  try { await login($("#pass").value); }
  catch (err) {
    $("#loginErr").textContent = err.status === 401 ? "La contraseña no es correcta." : "No se pudo conectar. Probá de nuevo.";
    $("#loginErr").style.display = "block";
  }
  btn.disabled = false; btn.textContent = "Entrar";
});
$("#logout").onclick = () => {
  if (dirty() && !confirm("Tenés cambios sin guardar. ¿Salir igual?")) return;
  setPass(""); location.reload();
};
if (getPass()) login(getPass()).catch(() => setPass(""));

/* ---------- datos ---------- */
function normalize(p) {
  return {
    id: p.id, cat: p.cat, brand: p.brand || "", name: p.name || "", spec: p.spec || "",
    price: Number(p.price) || 0, desc: p.desc || "", feats: p.feats || [],
    imgs: photos(p), icon: p.icon || "", badge: p.badge || "",
    featured: !!p.featured, stock: p.stock !== false,
    ...(p.opts && p.opts.values && p.opts.values.length ? { opts: { label: p.opts.label, values: [...p.opts.values] } } : {})
  };
}

/* ---------- lista ---------- */
function renderFilters() {
  $("#fCat").innerHTML = `<option value="all">Todas las categorías</option>` + CATS.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  $("#eCat").innerHTML = CATS.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
}
function renderList() {
  const q = filterQ.trim().toLowerCase();
  const list = items.filter(p => (filterCat === "all" || p.cat === filterCat) &&
    (!q || `${p.brand} ${p.name} ${p.spec}`.toLowerCase().includes(q)));
  $("#count").textContent = `${items.length} productos · ${items.filter(p => !p.stock).length} sin stock`;
  $("#list").innerHTML = list.length ? list.map(p => `
    <div class="row" data-id="${p.id}">
      <div class="th ${tone(p)}" data-open>${thumb(p)}</div>
      <div class="nm" data-open><b>${esc(p.name) || "(sin nombre)"}</b>
        <small>${esc(getCat(p.cat).name)}${p.brand ? " · " + esc(p.brand) : ""}</small>${!p.stock ? '<span class="tagx out">Sin stock</span>' : ""}${p.featured ? '<span class="tagx star">Destacado</span>' : ""}</div>
      <label class="pr"><span>$</span><input inputmode="numeric" value="${p.price}" data-price aria-label="Precio de ${esc(p.name)}"></label>
      <label class="tg"><input type="checkbox" data-stock ${p.stock ? "checked" : ""}><span></span>Stock</label>
      <button class="edit" data-open>Editar</button>
    </div>`).join("") : `<div class="empty-a">No hay productos con ese filtro.</div>`;
}
const rowItem = el => items.find(p => p.id === +el.closest(".row").dataset.id);
$("#list").addEventListener("click", e => { if (e.target.closest("[data-open]")) openEditor(rowItem(e.target)); });
$("#list").addEventListener("input", e => {
  if (e.target.matches("[data-price]")) {
    e.target.value = e.target.value.replace(/\D/g, "");
    rowItem(e.target).price = Number(e.target.value) || 0; renderSave();
  }
});
$("#list").addEventListener("change", e => {
  if (e.target.matches("[data-stock]")) { rowItem(e.target).stock = e.target.checked; renderList(); renderSave(); }
});
$("#q").addEventListener("input", e => { filterQ = e.target.value; renderList(); });
$("#fCat").addEventListener("change", e => { filterCat = e.target.value; renderList(); });

/* ---------- guardar ---------- */
function renderSave() {
  const d = dirty();
  $("#savebar").classList.toggle("dirty", d);
  $("#saveMsg").textContent = d ? "Tenés cambios sin guardar" : "Todo guardado · lo que ves es lo que está en la tienda";
  $("#save").disabled = !d; $("#discard").hidden = !d;
}
$("#save").onclick = async () => {
  const btn = $("#save"); btn.disabled = true; btn.textContent = "Guardando…";
  try {
    await api("/api/catalog", { products: items });
    saved = JSON.stringify(items); renderSave();
    note("¡Guardado! Ya se ve en la tienda.");
  } catch (err) {
    note(err.status === 401 ? "La sesión venció. Volvé a entrar." : "No se pudo guardar. Probá de nuevo.", true);
    btn.disabled = false;
  }
  btn.textContent = "Guardar cambios";
};
$("#discard").onclick = () => {
  if (!confirm("¿Descartar los cambios que no guardaste?")) return;
  items = JSON.parse(saved); renderList(); renderSave();
};
window.addEventListener("beforeunload", e => { if (dirty()) { e.preventDefault(); e.returnValue = ""; } });

/* ---------- editor ---------- */
function openEditor(p) {
  editing = p;
  $("#eTitle").textContent = p.name ? "Editar producto" : "Nuevo producto";
  $("#eName").value = p.name; $("#eBrand").value = p.brand; $("#eCat").value = p.cat;
  $("#ePrice").value = p.price || ""; $("#eBadge").value = p.badge; $("#eSpec").value = p.spec;
  $("#eDesc").value = p.desc; $("#eFeats").value = p.feats.join("\n");
  $("#eOptLabel").value = p.opts ? p.opts.label : ""; $("#eOptVals").value = p.opts ? p.opts.values.join(", ") : "";
  $("#eStock").checked = p.stock; $("#eFeat").checked = p.featured;
  $("#upStatus").textContent = ""; $("#upStatus").className = "up-status";
  renderPics();
  $("#editor").classList.add("open"); $("#shade").classList.add("open");
  $(".e-body").scrollTop = 0;
}
function readEditor() {
  const p = editing; if (!p) return;
  p.name = $("#eName").value.trim(); p.brand = $("#eBrand").value.trim(); p.cat = $("#eCat").value;
  p.price = Number($("#ePrice").value.replace(/\D/g, "")) || 0;
  p.badge = $("#eBadge").value.trim(); p.spec = $("#eSpec").value.trim(); p.desc = $("#eDesc").value.trim();
  p.feats = $("#eFeats").value.split("\n").map(s => s.trim()).filter(Boolean);
  const vals = $("#eOptVals").value.split(",").map(s => s.trim()).filter(Boolean);
  if (vals.length) p.opts = { label: $("#eOptLabel").value.trim() || "Opción", values: vals }; else delete p.opts;
  p.stock = $("#eStock").checked; p.featured = $("#eFeat").checked;
}
function closeEditor() {
  readEditor();
  if (editing && !editing.name) {
    if (!confirm("El producto no tiene nombre. ¿Lo borramos?")) return;
    items = items.filter(x => x !== editing);
  }
  editing = null;
  $("#editor").classList.remove("open"); $("#shade").classList.remove("open");
  renderList(); renderSave();
}
$("#eOk").onclick = closeEditor; $("#eClose").onclick = closeEditor; $("#shade").onclick = closeEditor;
document.addEventListener("keydown", e => { if (e.key === "Escape" && editing) closeEditor(); });
$("#ePrice").addEventListener("input", e => e.target.value = e.target.value.replace(/\D/g, ""));
$("#eDelete").onclick = () => {
  if (!confirm(`¿Borrar "${editing.name || "este producto"}" del catálogo?`)) return;
  items = items.filter(x => x !== editing); editing = null;
  $("#editor").classList.remove("open"); $("#shade").classList.remove("open");
  renderList(); renderSave(); note("Producto borrado. Acordate de guardar.");
};
$("#newBtn").onclick = () => {
  const p = { id: Math.max(0, ...items.map(x => x.id)) + 1, cat: filterCat === "all" ? CATS[0].id : filterCat, brand: "", name: "", spec: "",
    price: 0, desc: "", feats: [], imgs: [], icon: "", badge: "", featured: false, stock: true };
  items.unshift(p); openEditor(p);
};

/* ---------- fotos ---------- */
function renderPics() {
  $("#pics").innerHTML = editing.imgs.map((u, i) => `
    <div class="pic-it${i ? "" : " main"}"><img src="${esc(u)}" alt="">
      ${i ? "" : '<span class="main-tag">Principal</span>'}
      <div class="acts">${i ? `<button type="button" data-main="${i}" title="Hacer principal">★</button>` : ""}<button type="button" data-del="${i}" title="Quitar">✕</button></div>
    </div>`).join("");
}
$("#pics").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.del) editing.imgs.splice(+b.dataset.del, 1);
  if (b.dataset.main) editing.imgs.unshift(editing.imgs.splice(+b.dataset.main, 1)[0]);
  renderPics(); renderSave();
});
function shrink(file, max = 1200) {
  return new Promise((ok, fail) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
      g.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); ok(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); fail(new Error("No se pudo leer la foto")); };
    img.src = url;
  });
}
$("#file").addEventListener("change", async e => {
  const files = [...e.target.files]; e.target.value = "";
  if (!files.length) return;
  const st = $("#upStatus"), target = editing;
  st.className = "up-status";
  let done = 0, failed = 0;
  for (const f of files) {
    st.textContent = `Subiendo foto ${done + failed + 1} de ${files.length}…`;
    try {
      const data = await shrink(f);
      const { url } = await api("/api/upload", { data, name: $("#eName").value || "producto" });
      target.imgs.push(url); done++;
      if (editing === target) renderPics();
    } catch (err) { failed++; }
  }
  st.textContent = failed ? `Se subieron ${done} y fallaron ${failed}. Probá de nuevo con las que faltan.` : `Listo: ${done} foto${done === 1 ? "" : "s"} subida${done === 1 ? "" : "s"}. Acordate de guardar.`;
  if (failed) st.className = "up-status err";
  renderSave();
});
