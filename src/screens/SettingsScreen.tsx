import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Share,
} from 'react-native';
import { useFundContext } from '../context/FundContext';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';
import { exportData, clearAllData } from '../utils/storage';

export function SettingsScreen() {
  const { funds } = useFundContext();
  const [reminderEnabled, setReminderEnabled] = useState(false);

  const handleExport = async () => {
    try {
      const data = await exportData();
      if (data) {
        await Share.share({
          message: data,
          title: '基金数据导出',
        });
      }
    } catch (error) {
      Alert.alert('导出失败', '无法导出数据');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      '清空所有数据',
      '确定要清空所有基金数据吗？此操作不可恢复！',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认清空',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('已清空', '所有数据已删除，请重启App');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>设置</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>提醒</Text>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>每日提醒</Text>
              <Text style={styles.settingHint}>每天固定时间提醒查看基金</Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>数据管理</Text>
          
          <Pressable style={styles.menuItem} onPress={handleExport}>
            <Text style={styles.menuItemText}>📤 导出数据</Text>
            <Text style={styles.menuItemHint}>导出JSON格式</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleClearData}>
            <Text style={[styles.menuItemText, { color: colors.negative }]}>🗑️ 清空数据</Text>
            <Text style={styles.menuItemHint}>删除所有基金数据</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>统计信息</Text>
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>基金总数</Text>
              <Text style={styles.statValue}>{funds.length} 支</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>持有中</Text>
              <Text style={[styles.statValue, { color: colors.hold }]}>
                {funds.filter(f => f.status === 'hold').length} 支
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>观察中</Text>
              <Text style={[styles.statValue, { color: colors.watch }]}>
                {funds.filter(f => f.status === 'watch').length} 支
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>建议卖出</Text>
              <Text style={[styles.statValue, { color: colors.sell }]}>
                {funds.filter(f => f.status === 'sell').length} 支
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>已卖出</Text>
              <Text style={[styles.statValue, { color: colors.textMuted }]}>
                {funds.filter(f => f.status === 'sold').length} 支
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.appName}>基金轮动助手</Text>
            <Text style={styles.appVersion}>版本 1.0.0</Text>
            <Text style={styles.appDesc}>
              帮助您快速筛选能跟上板块轮动的基金经理，
              轻松管理C类基金，实现快进快出。
            </Text>
          </View>
        </View>

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
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  settingLabel: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  settingHint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  menuItem: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  menuItemText: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  menuItemHint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '600',
  },
  aboutCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  appName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  appVersion: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  appDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 20,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
