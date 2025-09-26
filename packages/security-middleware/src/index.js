"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cspMiddleware = exports.buildUserAwareRateLimit = exports.subjectFromReq = exports.buildJwtVerifier = void 0;
exports.applyBasicHardening = applyBasicHardening;
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const hpp_1 = __importDefault(require("hpp"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
function applyBasicHardening(app, opts = {}) {
    try {
        if (!app || typeof app.use !== 'function')
            return;
        // Helmet + CSP
        const csp = opts.csp ?? {
            useDefaults: true,
            directives: {
                "default-src": ["'self'"],
                "base-uri": ["'self'"],
                "font-src": ["'self'", "https:", "data:"],
                "img-src": ["'self'", "data:", "https:"],
                "object-src": ["'none'"],
                "script-src": ["'self'", "'unsafe-inline'"], // tighten in prod with nonces
                "script-src-attr": ["'none'"],
                "style-src": ["'self'", "'unsafe-inline'", "https:"],
                "connect-src": ["'self'"]
            }
        };
        app.use((0, helmet_1.default)());
        // @ts-ignore - module shape differences are okay at runtime
        if (helmet_1.default.contentSecurityPolicy)
            app.use(helmet_1.default.contentSecurityPolicy(csp));
        // CORS (env override)
        const origin = opts.corsOrigin ?? process.env.CORS_ORIGIN ?? "*";
        app.use((0, cors_1.default)({ origin, credentials: true }));
        // HPP (HTTP Parameter Pollution)
        app.use((0, hpp_1.default)());
        // Rate limit (token/user aware can be added later via custom keyGenerator)
        const windowMs = opts.rateWindowMs ?? Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
        const max = opts.rateMax ?? Number(process.env.RATE_LIMIT_MAX ?? 120);
        app.use((0, express_rate_limit_1.default)({ windowMs, max }));
        // X-Content-Type-Options, X-DNS-Prefetch-Control, etc. already covered by helmet()
    }
    catch (e) {
        // do not crash service because of middleware wiring
        // eslint-disable-next-line no-console
        console.warn("[security-middleware] Failed to apply hardening:", e);
    }
}
var jwt_1 = require("./jwt");
Object.defineProperty(exports, "buildJwtVerifier", { enumerable: true, get: function () { return jwt_1.buildJwtVerifier; } });
Object.defineProperty(exports, "subjectFromReq", { enumerable: true, get: function () { return jwt_1.subjectFromReq; } });
var userRateLimit_1 = require("./userRateLimit");
Object.defineProperty(exports, "buildUserAwareRateLimit", { enumerable: true, get: function () { return userRateLimit_1.buildUserAwareRateLimit; } });
var csp_1 = require("./csp");
Object.defineProperty(exports, "cspMiddleware", { enumerable: true, get: function () { return csp_1.cspMiddleware; } });
//# sourceMappingURL=index.js.map