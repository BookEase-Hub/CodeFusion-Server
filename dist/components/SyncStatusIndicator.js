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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncStatusIndicator = SyncStatusIndicator;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
function SyncStatusIndicator({ projectId }) {
    const [status, setStatus] = (0, react_1.useState)('idle');
    const [lastSync, setLastSync] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                setStatus('syncing');
                const response = yield fetch(`/api/sync-state/${projectId}`);
                const data = yield response.json();
                setLastSync(new Date(((_b = (_a = data.files) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.lastSync) || Date.now()));
                setStatus('success');
            }
            catch (error) {
                setStatus('error');
            }
        }), 10000); // Sync every 10 seconds
        return () => clearInterval(interval);
    }, [projectId]);
    return (react_1.default.createElement("div", { className: "flex items-center gap-2" },
        status === 'idle' && react_1.default.createElement(lucide_react_1.Cloud, null),
        status === 'syncing' && react_1.default.createElement(lucide_react_1.RefreshCw, { className: "animate-spin" }),
        status === 'success' && react_1.default.createElement(lucide_react_1.CheckCircle, { className: "text-green-500" }),
        status === 'error' && react_1.default.createElement(lucide_react_1.AlertCircle, { className: "text-red-500" }),
        lastSync && (react_1.default.createElement("span", { className: "text-gray-500" },
            "Last synced: ",
            lastSync.toLocaleTimeString()))));
}
