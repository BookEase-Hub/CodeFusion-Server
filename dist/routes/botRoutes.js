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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BotEngine_1 = require("../services/BotEngine");
const router = express_1.default.Router();
const botEngine = new BotEngine_1.BotEngine();
router.post('/bot-command', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, sessionId } = req.body;
        const result = yield botEngine.processQuery(query);
        res.json({ success: true, result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
exports.default = router;
