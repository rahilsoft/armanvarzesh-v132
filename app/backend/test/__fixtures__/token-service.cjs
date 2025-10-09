"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// app/backend/src/common/services/token.service.ts
var token_service_exports = {};
__export(token_service_exports, {
  TokenService: () => TokenService
});
module.exports = __toCommonJS(token_service_exports);
var import_common = require("@nestjs/common");
var jwt = __toESM(require("jsonwebtoken"), 1);
var import_crypto = require("crypto");
var TokenService = class {
  algorithm = "RS256";
  issuer = process.env.JWT_ISSUER || void 0;
  audience = process.env.JWT_AUDIENCE || void 0;
  activeKid;
  keys = {};
  constructor() {
    const keyMap = this.parseKeyMap();
    const active = process.env.JWT_ACTIVE_KID || Object.keys(keyMap)[0];
    if (!active || !keyMap[active]) {
      throw new Error("Active JWT kid is not configured. Set JWT_ACTIVE_KID and JWT_KEYS.");
    }
    this.activeKid = active;
    for (const [kid, raw] of Object.entries(keyMap)) {
      const pem = this.normalizePem(raw);
      const publicKey = (0, import_crypto.createPublicKey)(pem).export({ type: "spki", format: "pem" }).toString();
      this.keys[kid] = { privateKey: pem, publicKey };
    }
  }
  parseKeyMap() {
    const sources = [process.env.JWT_KEYS, process.env.JWT_SECRETS];
    for (const source of sources) {
      if (!source) continue;
      try {
        const parsed = JSON.parse(source);
        if (Object.keys(parsed).length > 0) {
          return parsed;
        }
      } catch (e) {
        throw new Error("JWT_KEYS must contain valid JSON mapping kid\u2192private key");
      }
    }
    const single = process.env.JWT_PRIVATE_KEY || process.env.JWT_PRIVATE_PEM;
    if (single) {
      return { default: single };
    }
    throw new Error("No RS256 signing keys configured. Provide JWT_KEYS or JWT_PRIVATE_KEY.");
  }
  normalizePem(value) {
    const trimmed = (value || "").trim();
    if (!trimmed) {
      throw new Error("Empty signing key provided");
    }
    if (trimmed.includes("-----BEGIN")) {
      return trimmed;
    }
    try {
      const decoded = Buffer.from(trimmed, "base64").toString("utf8");
      return decoded.includes("-----BEGIN") ? decoded : trimmed;
    } catch {
      return trimmed;
    }
  }
  getKey(kid) {
    const entry = this.keys[kid];
    if (!entry) {
      throw new Error(`Signing key not found for kid ${kid}`);
    }
    return entry;
  }
  sign(payload, expiresIn = "7d") {
    const key = this.getKey(this.activeKid);
    return jwt.sign(payload, key.privateKey, {
      algorithm: this.algorithm,
      expiresIn,
      keyid: this.activeKid,
      issuer: this.issuer,
      audience: this.audience
    });
  }
  verify(token) {
    const decoded = jwt.decode(token, { complete: true });
    const kid = decoded?.header?.kid || this.activeKid;
    const key = this.getKey(kid);
    return jwt.verify(token, key.publicKey, {
      algorithms: [this.algorithm],
      issuer: this.issuer,
      audience: this.audience
    });
  }
};
TokenService = __decorateClass([
  (0, import_common.Injectable)()
], TokenService);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TokenService
});
