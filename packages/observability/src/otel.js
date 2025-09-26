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
exports.initTelemetry = initTelemetry;
// Lightweight OpenTelemetry bootstrap (SDK choice up to runtime env)
async function initTelemetry(serviceName) {
    try {
        // Lazy import to avoid forcing deps if not installed in all envs
        const { NodeSDK } = await Promise.resolve().then(() => __importStar(require('@opentelemetry/sdk-node')));
        const { getNodeAutoInstrumentations } = await Promise.resolve().then(() => __importStar(require('@opentelemetry/auto-instrumentations-node')));
        const { OTLPTraceExporter } = await Promise.resolve().then(() => __importStar(require('@opentelemetry/exporter-trace-otlp-http')));
        const { Resource } = await Promise.resolve().then(() => __importStar(require('@opentelemetry/resources')));
        const { SemanticResourceAttributes } = await Promise.resolve().then(() => __importStar(require('@opentelemetry/semantic-conventions')));
        const exporter = new OTLPTraceExporter(); // uses OTEL_EXPORTER_OTLP_ENDPOINT if set
        const sdk = new NodeSDK({
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
            }),
            traceExporter: exporter,
            instrumentations: [getNodeAutoInstrumentations()],
        });
        await sdk.start();
        process.on('SIGTERM', () => sdk.shutdown());
        return true;
    }
    catch (e) {
        // OpenTelemetry deps may not be installed in all packages; fail-soft
        console.warn('[otel] skipped init (missing deps or not requested):', String(e));
        return false;
    }
}
//# sourceMappingURL=otel.js.map