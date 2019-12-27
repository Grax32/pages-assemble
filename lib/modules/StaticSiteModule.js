"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var StaticSiteModule = /** @class */ (function () {
    function StaticSiteModule() {
    }
    StaticSiteModule.prototype.invoke = function (context) {
        if (context.options.verbose) {
            console.log('Entering StaticSiteModule');
        }
        var source = context.options.source;
        var dest = context.options.output;
        context.assets
            .filter(function (v) { return v.isStatic; })
            .forEach(function (v) {
            var destFile = path.join(dest, v.path);
            var destDir = path.dirname(destFile);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            fs.copyFileSync(path.join(source, v.path), destFile);
        });
        var results = this.next(context);
        return results;
    };
    return StaticSiteModule;
}());
exports.default = StaticSiteModule;
