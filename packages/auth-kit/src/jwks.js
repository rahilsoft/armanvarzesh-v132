"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.signer = signer;
const crypto_1 = require("crypto");
const jose_1 = require("jose");
async function signer(spec) {
    const privateKey = await (0, jose_1.importPKCS8)(spec.privatePEM, spec.alg);
    const pub = (0, crypto_1.createPublicKey)(spec.privatePEM);
    const jwk = await (0, jose_1.exportJWK)(pub);
    jwk.kid = spec.kid;
    jwk.alg = spec.alg;
    jwk.use = 'sig';
    return {
        jwk,
        async sign(payload, opts = {}) {
            const now = Math.floor(Date.now() / 1000);
            const exp = now + (opts.expSec ?? 3600);
            return await new jose_1.SignJWT(payload)
                .setProtectedHeader({ alg: spec.alg, kid: spec.kid })
                .setIssuedAt(now)
                .setExpirationTime(exp)
                .setIssuer(opts.iss ?? 'arman')
                .setAudience(opts.aud ?? 'arman-users')
                .sign(privateKey);
        },
        async verify(token, jwksUrl) {
            // For verification, prefer remote JWKS if provided; else verify with local public key
            try {
                const { createRemoteJWKSet } = await Promise.resolve().then(() => __importStar(require('jose')));
                if (jwksUrl) {
                    const JWKS = createRemoteJWKSet(new URL(jwksUrl));
                    return await (0, jose_1.jwtVerify)(token, JWKS);
                }
            }
            catch { }
            // Local verification fallback (not rotating)
            const pubKey = (0, crypto_1.createPublicKey)(spec.privatePEM);
            return await (0, jose_1.jwtVerify)(token, pubKey);
        }
    };
}
//# sourceMappingURL=jwks.js.map