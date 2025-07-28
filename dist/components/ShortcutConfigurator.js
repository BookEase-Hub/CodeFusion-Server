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
exports.ShortcutConfigurator = ShortcutConfigurator;
const react_1 = __importStar(require("react"));
function ShortcutConfigurator({ userId }) {
    const [shortcuts, setShortcuts] = (0, react_1.useState)({});
    const [newShortcut, setNewShortcut] = (0, react_1.useState)('');
    const [newCommand, setNewCommand] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        fetch(`/api/get-shortcuts/${userId}`)
            .then(res => res.json())
            .then(setShortcuts);
    }, [userId]);
    const saveShortcut = () => {
        fetch('/api/set-shortcut', {
            method: 'POST',
            body: JSON.stringify({ userId, shortcut: newShortcut, command: newCommand })
        }).then(() => {
            setShortcuts(Object.assign(Object.assign({}, shortcuts), { [newShortcut]: newCommand }));
            setNewShortcut('');
            setNewCommand('');
        });
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("table", null,
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", null, "Shortcut"),
                    react_1.default.createElement("th", null, "Command"))),
            react_1.default.createElement("tbody", null, Object.entries(shortcuts).map(([shortcut, command]) => (react_1.default.createElement("tr", { key: shortcut },
                react_1.default.createElement("td", null, shortcut),
                react_1.default.createElement("td", null, command)))))),
        react_1.default.createElement("div", { className: "mt-4 flex gap-2" },
            react_1.default.createElement("input", { placeholder: "Ctrl+Shift+M", value: newShortcut, onChange: (e) => setNewShortcut(e.target.value) }),
            react_1.default.createElement("input", { placeholder: "commandName", value: newCommand, onChange: (e) => setNewCommand(e.target.value) }),
            react_1.default.createElement("button", { onClick: saveShortcut }, "Add Shortcut"))));
}
