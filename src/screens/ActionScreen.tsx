import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useFundContext } from '../context/FundContext';
import { FundCard } from '../components/FundCard';
import { Fund } from '../types';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

export function ActionScreen() {
  const { funds, updateFund, refreshAnalysis, analyzeAll } = useFundContext();

  const sellFunds = funds.filter(f => f.status === 'sell');
  const watchFunds = funds.filter(f => f.status === 'watch');
  const soldFunds = funds.filter(f => f.status === 'sold');
  const rebuyFunds = funds.filter(f => f.status === 'sold' && f.totalProfitRate > 20);

  const handleMarkSold = (fund: Fund) => {
    Alert.alert(
      '确认卖出',
      `确定已将 ${fund.name} 卖出吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认',
          onPress: () => {
            const now = new Date().toISOString();
            updateFund(fund.id, {
              status: 'sold',
              watchHistory: [...fund.watchHistory, { date: now, status: 'sold' as const }],
            });
            Alert.alert('已记录', '基金已标记为已卖出，表现好时随时可买回');
          },
        },
      ]
    );
  };

  const handleRebuy = (fund: Fund) => {
    Alert.alert(
      '确认买回',
      `确定要买回 ${fund.name} 吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认',
          onPress: () => {
            const now = new Date().toISOString();
            updateFund(fund.id, {
              status: 'hold',
              sellCount: 0,
              watchHistory: [...fund.watchHistory, { date: now, status: 'hold' as const }],
            });
            Alert.alert('已买回', `${fund.name} 已重新买入`);
          },
        },
      ]
    );
  };

  const handleKeepHolding = (fund: Fund) => {
    const now = new Date().toISOString();
    updateFund(fund.id, {
      status: 'hold',
      sellCount: 0,
      watchHistory: [...fund.watchHistory, { date: now, status: 'hold' as const }],
    });
  };

  const renderSection = (
    title: string,
    fundList: Fund[],
    badgeColor: string,
    actionButtons?: (fund: Fund) => React.ReactNode
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{fundList.length}</Text>
        </View>
      </View>
      {fundList.length === 0 ? (
        <Text style={styles.emptyText}>暂无</Text>
      ) : (
        fundList.map(fund => (
          <View key={fund.id}>
            <FundCard fund={fund} />
            {actionButtons && (
              <View style={styles.actionButtons}>
                {actionButtons(fund)}
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>待办操作</Text>
        <Text style={styles.subtitle}>根据分析结果执行的建议</Text>
      </View>

      <ScrollView style={styles.content}>
        {renderSection(
          '🟢 可买回',
          rebuyFunds,
          colors.hold,
          (fund) => (
            <Pressable
              style={[styles.actionButton, styles.rebuyButton]}
              onPress={() => handleRebuy(fund)}
            >
              <Text style={styles.actionButtonText}>立即买回</Text>
            </Pressable>
          )
        )}

        {renderSection(
          '🔴 建议卖出',
          sellFunds,
          colors.sell,
          (fund) => (
            <>
              <Pressable
                style={[styles.actionButton, styles.soldButton]}
                onPress={() => handleMarkSold(fund)}
              >
                <Text style={styles.actionButtonText}>确认已卖出</Text>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.holdButton]}
                onPress={() => handleKeepHolding(fund)}
              >
                <Text style={styles.holdButtonText}>继续持有</Text>
              </Pressable>
            </>
          )
        )}

        {renderSection(
          '🟡 持续观察',
          watchFunds,
          colors.watch,
          (fund) => (
            <Pressable
              style={[styles.actionButton, styles.refreshButton]}
              onPress={() => refreshAnalysis(fund.id)}
            >
              <Text style={styles.actionButtonText}>重新分析</Text>
            </Pressable>
          )
        )}

        {renderSection('📊 已卖出基金', soldFunds.filter(f => !rebuyFunds.includes(f)), colors.textMuted)}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>操作建议说明</Text>
          <Text style={styles.infoText}>
            • 🟢 可买回：表现回升，可考虑买回{'\n'}
            • 🔴 卖出：综合得分低于-20，建议换仓{'\n'}
            • 🟡 观察：表现一般，继续关注{'\n'}
            • 持有 {'<'} 7天的基金不建议卖出（手续费高）{'\n'}
            • C类基金卖出后随时可买回
          </Text>
        </View>

        <Pressable style={styles.refreshAllButton} onPress={analyzeAll}>
          <Text style={styles.refreshAllText}>刷新所有分析</Text>
        </Pressable>

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
    paddingBottom: spacing.md,
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: fontSize.xs,
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  soldButton: {
    backgroundColor: colors.sell,
  },
  rebuyButton: {
    backgroundColor: colors.hold,
  },
  holdButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  refreshButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: fontSize.sm,
    color: '#fff',
    fontWeight: '600',
  },
  holdButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  refreshAllButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  refreshAllText: {
    fontSize: fontSize.md,
    color: '#fff',
    fontWeight: '600',
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
