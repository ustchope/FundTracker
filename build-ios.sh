#!/bin/bash
# FundTracker iOS构建脚本
# 需要 macOS + Xcode

set -e

echo "======================================"
echo "  基金轮动助手 - iOS构建脚本"
echo "======================================"

# 检查macOS
if [ "$(uname)" != "Darwin" ]; then
    echo "❌ 错误: iOS构建只能在 macOS 上进行"
    exit 1
fi

# 检查Xcode
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ 错误: 需要安装 Xcode"
    echo "   从 App Store 安装 Xcode"
    exit 1
fi

echo "✓ Xcode 已安装"

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
npm install

# 生成原生代码
echo ""
echo "🔧 生成iOS原生代码..."
npx expo prebuild --platform ios --clean

# 构建iOS
echo ""
echo "📱 构建iOS..."
cd ios

# 创建Archive
xcodebuild -workspace FundTracker.xcworkspace \
    -scheme FundTracker \
    -configuration Release \
    -archivePath FundTracker.xcarchive \
    archive

# 导出IPA
echo ""
echo "📦 导出IPA..."
xcodebuild -exportArchive \
    -archivePath FundTracker.xcarchive \
    -exportOptionsPlist ExportOptions.plist \
    -exportPath ../FundTracker.ipa

echo ""
echo "======================================"
echo "  ✅ 构建完成!"
echo "======================================"
echo ""
echo "📱 IPA文件位置: ./FundTracker.ipa"
echo ""
echo "安装到iPhone (需要Apple开发者账号):"
echo "  1. 登录 Apple Developer 网站创建证书"
echo "  2. 在Xcode中配置签名"
echo "  3. 使用 Xcode 打开项目并运行"
echo ""
echo "或使用 TestFlight 发布测试版本"
echo ""
