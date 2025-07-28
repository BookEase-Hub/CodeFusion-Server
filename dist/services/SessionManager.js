"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
class UserSessionImpl {
    constructor(userId) {
        this.userId = userId;
        this.startedAt = new Date();
    }
}
class SessionManager {
    constructor() {
        this.sessions = {};
    }
    createSession(userId) {
        const session = new UserSessionImpl(userId);
        this.sessions[userId] = session;
        return session;
    }
    getSession(userId) {
        return this.sessions[userId];
    }
    endSession(userId) {
        delete this.sessions[userId];
    }
}
exports.SessionManager = SessionManager;
