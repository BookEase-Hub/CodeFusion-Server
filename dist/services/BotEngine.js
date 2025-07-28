"use strict";
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
exports.BotEngine = void 0;
const CommandDispatcher_1 = require("./CommandDispatcher");
class BotEngine {
    constructor() {
        this.patterns = [
            { pattern: /create (?:new )?file (?:in )?(.*)/i, command: 'createNewFile', extractPath: true },
            { pattern: /save (?:file )?(?:in )?(.*)/i, command: 'saveFile', extractPath: true },
            { pattern: /open (?:file )?(?:in )?(.*)/i, command: 'openFileDialog', extractPath: true }
        ];
        this.dispatcher = new CommandDispatcher_1.CommandDispatcher();
    }
    processQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalized = query.toLowerCase().trim();
            for (const { pattern, command, extractPath } of this.patterns) {
                const match = normalized.match(pattern);
                if (match) {
                    const path = extractPath ? match[1] : undefined;
                    return this.dispatcher.executeCommand(command, { path });
                }
            }
            throw new Error('No matching command found');
        });
    }
}
exports.BotEngine = BotEngine;
