import { put } from "@vercel/blob";
import { isAdmin } from "./_auth.js";

// Recibe una foto ya achicada en el navegador (JPEG en base64) y la guarda en Vercel Blob.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });
  if (!isAdmin(req)) return res.status(401).json({ error: "Contraseña incorrecta" });
  try {
    const { data, name } = req.body || {};
    const m = /^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(data || "");
    if (!m) return res.status(400).json({ error: "Formato de foto no válido" });
    const buf = Buffer.from(m[2], "base64");
    if (buf.length > 3_500_000) return res.status(413).json({ error: "La foto es muy pesada" });
    const slug = String(name || "producto").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "producto";
    const blob = await put(`productos/${slug}.${m[1] === "jpeg" ? "jpg" : m[1]}`, buf, {
      access: "public", contentType: `image/${m[1]}`, addRandomSuffix: true
    });
    return res.status(200).json({ url: blob.url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "No se pudo subir la foto" });
  }
}
