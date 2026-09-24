let memoryAccessToken: string | null = null;
let memorySessionId: string | null = null;

export const authSession = {
  getAccessToken(): string | null {
    return memoryAccessToken;
  },

  setAccessToken(token: string | null): void {
    memoryAccessToken = token;
  },

  getSessionId(): string | null {
    return memorySessionId;
  },

  setSessionId(sessionId: string | null): void {
    memorySessionId = sessionId;
  },

  clearSession(): void {
    memoryAccessToken = null;
    memorySessionId = null;
  },
};

export default authSession;
