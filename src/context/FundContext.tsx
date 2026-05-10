import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Fund, FundStatus, AnalysisResult, FundContextType } from '../types';
import { loadFunds, saveFunds } from '../utils/storage';
import { analyzeFund, updateFundAnalysis } from '../utils/analyzer';

interface FundState {
  funds: Fund[];
  loading: boolean;
}

type FundAction =
  | { type: 'SET_FUNDS'; payload: Fund[] }
  | { type: 'ADD_FUND'; payload: Fund }
  | { type: 'UPDATE_FUND'; payload: { id: string; updates: Partial<Fund> } }
  | { type: 'DELETE_FUND'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: FundState = {
  funds: [],
  loading: true,
};

function fundReducer(state: FundState, action: FundAction): FundState {
  switch (action.type) {
    case 'SET_FUNDS':
      return { ...state, funds: action.payload, loading: false };
    case 'ADD_FUND':
      return { ...state, funds: [...state.funds, action.payload] };
    case 'UPDATE_FUND':
      return {
        ...state,
        funds: state.funds.map(f =>
          f.id === action.payload.id ? { ...f, ...action.payload.updates } : f
        ),
      };
    case 'DELETE_FUND':
      return {
        ...state,
        funds: state.funds.filter(f => f.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

const FundContext = createContext<FundContextType | undefined>(undefined);

export function FundProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fundReducer, initialState);

  useEffect(() => {
    loadFunds().then(funds => {
      dispatch({ type: 'SET_FUNDS', payload: funds });
    });
  }, []);

  useEffect(() => {
    if (!state.loading && state.funds.length > 0) {
      saveFunds(state.funds);
    }
  }, [state.funds, state.loading]);

  const addFund = useCallback((
    fundData: Omit<Fund, 'id' | 'addedDate' | 'lastAnalysisDate' | 'sellCount' | 'watchHistory' | 'history'>
  ) => {
    const now = new Date().toISOString();
    const newFund: Fund = {
      ...fundData,
      id: uuidv4(),
      addedDate: now,
      lastAnalysisDate: now,
      sellCount: 0,
      watchHistory: [],
      history: [{
        date: now,
        currentValue: fundData.currentValue,
        dailyProfit: fundData.dailyProfit,
        dailyProfitRate: fundData.dailyProfitRate,
        totalProfit: fundData.totalProfit,
        totalProfitRate: fundData.totalProfitRate,
      }],
    };
    dispatch({ type: 'ADD_FUND', payload: newFund });
  }, []);

  const updateFund = useCallback((id: string, updates: Partial<Fund>) => {
    const now = new Date().toISOString();
    
    if ('currentValue' in updates || 'dailyProfit' in updates) {
      const fund = state.funds.find(f => f.id === id);
      if (fund) {
        const currentValue = updates.currentValue ?? fund.currentValue;
        const dailyProfit = updates.dailyProfit ?? fund.dailyProfit;
        const dailyProfitRate = updates.dailyProfitRate ?? fund.dailyProfitRate;
        const totalProfit = updates.totalProfit ?? fund.totalProfit;
        const totalProfitRate = updates.totalProfitRate ?? fund.totalProfitRate;
        
        updates.history = [...fund.history, {
          date: now,
          currentValue,
          dailyProfit,
          dailyProfitRate,
          totalProfit,
          totalProfitRate,
        }];
      }
    }
    
    dispatch({ type: 'UPDATE_FUND', payload: { id, updates } });
  }, [state.funds]);

  const deleteFund = useCallback((id: string) => {
    dispatch({ type: 'DELETE_FUND', payload: id });
  }, []);

  const analyzeFundById = useCallback((id: string): AnalysisResult => {
    const fund = state.funds.find(f => f.id === id);
    if (!fund) {
      return { status: 'watch', score: 0, reason: '未找到基金', suggestion: '' };
    }
    return analyzeFund(fund);
  }, [state.funds]);

  const refreshAnalysis = useCallback((id: string) => {
    const fund = state.funds.find(f => f.id === id);
    if (!fund) return;

    const analysis = analyzeFund(fund);
    const analysisUpdate = updateFundAnalysis(fund);
    const now = new Date().toISOString();

    const historyEntry = fund.watchHistory[fund.watchHistory.length - 1];
    if (!historyEntry || historyEntry.status !== analysis.status) {
      const watchHistory = [...fund.watchHistory, {
        date: now,
        status: analysis.status,
        note: analysis.suggestion,
      }];
      
      dispatch({
        type: 'UPDATE_FUND',
        payload: {
          id,
          updates: {
            status: analysisUpdate.status,
            analysisScore: analysisUpdate.score,
            lastAnalysisDate: now,
            sellCount: analysisUpdate.sellCount,
            watchHistory,
          },
        },
      });
    }
  }, [state.funds]);

  const analyzeAll = useCallback(() => {
    state.funds.forEach(fund => {
      refreshAnalysis(fund.id);
    });
  }, [state.funds, refreshAnalysis]);

  const value: FundContextType = {
    funds: state.funds,
    addFund,
    updateFund,
    deleteFund,
    analyzeAll,
    analyzeFund: analyzeFundById,
    refreshAnalysis,
  };

  return <FundContext.Provider value={value}>{children}</FundContext.Provider>;
}

export function useFundContext(): FundContextType {
  const context = useContext(FundContext);
  if (!context) {
    throw new Error('useFundContext must be used within a FundProvider');
  }
  return context;
}
