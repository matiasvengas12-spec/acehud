
import { PlayerStats } from './types';

export const STAT_MAPPING: Record<string, string> = {
  vpip: 'VPIP',
  pfr: 'PFR',
  three_bet: '3Bet Total',
  fold_3b: 'Fold to 3Bet',
  four_bet: '4Bet PF',
  wwsf: 'WWSF',
  wsd: 'W$SD',
  hands: 'Hands Abbr'
};

export const HUD_COLORS: Record<string, string> = {
  default: '#ffffff',
  orange: '#fb923c',
  green: '#4ade80',
  darkGreen: '#166534',
  red: '#f87171',
  blue: '#60a5fa',
  purple: '#c084fc',
  yellow: '#facc15'
};

export const MOCK_PLAYER_NAMES = [
  "AceMaster99", "BluffKing", "RiverRat", "Sharky_P", "FishFinder",
  "Nuts_Only", "AllInAndy", "TiltControl", "PocketRockets", "SlowPlaySam",
  "GTO_Wizard", "StackBuilder", "TheGrinder", "LuckyLuke", "HighRoller"
];

// Added missing required properties "Fold to 4Bet+" and "5Bet+ PF" to match PlayerStats type
export const generateMockStats = (name: string): PlayerStats => ({
  Player: name,
  VPIP: Math.floor(Math.random() * 40 + 10).toString(),
  PFR: Math.floor(Math.random() * 30 + 5).toString(),
  "3Bet Total": Math.floor(Math.random() * 15).toString(),
  "Fold to 3Bet": Math.floor(Math.random() * 60 + 20).toString(),
  "4Bet PF": Math.floor(Math.random() * 5).toString(),
  "Fold to 4Bet+": Math.floor(Math.random() * 50).toString(),
  "5Bet+ PF": Math.floor(Math.random() * 5).toString(),
  "WWSF": Math.floor(Math.random() * 20 + 40).toString(),
  "W$SD": Math.floor(Math.random() * 20 + 40).toString(),
  "Hands Abbr": Math.floor(Math.random() * 10000).toString()
});
