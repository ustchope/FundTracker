#!/bin/bash
# FundTracker 一键构建脚本
# 支持 macOS/Linux (需要Node.js, Java JDK 17, Android SDK)

set -e

echo "======================================"
echo "  基金轮动助手 - 构建脚本"
echo "======================================"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 需要安装 Node.js"
    echo "   访问 https://nodejs.org/ 下载安装"
    exit 1
fi

echo "✓ Node.js 版本: $(node --version)"

# 检查Java
if ! command -v java &> /dev/null; then
    echo "❌ 错误: 需要安装 Java JDK 17"
    echo "   访问 https://adoptium.net/ 下载安装"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2)
echo "✓ Java 版本: $JAVA_VERSION"

# 检查Android SDK
if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
    echo "⚠️  警告: ANDROID_HOME 未设置"
    echo "   请设置 ANDROID_HOME 环境变量"
    echo "   例如: export ANDROID_HOME=~/Android/Sdk"
    echo ""
fi

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
npm install

# 生成原生代码
echo ""
echo "🔧 生成Android原生代码..."
npx expo prebuild --platform android --clean

# 构建APK
echo ""
echo "📱 构建Android APK..."
cd android

if [ -n "$ANDROID_HOME" ]; then
    export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH
fi

./gradlew assembleRelease -x lint

# 复制APK到根目录
cp app/build/outputs/apk/release/app-release.apk ../FundTracker.apk

echo ""
echo "======================================"
echo "  ✅ 构建完成!"
echo "======================================"
echo ""
echo "📱 APK文件位置: ./FundTracker.apk"
echo ""
echo "安装到手机:"
echo "  1. 将 FundTracker.apk 传输到手机"
echo "  2. 在手机上打开APK文件"
echo "  3. 如果提示安装未知来源应用，请允许"
echo ""
