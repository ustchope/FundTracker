import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

interface TotalSummaryProps {
  totalPurchase: number;
  totalCurrent: number;
  totalProfit: number;
  profitRate: number;
}

export function TotalSummary({ totalPurchase, totalCurrent, totalProfit, profitRate }: TotalSummaryProps) {
  const isProfit = totalProfit >= 0;
  const profitColor = isProfit ? colors.positive : colors.negative;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>总收益概览</Text>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>总投入</Text>
          <Text style={styles.value}>¥{totalPurchase.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>当前价值</Text>
          <Text style={styles.value}>¥{totalCurrent.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>
      <View style={[styles.profitContainer, { borderLeftColor: profitColor }]}>
        <Text style={styles.profitLabel}>累计收益</Text>
        <Text style={[styles.profitValue, { color: profitColor }]}>
          {isProfit ? '+' : ''}¥{totalProfit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={[styles.profitRate, { color: profitColor }]}>
          ({isProfit ? '+' : ''}{profitRate.toFixed(2)}%)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  item: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  profitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    paddingLeft: spacing.sm,
  },
  profitLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  profitValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  profitRate: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});
