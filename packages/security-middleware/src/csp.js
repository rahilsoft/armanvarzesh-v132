"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cspMiddleware = cspMiddleware;
const node_crypto_1 = __importDefault(require("node:crypto"));
const helmet_1 = __importDefault(require("helmet"));
function cspMiddleware(opts = {}) {
    const mode = opts.mode || (process.env.CSP_NONCE_MODE === "1" ? 'nonce' : 'baseline');
    if (mode === 'nonce') {
        return function cspNonce(req, res, next) {
            const nonce = node_crypto_1.default.randomBytes(16).toString('base64');
            // expose nonce for templating layers
            res.locals.cspNonce = nonce;
            const policy = {
                useDefaults: true,
                directives: {
                    "default-src": ["'self'"],
                    "script-src": ["'self'", `'nonce-${nonce}'`], // templates must use this nonce in prod
                    "style-src": ["'self'", "'unsafe-inline'", "https:"],
                    "img-src": ["'self'", "data:", "https:"],
                    "object-src": ["'none'"],
                    "base-uri": ["'self'"],
                    "frame-ancestors": ["'self'"],
                    "connect-src": ["'self'"]
                }
            };
            return helmet_1.default.contentSecurityPolicy(policy)(req, res, next);
        };
    }
    // baseline (compatible, not breaking)
    return helmet_1.default.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            "default-src": ["'self'"],
            "base-uri": ["'self'"],
            "font-src": ["'self'", "https:", "data:"],
            "img-src": ["'self'", "data:", "https:"],
            "object-src": ["'none'"],
            "script-src": ["'self'", "'unsafe-inline'"],
            "script-src-attr": ["'none'"],
            "style-src": ["'self'", "'unsafe-inline'", "https:"],
            "connect-src": ["'self'"]
        }
    });
}
//# sourceMappingURL=csp.js.map