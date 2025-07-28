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
exports.DevBotInterface = DevBotInterface;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
function DevBotInterface() {
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [input, setInput] = (0, react_1.useState)('');
    const sendMessage = () => __awaiter(this, void 0, void 0, function* () {
        if (!input.trim())
            return;
        const userMessage = { text: input, from: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        try {
            const response = yield fetch('/api/bot-command', {
                method: 'POST',
                body: JSON.stringify({
                    query: input,
                    sessionId: 'current-session'
                })
            });
            const { result } = yield response.json();
            setMessages(prev => [...prev, {
                    text: result.message || 'Command executed successfully',
                    from: 'bot'
                }]);
        }
        catch (error) {
            setMessages(prev => [...prev, {
                    text: error.message,
                    from: 'bot'
                }]);
        }
    });
    return (react_1.default.createElement("div", { className: "h-full flex flex-col" },
        react_1.default.createElement("div", { className: "p-2 border-b" }, "Developer Bot"),
        react_1.default.createElement("div", { className: "flex-1 overflow-auto p-4 space-y-2" }, messages.map((msg, i) => (react_1.default.createElement("div", { key: i, className: `p-2 rounded ${msg.from === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}` }, msg.text)))),
        react_1.default.createElement("div", { className: "p-2 border-t flex" },
            react_1.default.createElement("input", { className: "flex-1 p-2 border rounded-l", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type a command like 'Create new file in src/components'", onKeyPress: (e) => e.key === 'Enter' && sendMessage() }),
            react_1.default.createElement("button", { className: "bg-blue-500 text-white p-2 rounded-r", onClick: sendMessage },
                react_1.default.createElement(lucide_react_1.Send, { className: "h-5 w-5" })))));
}
