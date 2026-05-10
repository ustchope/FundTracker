import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Fund } from '../types';
import { AnalysisBadge } from './AnalysisBadge';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

interface FundCardProps {
  fund: Fund;
  onPress?: () => void;
  onDelete?: () => void;
}

const statusColors = {
  hold: colors.hold,
  watch: colors.watch,
  sell: colors.sell,
  sold: colors.textMuted,
};

export function FundCard({ fund, onPress, onDelete }: FundCardProps) {
  const isProfit = fund.totalProfit >= 0;
  const profitColor = isProfit ? colors.positive : colors.negative;
  const borderColor = statusColors[fund.status];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { borderLeftColor: borderColor },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>{fund.name}</Text>
          <Text style={styles.code}>{fund.code}</Text>
        </View>
        <AnalysisBadge status={fund.status} score={fund.analysisScore} />
      </View>

      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>持有金额</Text>
          <Text style={styles.value}>
            ¥{fund.purchaseAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>当前价值</Text>
          <Text style={styles.value}>
            ¥{fund.currentValue.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>今日收益</Text>
          <Text style={[styles.valueSmall, { color: fund.dailyProfit >= 0 ? colors.positive : colors.negative }]}>
            {fund.dailyProfit >= 0 ? '+' : ''}¥{fund.dailyProfit.toFixed(2)}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>累计收益</Text>
          <Text style={[styles.valueSmall, { color: profitColor }]}>
            {isProfit ? '+' : ''}¥{fund.totalProfit.toFixed(2)}
            <Text style={styles.rate}> ({fund.totalProfitRate >= 0 ? '+' : ''}{fund.totalProfitRate.toFixed(2)}%)</Text>
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.platform}>
          {fund.platform === 'jd' ? '京东金融' : '支付宝'}
        </Text>
        <Text style={styles.holdDays}>持有{fund.holdDays}天</Text>
      </View>

      {fund.sellCount >= 2 && (
        <View style={styles.warningBadge}>
          <Text style={styles.warningText}>连续{fund.sellCount}次建议卖出</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  nameContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  code: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  item: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  valueSmall: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  rate: {
    fontSize: fontSize.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  platform: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  holdDays: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  warningBadge: {
    backgroundColor: colors.negative,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  warningText: {
    fontSize: fontSize.xs,
    color: '#fff',
    fontWeight: '600',
  },
});
