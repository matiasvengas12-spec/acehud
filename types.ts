
export interface PlayerStats {
  Player: string;
  VPIP: string;
  PFR: string;
  "3Bet Total": string;
  "Fold to 4Bet+": string;
  "5Bet+ PF": string;
  "Fold to 3Bet": string;
  "4Bet PF": string;
  "WWSF": string;
  "W$SD": string;
  "Hands Abbr": string;
  [key: string]: string;
}

export type TableSize = 6 | 9;

export interface PokerTable {
  id: number;
  name: string;
  size: TableSize;
  players: (string | null)[]; // Nicks assigned to seats
}

export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  TABLES = 'TABLES',
  DATABASE = 'DATABASE',
  HAR_ANALYZER = 'HAR_ANALYZER',
  SETTINGS = 'SETTINGS'
}

export interface HandHistory {
  id: string;
  timestamp: string;
  hero: string;
  table: string;
  action: string;
  outcome: string;
}

export interface AppState {
  currentView: ViewType;
  tableCount: number;
  tableSize: TableSize;
  playerDb: Record<string, PlayerStats>;
  activeTables: PokerTable[];
  isDbLoaded: boolean;
  recentHands: HandHistory[];
}
