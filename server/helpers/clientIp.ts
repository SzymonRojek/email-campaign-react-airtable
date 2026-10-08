import { Request } from "express";

// the visitor's own address - for the limits (wrong passwords, feedback)
// Render runs behind Cloudflare: req.ip would be a Cloudflare address shared by many
// visitors, so one person's mistakes would block others. Cloudflare puts the real
// address in CF-Connecting-IP (and overwrites one sent by the visitor); without
// Cloudflare (locally, in tests) req.ip is used
export const clientIp = (req: Request) => req.get("cf-connecting-ip") || req.ip || "";
