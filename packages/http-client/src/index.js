"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
exports.makeHttpClient = makeHttpClient;
function makeHttpClient(opts = {}) {
    const timeout = opts.timeoutMs ?? 5000;
    const retries = opts.retries ?? 2;
    const client = exports.http.create({ timeout, maxRedirects: 0, validateStatus: (s) => s >= 200 && s < 500 });
    client.interceptors.response.use(undefined, async (error) => {
        const cfg = error.config || {};
        cfg.__retryCount = (cfg.__retryCount || 0) + 1;
        if (cfg.__retryCount <= retries) {
            return client(cfg);
        }
        return Promise.reject(error);
    });
    return client;
}
exports.http = makeHttpClient();
//# sourceMappingURL=index.js.map