import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFundContext } from '../context/FundContext';
import { AddFundForm } from '../components/AddFundForm';
import { OCRResult, Platform as FundPlatform } from '../types';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

export function AddScreen() {
  const { addFund, refreshAnalysis } = useFundContext();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [ocrResult, setOcrResult] = useState<Partial<OCRResult> | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<FundPlatform>('jd');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('权限不足', '需要相册权限来选择截图');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setLoading(true);
      
      setTimeout(() => {
        const mockOcrResult: Partial<OCRResult> = {
          name: '',
          code: '',
          purchaseAmount: 0,
          currentValue: 0,
          dailyProfit: 0,
          totalProfit: 0,
          holdDays: 0,
          confidence: 0,
        };
        setOcrResult(mockOcrResult);
        setLoading(false);
        setShowForm(true);
      }, 1500);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('权限不足', '需要相机权限来拍照');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setLoading(true);
      
      setTimeout(() => {
        const mockOcrResult: Partial<OCRResult> = {
          name: '',
          code: '',
          purchaseAmount: 0,
          currentValue: 0,
          dailyProfit: 0,
          totalProfit: 0,
          holdDays: 0,
          confidence: 0,
        };
        setOcrResult(mockOcrResult);
        setLoading(false);
        setShowForm(true);
      }, 1500);
    }
  };

  const handleSubmit = (data: {
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
  }) => {
    addFund({
      ...data,
      status: 'watch',
      analysisScore: 0,
    });
    
    Alert.alert('成功', '基金已添加，正在分析...', [
      {
        text: '确定',
        onPress: () => {
          setImageUri(null);
          setShowForm(false);
          setOcrResult(null);
        },
      },
    ]);
  };

  const handleCancel = () => {
    setShowForm(false);
    setImageUri(null);
    setOcrResult(null);
  };

  if (showForm) {
    return (
      <View style={styles.container}>
        <AddFundForm
          initialData={ocrResult || undefined}
          platform={selectedPlatform}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>添加基金</Text>
        <Text style={styles.subtitle}>从京东金融或支付宝截图导入</Text>
      </View>

      <View style={styles.content}>
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

        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>截图导入说明</Text>
          <Text style={styles.instructionText}>
            1. 打开{selectedPlatform === 'jd' ? '京东金融' : '支付宝'}基金页面{'\n'}
            2. 截取基金持仓或详情页面{'\n'}
            3. 点击下方按钮选择截图{'\n'}
            4. 核对识别结果并修正{'\n'}
            5. 确认添加
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonIcon}>🖼️</Text>
            <Text style={styles.buttonText}>从相册选择</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonIcon}>📷</Text>
            <Text style={styles.buttonText}>拍照截图</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.manualButton}
          onPress={() => {
            setShowForm(true);
            setSelectedPlatform('jd');
          }}
        >
          <Text style={styles.manualButtonText}>手动输入基金信息</Text>
        </Pressable>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>正在识别截图...</Text>
          </View>
        )}

        {imageUri && !loading && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>已选择截图</Text>
          </View>
        )}
      </View>
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
  platformSelector: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  platformButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  platformButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  platformButtonText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  platformButtonTextActive: {
    color: '#fff',
  },
  instructionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  instructionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  instructionText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  button: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  buttonText: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  manualButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderStyle: 'dashed',
  },
  manualButtonText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  loadingText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  previewTitle: {
    fontSize: fontSize.sm,
    color: colors.positive,
    fontWeight: '600',
  },
});
