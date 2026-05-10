# 基金轮动助手 - 构建说明

## 项目概述

基金轮动助手是一款帮助投资者快速筛选能跟上板块轮动的基金经理的移动应用。支持京东金融和支付宝基金截图导入，自动分析给出"持有/观察/卖出"建议。

## 功能特性

- 📸 **截图导入** - 从京东金融/支付宝截图快速导入基金数据
- 📊 **智能分析** - 基于相对表现的评分算法，判断基金经理表现
- 🔄 **轮动追踪** - 追踪卖出基金，90天冷却期后可考虑买回
- 💾 **本地存储** - 数据保存在本地，保护隐私
- 📱 **跨平台** - 支持 iOS 和 Android

## 技术栈

- **框架**: React Native + Expo
- **语言**: TypeScript
- **导航**: React Navigation (Bottom Tabs)
- **状态管理**: React Context + useReducer
- **存储**: AsyncStorage

## 构建 APK (Android)

### 前置要求

1. Node.js >= 18
2. Java JDK 17
3. Android SDK
4. Gradle 8.14.4

### 步骤

#### 1. 克隆项目并安装依赖

```bash
cd FundTracker
npm install
```

#### 2. 生成原生 Android 代码

```bash
npx expo prebuild --platform android
```

#### 3. 构建 Release APK

```bash
cd android
./gradlew assembleRelease
```

或使用本地 Gradle:

```bash
# 设置环境变量
export JAVA_HOME=/path/to/jdk17
export GRADLE_HOME=/path/to/gradle-8.14.4
export PATH=$GRADLE_HOME/bin:$JAVA_HOME/bin:$PATH

# 构建
./gradlew assembleRelease -x lint
```

#### 4. APK 位置

```
android/app/build/outputs/apk/release/app-release.apk
```

## 构建 iOS

### 步骤

#### 1. 生成原生 iOS 代码

```bash
npx expo prebuild --platform ios
```

#### 2. 使用 Xcode 打开项目

```bash
open ios/FundTracker.xcworkspace
```

#### 3. 在 Xcode 中选择签名方式并构建

## 使用 Expo Go 运行 (开发模式)

```bash
npx expo start
# 扫描二维码在 Expo Go 中打开
```

## 算法说明

### 评分算法 v1.0

**输入数据:**
- 今日收益率
- 累计收益率
- 持有天数

**评分计算:**
```
combinedScore = dailyRelativeReturn * 0.3 + totalRelativeReturn * 0.7

状态判定:
- score >= 20: 持有 (绿色)
- -20 < score < 20: 观察 (黄色)
- score <= -20: 卖出 (红色)
```

**特殊规则:**
- 持有 < 7天: 强制"观察" (避免手续费)
- 连续 2+ 次"卖出": 强化卖出建议
- 卖出后 90 天: 可考虑买回

## 目录结构

```
FundTracker/
├── App.tsx                    # 主应用入口
├── src/
│   ├── components/           # UI 组件
│   │   ├── AddFundForm.tsx   # 添加基金表单
│   │   ├── AnalysisBadge.tsx # 分析状态徽章
│   │   ├── FundCard.tsx      # 基金卡片
│   │   └── TotalSummary.tsx  # 总收益概览
│   ├── constants/
│   │   └── theme.ts          # 主题样式
│   ├── context/
│   │   └── FundContext.tsx   # 全局状态管理
│   ├── screens/
│   │   ├── HomeScreen.tsx    # 持仓列表页
│   │   ├── AddScreen.tsx     # 添加基金页
│   │   ├── ActionScreen.tsx  # 待办操作页
│   │   └── SettingsScreen.tsx# 设置页
│   ├── types/
│   │   └── index.ts          # TypeScript 类型定义
│   └── utils/
│       ├── analyzer.ts       # 分析算法
│       ├── ocr.ts            # OCR 识别
│       └── storage.ts        # 本地存储
└── android/                  # Android 原生代码
```

## 注意事项

1. **OCR 限制**: 当前版本使用规则匹配进行数据识别，后续可集成云端 OCR 服务提高准确率
2. **数据安全**: 所有数据存储在本地，建议定期导出备份
3. **投资风险**: App 仅提供参考建议，投资决策请谨慎

## License

MIT
