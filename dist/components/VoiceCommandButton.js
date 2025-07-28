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
exports.VoiceCommandButton = VoiceCommandButton;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
function VoiceCommandButton() {
    const [isListening, setIsListening] = (0, react_1.useState)(false);
    const [recognition, setRecognition] = (0, react_1.useState)(null);
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.onresult = (event) => __awaiter(this, void 0, void 0, function* () {
            const transcript = event.results[0][0].transcript;
            const response = yield fetch('/api/process-voice', {
                method: 'POST',
                body: JSON.stringify({ transcript, sessionId: 'current-session' })
            });
            // Handle response
        });
        recognition.start();
        setIsListening(true);
        setRecognition(recognition);
    };
    const stopListening = () => {
        recognition === null || recognition === void 0 ? void 0 : recognition.stop();
        setIsListening(false);
    };
    return (react_1.default.createElement("button", { onClick: isListening ? stopListening : startListening }, isListening ? react_1.default.createElement(lucide_react_1.MicOff, null) : react_1.default.createElement(lucide_react_1.Mic, null)));
}
