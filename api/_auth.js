import { createHash, timingSafeEqual } from "node:crypto";

// Hash SHA-256 de la contraseña del panel. Si se carga ADMIN_PASSWORD en Vercel, manda esa.
const PASS_HASH = "252dcfe539bfec810f003bc07822b03dde5760a1ec08e731224196d637db997f";

const sha = s => createHash("sha256").update(String(s)).digest();

export function isAdmin(req) {
  const given = req.headers["x-admin-pass"] || "";
  const expected = process.env.ADMIN_PASSWORD ? sha(process.env.ADMIN_PASSWORD) : Buffer.from(PASS_HASH, "hex");
  return timingSafeEqual(sha(given), expected);
}
