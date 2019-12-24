"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FinalModule = /** @class */ (function () {
    function FinalModule() {
    }
    FinalModule.prototype.invoke = function (context) {
        console.log('Final Module');
        return {};
    };
    return FinalModule;
}());
exports.FinalModule = FinalModule;
