"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortcutManager = void 0;
class ShortcutManager {
    constructor() {
        this.config = {};
    }
    setShortcut(userId, shortcut, command) {
        if (!this.config[userId])
            this.config[userId] = {};
        this.config[userId][shortcut] = command;
    }
    getCommand(userId, shortcut) {
        var _a;
        return ((_a = this.config[userId]) === null || _a === void 0 ? void 0 : _a[shortcut]) || null;
    }
    getUserShortcuts(userId) {
        return this.config[userId] || {};
    }
}
exports.ShortcutManager = ShortcutManager;
