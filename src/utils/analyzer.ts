import { Fund, FundStatus, AnalysisResult } from '../types';

const HOLD_THRESHOLD = 20;
const WATCH_THRESHOLD = -20;
const MIN_HOLD_DAYS = 7;
const MAX_SELL_COUNT = 2;

export function analyzeFund(fund: Fund, benchmarkDailyReturn: number = 0.5): AnalysisResult {
  if (fund.status === 'sold') {
    const lastSoldDate = fund.watchHistory.length > 0 
      ? fund.watchHistory[fund.watchHistory.length - 1].date 
      : null;
    
    if (lastSoldDate) {
      const daysSinceSold = Math.floor(
        (Date.now() - new Date(lastSoldDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (fund.totalProfitRate > HOLD_THRESHOLD) {
        return {
          status: 'hold',
          score: fund.totalProfitRate,
          reason: `近期表现优秀(${fund.totalProfitRate.toFixed(1)}%)`,
          suggestion: '表现回升，可考虑买回',
        };
      }
      
      return {
        status: 'sold',
        score: fund.totalProfitRate,
        reason: `已卖出${daysSinceSold}天`,
        suggestion: '等待合适时机买回',
      };
    }
  }
  
  if (fund.holdDays < MIN_HOLD_DAYS) {
    return {
      status: 'watch',
      score: 0,
      reason: `持有仅${fund.holdDays}天，建议观察`,
      suggestion: '持有时间过短，不建议卖出(手续费高)',
    };
  }
  
  const dailyRelativeReturn = fund.dailyProfitRate - benchmarkDailyReturn;
  
  const totalRelativeReturn = fund.totalProfitRate;
  
  const recentScore = dailyRelativeReturn * 0.3;
  const totalScore = totalRelativeReturn * 0.7;
  
  const combinedScore = recentScore + totalScore;
  
  let status: FundStatus;
  let reason: string;
  let suggestion: string;
  
  if (combinedScore >= HOLD_THRESHOLD) {
    status = 'hold';
    reason = `综合得分${combinedScore.toFixed(1)}，表现优秀`;
    suggestion = '继续持有，该基金经理表现良好';
  } else if (combinedScore >= WATCH_THRESHOLD) {
    status = 'watch';
    reason = `综合得分${combinedScore.toFixed(1)}，表现一般`;
    suggestion = '建议观察，关注后续表现';
  } else {
    status = 'sell';
    reason = `综合得分${combinedScore.toFixed(1)}，表现落后`;
    suggestion = '建议考虑卖出，换仓到表现更好的基金经理';
  }
  
  if (fund.sellCount >= MAX_SELL_COUNT) {
    suggestion = '连续多次建议卖出，建议立即执行换仓';
  }
  
  if (fund.watchHistory.length > 0) {
    const lastStatus = fund.watchHistory[fund.watchHistory.length - 1].status;
    if (lastStatus === 'sell' && status === 'sell') {
      suggestion = `连续第${fund.sellCount}次建议卖出，建议认真考虑换仓`;
    }
  }
  
  return {
    status,
    score: combinedScore,
    reason,
    suggestion,
  };
}

export function updateFundAnalysis(fund: Fund): { status: FundStatus; score: number; sellCount: number } {
  const result = analyzeFund(fund);
  
  let sellCount = fund.sellCount;
  if (result.status === 'sell') {
    sellCount += 1;
  } else {
    sellCount = 0;
  }
  
  return {
    status: result.status,
    score: result.score,
    sellCount,
  };
}

export function calculateTotalProfit(funds: Fund[]): {
  totalPurchase: number;
  totalCurrent: number;
  totalProfit: number;
  profitRate: number;
} {
  const totalPurchase = funds.reduce((sum, f) => sum + f.purchaseAmount, 0);
  const totalCurrent = funds.reduce((sum, f) => sum + f.currentValue, 0);
  const totalProfit = totalCurrent - totalPurchase;
  const profitRate = totalPurchase > 0 ? (totalProfit / totalPurchase) * 100 : 0;
  
  return { totalPurchase, totalCurrent, totalProfit, profitRate };
}

export function getActionFunds(funds: Fund[]): {
  sellFunds: Fund[];
  watchFunds: Fund[];
  holdFunds: Fund[];
  rebuyFunds: Fund[];
} {
  const sellFunds = funds.filter(f => f.status === 'sell');
  const watchFunds = funds.filter(f => f.status === 'watch');
  const holdFunds = funds.filter(f => f.status === 'hold');
  const rebuyFunds = funds.filter(f => f.status === 'sold' && f.totalProfitRate > HOLD_THRESHOLD);
  
  return { sellFunds, watchFunds, holdFunds, rebuyFunds };
}

export function getRebuyCandidates(funds: Fund[]): Fund[] {
  return funds.filter(f => {
    if (f.status !== 'sold') return false;
    return f.totalProfitRate > HOLD_THRESHOLD;
  });
}
