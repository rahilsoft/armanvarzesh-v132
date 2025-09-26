"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUserAwareRateLimit = buildUserAwareRateLimit;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const jwt_1 = require("./jwt");
function buildUserAwareRateLimit(opts = {}) {
    const windowMs = opts.windowMs ?? Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
    const max = opts.max ?? Number(process.env.RATE_LIMIT_MAX ?? 120);
    const prefix = (opts.headerPrefix ?? process.env.RATE_LIMIT_PREFIX ?? "rl") + ":";
    return (0, express_rate_limit_1.default)({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            const sub = (0, jwt_1.subjectFromReq)(req);
            if (sub)
                return prefix + "sub:" + String(sub);
            // fallback to token hash or IP
            const auth = String(req.headers.authorization || "");
            if (auth)
                return prefix + "tok:" + auth.slice(-16); // coarse token tail
            const ip = (req.ip || req.socket.remoteAddress || "0.0.0.0");
            return prefix + "ip:" + ip;
        }
    });
}
//# sourceMappingURL=userRateLimit.js.map