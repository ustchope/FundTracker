import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  Alert,
} from 'react-native';
import { useFundContext } from '../context/FundContext';
import { FundCard } from '../components/FundCard';
import { TotalSummary } from '../components/TotalSummary';
import { Fund, FundStatus } from '../types';
import { calculateTotalProfit } from '../utils/analyzer';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

export function HomeScreen({ navigation }: any) {
  const { funds, deleteFund, refreshAnalysis, analyzeAll } = useFundContext();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | FundStatus>('all');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    analyzeAll();
    setRefreshing(false);
  }, [analyzeAll]);

  const filteredFunds = filter === 'all'
    ? funds
    : funds.filter(f => f.status === filter);

  const totals = calculateTotalProfit(funds);

  const handleFundPress = (fund: Fund) => {
    Alert.alert(
      fund.name,
      `代码: ${fund.code}\n状态: ${{
        hold: '持有',
        watch: '观察',
        sell: '卖出',
        sold: '已卖'
      }[fund.status]}\n分析得分: ${fund.analysisScore.toFixed(1)}`,
      [
        { text: '重新分析', onPress: () => refreshAnalysis(fund.id) },
        { text: '删除', style: 'destructive', onPress: () => deleteFund(fund.id) },
        { text: '关闭', style: 'cancel' },
      ]
    );
  };

  const FilterButton = ({ status, label }: { status: 'all' | FundStatus; label: string }) => (
    <Pressable
      style={[styles.filterButton, filter === status && styles.filterButtonActive]}
      onPress={() => setFilter(status)}
    >
      <Text style={[styles.filterButtonText, filter === status && styles.filterButtonTextActive]}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>基金持仓</Text>
        <Text style={styles.subtitle}>{funds.length}支基金</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <TotalSummary {...totals} />

        <View style={styles.filterContainer}>
          <FilterButton status="all" label={`全部(${funds.length})`} />
          <FilterButton status="sell" label={`卖出(${funds.filter(f => f.status === 'sell').length})`} />
          <FilterButton status="watch" label={`观察(${funds.filter(f => f.status === 'watch').length})`} />
          <FilterButton status="hold" label={`持有(${funds.filter(f => f.status === 'hold').length})`} />
        </View>

        {filteredFunds.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无基金数据</Text>
            <Text style={styles.emptyHint}>点击底部"添加"扫描截图导入基金</Text>
          </View>
        ) : (
          filteredFunds.map(fund => (
            <FundCard
              key={fund.id}
              fund={fund}
              onPress={() => handleFundPress(fund)}
            />
          ))
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  filterButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptyHint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
