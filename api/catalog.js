import { list, put, del } from "@vercel/blob";
import { isAdmin } from "./_auth.js";

// El catálogo se guarda como catalog/<fecha>.json; siempre se lee el más nuevo.
const PREFIX = "catalog/";
const KEEP = 10; // versiones viejas que se guardan como respaldo

async function versions() {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  return blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}

function clean(p, i) {
  const str = (v, max = 400) => String(v ?? "").slice(0, max).trim();
  const out = {
    id: Number(p.id) || i + 1,
    cat: str(p.cat, 20),
    brand: str(p.brand, 60),
    name: str(p.name, 120),
    spec: str(p.spec, 160),
    price: Math.max(0, Math.round(Number(p.price) || 0)),
    desc: str(p.desc, 2000),
    feats: (Array.isArray(p.feats) ? p.feats : []).map(f => str(f, 200)).filter(Boolean).slice(0, 20),
    imgs: (Array.isArray(p.imgs) ? p.imgs : []).map(u => str(u, 500)).filter(u => /^(https:\/\/|img\/)/.test(u)).slice(0, 8),
    icon: str(p.icon, 20),
    badge: str(p.badge, 30),
    featured: !!p.featured,
    stock: p.stock !== false
  };
  if (p.opts && Array.isArray(p.opts.values) && p.opts.values.length) {
    out.opts = { label: str(p.opts.label, 40) || "Opción", values: p.opts.values.map(v => str(v, 60)).filter(Boolean).slice(0, 30) };
  }
  return out;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      const [last] = await versions();
      if (!last) return res.status(200).json({ products: null });
      const data = await fetch(last.url, { cache: "no-store" }).then(r => r.json());
      return res.status(200).json({ products: data.products, updatedAt: last.uploadedAt });
    }
    if (req.method === "POST") {
      if (!isAdmin(req)) return res.status(401).json({ error: "Contraseña incorrecta" });
      const body = req.body || {};
      if (body.check) return res.status(200).json({ ok: true });
      if (!Array.isArray(body.products)) return res.status(400).json({ error: "Faltan los productos" });
      if (body.products.length > 1000) return res.status(400).json({ error: "Demasiados productos" });
      const products = body.products.map(clean);
      await put(`${PREFIX}${Date.now()}.json`, JSON.stringify({ products }), {
        access: "public", contentType: "application/json", addRandomSuffix: true
      });
      const old = (await versions()).slice(KEEP).map(b => b.url);
      if (old.length) await del(old);
      return res.status(200).json({ ok: true, count: products.length });
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Método no permitido" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "No se pudo acceder al catálogo" });
  }
}
