"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ShortcutManager_1 = require("../services/ShortcutManager");
const router = express_1.default.Router();
const shortcutManager = new ShortcutManager_1.ShortcutManager();
router.post('/set-shortcut', (req, res) => {
    const { userId, shortcut, command } = req.body;
    shortcutManager.setShortcut(userId, shortcut, command);
    res.json({ success: true });
});
router.get('/get-shortcuts/:userId', (req, res) => {
    const shortcuts = shortcutManager.getUserShortcuts(req.params.userId);
    res.json(shortcuts);
});
exports.default = router;
