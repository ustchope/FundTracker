import { OCRResult, Platform } from '../types';

const JD_PATTERNS: Record<string, RegExp> = {
  name: /(?:基金名称|产品名称)[：:]\s*([^\n\d]+)/,
  code: /(?:基金代码|产品代码)[：:]\s*(\d{6})/,
  purchaseAmount: /(?:买入金额|持有金额|本金)[：:]\s*[\uFFE5¥]?\s*([\d,]+\.?\d*)/,
  currentValue: /(?:当前市值|持有市值|总资产)[：:]\s*[\uFFE5¥]?\s*([\d,]+\.?\d*)/,
  dailyProfit: /(?:今日收益|当日收益)[：:]\s*[\uFFE5¥]?\s*([+-]?[\d,]+\.?\d*)/,
  totalProfit: /(?:累计收益|总收益)[：:]\s*[\uFFE5¥]?\s*([+-]?[\d,]+\.?\d*)/,
  holdDays: /(?:持有)[^\d]*(\d+)[^天]*天/,
};

const ALIPAY_PATTERNS: Record<string, RegExp> = {
  name: /(?:基金名称|理财产品)[：:]\s*([^\n\d]+)/,
  code: /(?:基金代码)[：:]\s*(\d{6})/,
  purchaseAmount: /(?:买入|投入)[^\d]*([\d,]+\.?\d*)[^\d]/,
  currentValue: /(?:当前|净值)[^\d]*([\d,]+\.?\d*)/,
  dailyProfit: /(?:当日|今日|昨日)[^\d]*([+-]?[\d,]+\.?\d*)/,
  totalProfit: /(?:累计收益|总收益|持有收益)[：:]\s*[\uFFE5¥]?\s*([+-]?[\d,]+\.?\d*)/,
  holdDays: /(?:持有)[^\d]*(\d+)[^天]*天/,
};

type ParsedFundData = {
  name?: string;
  code?: string;
  purchaseAmount?: number;
  currentValue?: number;
  dailyProfit?: number;
  totalProfit?: number;
  holdDays?: number;
  confidence: number;
};

function parseFundText(text: string, patterns: Record<string, RegExp>): ParsedFundData {
  const result: ParsedFundData = { confidence: 0 };
  
  const numericKeys = ['purchaseAmount', 'currentValue', 'dailyProfit', 'totalProfit'];
  
  for (const key of Object.keys(patterns)) {
    const match = text.match(patterns[key]);
    if (match && match[1]) {
      const value = match[1].trim();
      
      if (numericKeys.includes(key)) {
        const numericValue = parseFloat(value.replace(/[,，]/g, ''));
        if (!isNaN(numericValue)) {
          (result as any)[key] = numericValue;
        }
      } else if (key === 'holdDays') {
        const days = parseInt(value, 10);
        if (!isNaN(days)) {
          result.holdDays = days;
        }
      } else {
        (result as any)[key] = value;
      }
      result.confidence += 10;
    }
  }
  
  return result;
}

export function parseJDFundText(text: string): ParsedFundData {
  return parseFundText(text, JD_PATTERNS);
}

export function parseAlipayFundText(text: string): ParsedFundData {
  return parseFundText(text, ALIPAY_PATTERNS);
}

export function parseFundFromImage(platform: Platform, text: string): OCRResult {
  const parsed = platform === 'jd' ? parseJDFundText(text) : parseAlipayFundText(text);
  
  const purchaseAmount = parsed.purchaseAmount || 0;
  const currentValue = parsed.currentValue || 0;
  const totalProfit = parsed.totalProfit || 0;
  const dailyProfit = parsed.dailyProfit || 0;
  
  let dailyProfitRate = 0;
  let totalProfitRate = 0;
  
  if (purchaseAmount > 0) {
    dailyProfitRate = (dailyProfit / purchaseAmount) * 100;
  }
  
  if (purchaseAmount > 0 && currentValue > 0) {
    totalProfitRate = ((currentValue - purchaseAmount) / purchaseAmount) * 100;
  }
  
  return {
    name: parsed.name || '',
    code: parsed.code || '',
    purchaseAmount,
    currentValue,
    dailyProfit,
    dailyProfitRate,
    totalProfit,
    totalProfitRate,
    holdDays: parsed.holdDays || 0,
    confidence: parsed.confidence,
  };
}

export function extractTextFromImage(_uri: string): Promise<string> {
  return new Promise((resolve) => {
    const mockText = `
      基金名称：XX灵活配置混合
      基金代码：123456
      买入金额：10,000.00
      当前市值：10,500.00
      今日收益：+50.00
      累计收益：+500.00
      持有：30天
    `;
    resolve(mockText);
  });
}
