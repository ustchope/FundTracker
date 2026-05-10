import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FundStatus } from '../types';
import { colors, borderRadius, fontSize, spacing } from '../constants/theme';

interface AnalysisBadgeProps {
  status: FundStatus;
  score?: number;
}

const statusConfig = {
  hold: { label: '持有', color: colors.hold, textColor: '#fff' },
  watch: { label: '观察', color: colors.watch, textColor: '#000' },
  sell: { label: '卖出', color: colors.sell, textColor: '#fff' },
  sold: { label: '已卖', color: colors.textMuted, textColor: '#fff' },
};

export function AnalysisBadge({ status, score }: AnalysisBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <View style={[styles.badge, { backgroundColor: config.color }]}>
      <Text style={[styles.label, { color: config.textColor }]}>{config.label}</Text>
      {score !== undefined && (
        <Text style={[styles.score, { color: config.textColor }]}>
          {score > 0 ? '+' : ''}{score.toFixed(1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  score: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
});
