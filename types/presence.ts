export interface PresenceUser {
  id: string;
  name: string;
  email: string;
  roleLabel: string;
  online: boolean;
  /** ISO timestamp of last activity, or null if never. */
  lastSeenAt: string | null;
}

/** One app sign-in recorded in login history. */
export interface LoginHistoryEntry {
  id: string;
  userId: string;
  name: string;
  email: string;
  roleLabel: string;
  loggedInAt: string;
  ipAddress: string | null;
}

export interface PresenceSnapshot {
  onlineCount: number;
  users: PresenceUser[];
  loginHistory: LoginHistoryEntry[];
  fetchedAt: string;
}
