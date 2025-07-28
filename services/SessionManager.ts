import { UserSession } from '../types/UserSession';

class UserSessionImpl implements UserSession {
  public startedAt: Date;
  constructor(public userId: string) {
    this.startedAt = new Date();
  }
}

export class SessionManager {
  private sessions: Record<string, UserSession> = {};

  public createSession(userId: string): UserSession {
    const session = new UserSessionImpl(userId);
    this.sessions[userId] = session;
    return session;
  }

  public getSession(userId: string): UserSession | undefined {
    return this.sessions[userId];
  }

  public endSession(userId: string): void {
    delete this.sessions[userId];
  }
}
