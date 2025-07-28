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
exports.useEditorContext = exports.EditorProvider = void 0;
const react_1 = __importStar(require("react"));
const EditorContext = (0, react_1.createContext)(undefined);
const EditorProvider = ({ children }) => {
    const [activeFile, setActiveFile] = (0, react_1.useState)("");
    const [projectStructure, setProjectStructure] = (0, react_1.useState)([]);
    const [terminalHistory, setTerminalHistory] = (0, react_1.useState)([]);
    return (react_1.default.createElement(EditorContext.Provider, { value: {
            activeFile,
            projectStructure,
            terminalHistory,
            updateActiveFile: setActiveFile,
            updateProjectStructure: setProjectStructure,
            updateTerminalHistory: setTerminalHistory,
        } }, children));
};
exports.EditorProvider = EditorProvider;
const useEditorContext = () => {
    const context = (0, react_1.useContext)(EditorContext);
    if (!context)
        throw new Error("useEditorContext must be used within EditorProvider");
    return context;
};
exports.useEditorContext = useEditorContext;
