#!/bin/bash
# FundTracker EAS云端构建脚本
# 需要网络连接，会在EAS服务器上构建

set -e

echo "======================================"
echo "  基金轮动助手 - EAS云端构建"
echo "======================================"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 需要安装 Node.js"
    exit 1
fi

# 登录EAS (如果需要)
echo ""
echo "🔐 检查EAS登录状态..."
npx eas whoami &>/dev/null || {
    echo "请先登录EAS:"
    echo "  npx eas login"
    exit 1
}

# 安装EAS CLI (如果需要)
npm install -g eas-cli

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
npm install

# 登录Expo (如果需要)
echo ""
echo "🔐 登录Expo..."
npx expo login || true

# 构建Android
echo ""
echo "📱 正在构建Android APK (这可能需要5-15分钟)..."
npx eas build --platform android --profile preview

# 构建iOS
echo ""
echo "📱 正在构建iOS (这可能需要10-30分钟)..."
npx eas build --platform ios --profile production

echo ""
echo "======================================"
echo "  ✅ 构建已提交!"
echo "======================================"
echo ""
echo "请访问 https://expo.dev 查看构建进度"
echo "构建完成后会收到下载链接"
echo ""
