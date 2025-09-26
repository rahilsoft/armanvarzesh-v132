"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildJwtVerifier = buildJwtVerifier;
exports.subjectFromReq = subjectFromReq;
const jose_1 = require("jose");
function buildJwtVerifier(opts = {}) {
    const jwksUrl = opts.jwksUrl || process.env.JWKS_URL;
    if (!jwksUrl) {
        // no-op middleware if not configured
        return (_req, _res, next) => next();
    }
    const cacheMaxAge = typeof opts.cacheMaxAge === 'number' ? opts.cacheMaxAge : 10 * 60 * 1000;
    const JWKS = (0, jose_1.createRemoteJWKSet)(new URL(jwksUrl), { cacheMaxAge });
    const hdr = (opts.authHeader || process.env.AUTH_HEADER || "authorization").toLowerCase();
    const algs = opts.algorithms || (process.env.JWT_ALGS ? process.env.JWT_ALGS.split(",") : undefined);
    const iss = opts.issuer || process.env.JWT_ISSUER;
    const aud = opts.audience || process.env.JWT_AUDIENCE;
    return async function jwtVerifier(req, res, next) {
        try {
            const raw = (req.headers[hdr] || req.headers[hdr.toUpperCase()]);
            if (!raw || !raw.toLowerCase().startsWith("bearer ")) {
                return res.status(401).json({ error: "missing_authorization" });
            }
            const token = raw.slice(7).trim();
            // verify
            const { payload, protectedHeader } = await (0, jose_1.jwtVerify)(token, JWKS, {
                issuer: iss, audience: aud, algorithms: algs
            });
            if ((opts.headerKidRequired || process.env.JWT_KID_REQUIRED === "1") && !protectedHeader.kid) {
                return res.status(401).json({ error: "kid_required" });
            }
            // attach to locals for downstream
            res.locals.auth = { payload, header: protectedHeader, token };
            req.auth = res.locals.auth;
            next();
        }
        catch (e) {
            return res.status(401).json({ error: "invalid_token", message: e?.message || String(e) });
        }
    };
}
function subjectFromReq(req) {
    const a = req.auth?.payload;
    return a?.sub || undefined;
}
//# sourceMappingURL=jwt.js.map