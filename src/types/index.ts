export type Platform = 'jd' | 'alipay';
export type FundStatus = 'hold' | 'watch' | 'sell' | 'sold';

export interface WatchRecord {
  date: string;
  status: FundStatus;
  note?: string;
}

export interface Fund {
  id: string;
  name: string;
  code: string;
  platform: Platform;
  purchaseAmount: number;
  currentValue: number;
  dailyProfit: number;
  dailyProfitRate: number;
  totalProfit: number;
  totalProfitRate: number;
  holdDays: number;
  addedDate: string;
  status: FundStatus;
  analysisScore: number;
  lastAnalysisDate: string;
  sellCount: number;
  watchHistory: WatchRecord[];
  history: FundHistory[];
}

export interface FundHistory {
  date: string;
  currentValue: number;
  dailyProfit: number;
  dailyProfitRate: number;
  totalProfit: number;
  totalProfitRate: number;
}

export interface AnalysisResult {
  status: FundStatus;
  score: number;
  reason: string;
  suggestion: string;
}

export interface OCRResult {
  name: string;
  code: string;
  purchaseAmount: number;
  currentValue: number;
  dailyProfit: number;
  dailyProfitRate: number;
  totalProfit: number;
  totalProfitRate: number;
  holdDays: number;
  confidence: number;
}

export interface AppSettings {
  reminderEnabled: boolean;
  reminderTime: string;
  soldCoolingDays: number;
}

export interface FundContextType {
  funds: Fund[];
  addFund: (fund: Omit<Fund, 'id' | 'addedDate' | 'lastAnalysisDate' | 'sellCount' | 'watchHistory' | 'history'>) => void;
  updateFund: (id: string, updates: Partial<Fund>) => void;
  deleteFund: (id: string) => void;
  analyzeAll: () => void;
  analyzeFund: (id: string) => AnalysisResult;
  refreshAnalysis: (id: string) => void;
}
