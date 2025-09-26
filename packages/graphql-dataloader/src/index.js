"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderFactory = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const common_1 = require("@nestjs/common");
let LoaderFactory = class LoaderFactory {
    create(batch) {
        return new dataloader_1.default(async (keys) => {
            const results = await batch(keys);
            return results;
        }, { maxBatchSize: 100 });
    }
};
exports.LoaderFactory = LoaderFactory;
exports.LoaderFactory = LoaderFactory = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST })
], LoaderFactory);
//# sourceMappingURL=index.js.map