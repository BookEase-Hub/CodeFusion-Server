"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootLayout;
const react_1 = __importDefault(require("react"));
const EditorContext_1 = require("../contexts/EditorContext");
function RootLayout({ children }) {
    return (react_1.default.createElement("html", { lang: "en" },
        react_1.default.createElement("body", null,
            react_1.default.createElement(EditorContext_1.EditorProvider, null, children))));
}
