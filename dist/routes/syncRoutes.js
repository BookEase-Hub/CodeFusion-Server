"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CloudSyncService_1 = require("../services/CloudSyncService");
const router = express_1.default.Router();
const cloudSync = new CloudSyncService_1.CloudSyncService();
router.post('/start-sync', (req, res) => {
    const { projectId, sessionId } = req.body;
    cloudSync.startSyncSession(projectId, sessionId);
    res.json({ success: true });
});
router.get('/sync-state/:projectId', (req, res) => {
    const state = cloudSync.getProjectState(req.params.projectId);
    res.json(state || { error: 'Project not found' });
});
/*
router.post('/push-change', async (req: Request, res: Response) => {
  const { projectId, filePath, content } = req.body;
  await FileService.writeFile(filePath, content);
  res.json({ success: true });
});
*/
exports.default = router;
