let memoryAccessToken: string | null = null;

export const authSession = {
  getAccessToken(): string | null {
    return memoryAccessToken;
  },

  setAccessToken(token: string | null): void {
    memoryAccessToken = token;
  },

  clearSession(): void {
    memoryAccessToken = null;
  },
};

export default authSession;
