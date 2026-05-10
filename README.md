# 基金轮动助手 📱

一款帮助投资者快速筛选能跟上板块轮动的基金经理的移动应用。支持京东金融和支付宝基金截图导入，自动分析给出"持有/观察/卖出"建议，实现C类基金快进快出。

## ⭐ 功能特性

- 📸 **截图导入** - 从京东金融/支付宝截图快速导入基金数据
- 🤖 **智能分析** - 基于相对表现的评分算法，判断基金经理表现
- 🔄 **轮动追踪** - 卖出后随时可买回，持续追踪表现
- 💾 **本地存储** - 数据保存在本地，保护隐私
- 📱 **跨平台** - 支持 iOS 和 Android

## 📊 分析算法

```
评分 = 今日相对收益 × 0.3 + 累计相对收益 × 0.7

判定规则:
- 评分 ≥ 20  → 🟢 持有
- -20 < 评分 < 20  → 🟡 观察
- 评分 ≤ -20  → 🔴 卖出
```

**特殊规则:**
- 持有 < 7天: 强制"观察"（避免手续费）
- 连续 2+ 次"卖出": 强化卖出建议
- 卖出后随时可买回（无冷却期）

## 🚀 快速开始

### 方式一: 使用EAS云端构建（推荐）

```bash
# 1. 安装依赖
npm install

# 2. 登录EAS (需要Expo账号，免费)
npx eas login

# 3. 云端构建 (会自动构建iOS和Android)
./build-eas.sh
```

构建完成后访问 https://expo.dev 下载安装包。

### 方式二: 本地构建

#### Android 构建

**前置要求:**
- Node.js >= 18
- Java JDK 17
- Android SDK

**步骤:**
```bash
# 1. 设置环境变量
export ANDROID_HOME=~/Android/Sdk
export JAVA_HOME=/path/to/jdk17

# 2. 安装依赖
npm install

# 3. 生成原生代码
npx expo prebuild --platform android

# 4. 构建
cd android
./gradlew assembleRelease

# 5. APK位置
# android/app/build/outputs/apk/release/app-release.apk
```

#### iOS 构建 (仅macOS)

**前置要求:**
- macOS
- Xcode
- Apple开发者账号

**步骤:**
```bash
# 1. 安装依赖
npm install

# 2. 生成原生代码
npx expo prebuild --platform ios

# 3. 使用Xcode打开
open ios/FundTracker.xcworkspace

# 4. 在Xcode中选择签名方式并构建
```

### 方式三: 开发模式运行

```bash
npm install
npx expo start
```

然后在手机上的Expo Go中扫描二维码打开。

## 📁 项目结构

```
FundTracker/
├── App.tsx                    # 主应用入口
├── src/
│   ├── components/            # UI 组件
│   │   ├── FundCard.tsx      # 基金卡片
│   │   ├── AnalysisBadge.tsx # 分析状态徽章
│   │   ├── TotalSummary.tsx  # 总收益概览
│   │   └── AddFundForm.tsx   # 添加基金表单
│   ├── screens/              # 页面
│   │   ├── HomeScreen.tsx    # 持仓列表
│   │   ├── AddScreen.tsx     # 添加基金
│   │   ├── ActionScreen.tsx  # 待办操作
│   │   └── SettingsScreen.tsx# 设置
│   ├── utils/                # 工具函数
│   │   ├── analyzer.ts       # 分析算法
│   │   ├── ocr.ts           # 截图识别
│   │   └── storage.ts       # 本地存储
│   ├── context/              # 状态管理
│   │   └── FundContext.tsx
│   ├── types/                # TypeScript类型
│   │   └── index.ts
│   └── constants/            # 常量
│       └── theme.ts
├── android/                  # Android原生代码
├── ios/                      # iOS原生代码
└── eas.json                  # EAS构建配置
```

## 📖 使用指南

### 添加基金
1. 点击底部"添加"标签
2. 选择截图来源（京东金融/支付宝）
3. 拍照或从相册选择截图
4. 核对自动识别的数据
5. 点击确认添加

### 查看分析
- "持仓"页面显示所有基金及其状态标签
- 🟢 绿色表示建议持有
- 🟡 黄色表示建议观察
- 🔴 红色表示建议卖出

### 执行操作
1. 点击"待办"标签查看需要操作的基金
2. 对于建议卖出的基金，点击"确认已卖出"
3. 如果基金表现回升，"可买回"区域会显示该基金
4. 点击"立即买回"重新买入

### 更新数据
- 每天打开App，点击持仓页面下拉刷新
- App会自动重新分析所有基金

## 🔧 技术栈

- **框架**: React Native + Expo 54
- **语言**: TypeScript
- **导航**: React Navigation (Bottom Tabs)
- **状态管理**: React Context + useReducer
- **存储**: AsyncStorage

## ⚠️ 注意事项

1. **OCR识别**: 当前版本使用规则匹配，建议手动核对识别结果
2. **数据安全**: 所有数据存储在本地，建议定期导出备份
3. **投资风险**: App 仅提供参考建议，投资决策请谨慎
4. **C类基金**: 持有满7天再卖出可避免惩罚性手续费

## 📄 License

MIT
