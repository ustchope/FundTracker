import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { OCRResult, Platform as FundPlatform } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

interface AddFundFormProps {
  initialData?: Partial<OCRResult>;
  platform?: FundPlatform;
  onSubmit: (data: {
    name: string;
    code: string;
    platform: FundPlatform;
    purchaseAmount: number;
    currentValue: number;
    dailyProfit: number;
    dailyProfitRate: number;
    totalProfit: number;
    totalProfitRate: number;
    holdDays: number;
  }) => void;
  onCancel: () => void;
}

export function AddFundForm({ initialData, platform = 'jd', onSubmit, onCancel }: AddFundFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [code, setCode] = useState(initialData?.code || '');
  const [purchaseAmount, setPurchaseAmount] = useState(
    initialData?.purchaseAmount ? String(initialData.purchaseAmount) : ''
  );
  const [currentValue, setCurrentValue] = useState(
    initialData?.currentValue ? String(initialData.currentValue) : ''
  );
  const [dailyProfit, setDailyProfit] = useState(
    initialData?.dailyProfit ? String(initialData.dailyProfit) : ''
  );
  const [totalProfit, setTotalProfit] = useState(
    initialData?.totalProfit ? String(initialData.totalProfit) : ''
  );
  const [holdDays, setHoldDays] = useState(
    initialData?.holdDays ? String(initialData.holdDays) : ''
  );
  const [selectedPlatform, setSelectedPlatform] = useState<FundPlatform>(platform);

  const handleSubmit = () => {
    const pAmount = parseFloat(purchaseAmount) || 0;
    const cValue = parseFloat(currentValue) || 0;
    const dProfit = parseFloat(dailyProfit) || 0;
    const tProfit = parseFloat(totalProfit) || 0;
    const days = parseInt(holdDays, 10) || 0;

    const dailyProfitRate = pAmount > 0 ? (dProfit / pAmount) * 100 : 0;
    const totalProfitRate = pAmount > 0 ? (tProfit / pAmount) * 100 : 0;

    onSubmit({
      name: name.trim(),
      code: code.trim(),
      platform: selectedPlatform,
      purchaseAmount: pAmount,
      currentValue: cValue,
      dailyProfit: dProfit,
      dailyProfitRate,
      totalProfit: tProfit,
      totalProfitRate,
      holdDays: days,
    });
  };

  const pAmount = parseFloat(purchaseAmount) || 0;
  const isValid = name.trim() && code.trim().length === 6 && pAmount > 0;

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>添加基金</Text>

      <View style={styles.platformSelector}>
        <Pressable
          style={[
            styles.platformButton,
            selectedPlatform === 'jd' && styles.platformButtonActive,
          ]}
          onPress={() => setSelectedPlatform('jd')}
        >
          <Text
            style={[
              styles.platformButtonText,
              selectedPlatform === 'jd' && styles.platformButtonTextActive,
            ]}
          >
            京东金融
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.platformButton,
            selectedPlatform === 'alipay' && styles.platformButtonActive,
          ]}
          onPress={() => setSelectedPlatform('alipay')}
        >
          <Text
            style={[
              styles.platformButtonText,
              selectedPlatform === 'alipay' && styles.platformButtonTextActive,
            ]}
          >
            支付宝
          </Text>
        </Pressable>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>基金名称</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="如：XX灵活配置混合"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>基金代码</Text>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="6位基金代码"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          maxLength={6}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>买入金额</Text>
        <TextInput
          style={styles.input}
          value={purchaseAmount}
          onChangeText={setPurchaseAmount}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>当前价值</Text>
        <TextInput
          style={styles.input}
          value={currentValue}
          onChangeText={setCurrentValue}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>今日收益（正数盈利，负数亏损）</Text>
        <TextInput
          style={styles.input}
          value={dailyProfit}
          onChangeText={setDailyProfit}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>累计收益（正数盈利，负数亏损）</Text>
        <TextInput
          style={styles.input}
          value={totalProfit}
          onChangeText={setTotalProfit}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>持有天数</Text>
        <TextInput
          style={styles.input}
          value={holdDays}
          onChangeText={setHoldDays}
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>取消</Text>
        </Pressable>
        <Pressable
          style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={styles.submitButtonText}>确认添加</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  platformSelector: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  platformButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  platformButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  platformButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  platformButtonTextActive: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  submitButtonText: {
    fontSize: fontSize.md,
    color: '#fff',
    fontWeight: '600',
  },
});
