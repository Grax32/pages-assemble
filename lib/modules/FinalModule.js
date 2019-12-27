"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ResultContext_1 = __importDefault(require("../models/ResultContext"));
var FinalModule = /** @class */ (function () {
    function FinalModule() {
    }
    FinalModule.prototype.invoke = function (context) {
        if (context.options.verbose) {
            console.log('Final Module');
        }
        return new ResultContext_1.default();
    };
    return FinalModule;
}());
exports.default = FinalModule;
