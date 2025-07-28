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
exports.CloudSyncService = void 0;
const FileService_1 = require("./FileService");
class CloudSyncService {
    constructor() {
        this.sessions = {};
        this.syncInterval = 5000; // 5 seconds
    }
    startSyncSession(projectId, sessionId) {
        if (!this.sessions[projectId]) {
            this.sessions[projectId] = { projectId, files: {}, connections: [] };
        }
        this.sessions[projectId].connections.push(sessionId);
        // Start sync loop for this project
        setInterval(() => this.syncProject(projectId), this.syncInterval);
    }
    syncProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = this.sessions[projectId];
            if (!session)
                return;
            const fileService = new FileService_1.FileService();
            // Get current project files
            const files = yield fileService.listProjectFiles(projectId);
            // Update synchronization
            for (const file of files) {
                const content = yield fileService.readFile(file.path);
                session.files[file.path] = {
                    content,
                    lastSync: new Date()
                };
            }
        });
    }
    getFileState(projectId, filePath) {
        var _a;
        return (_a = this.sessions[projectId]) === null || _a === void 0 ? void 0 : _a.files[filePath];
    }
    getProjectState(projectId) {
        return this.sessions[projectId];
    }
}
exports.CloudSyncService = CloudSyncService;
