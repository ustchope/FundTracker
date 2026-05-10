#!/bin/bash
# FundTracker 一键推送到 GitHub 脚本

echo "======================================"
echo "  基金轮动助手 - 推送到 GitHub"
echo "======================================"

# 检查是否已经初始化git
if [ ! -d ".git" ]; then
    echo ""
    echo "🔧 初始化 Git 仓库..."
    git init
fi

# 创建 .gitignore（如果不存在）
if [ ! -f ".gitignore" ]; then
    echo "创建 .gitignore 文件..."
    cat > .gitignore << 'EOF'
node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# macOS
.DS_Store

# Android
android/.gradle
android/app/build
android/build
android/gradlew.bat
android/local.properties
android/app/release
android/app/outputs

# iOS
ios/build
ios/Pods
ios/Podfile.lock
ios/*.xcodeproj/xcuserdata
ios/*.xcworkspace/xcuserdata

# EAS
.eas/

# Build outputs
*.apk
*.ipa
*.aab
EOF
fi

echo ""
echo "✅ 准备好的文件:"
echo "   - .github/workflows/build.yml (自动构建配置)"
echo "   - .gitignore (忽略临时文件)"
echo ""
echo "======================================"
echo "接下来的步骤："
echo "======================================"
echo ""
echo "1. 在 GitHub 上创建一个仓库（可以是私有的）"
echo "   - 访问: https://github.com/new"
echo ""
echo "2. 替换下面命令中的 你的用户名 和 仓库名，然后执行："
echo ""
echo "   git add ."
echo "   git commit -m \"Initial commit: FundTracker\""
echo "   git branch -M main"
echo "   git remote add origin https://github.com/你的用户名/FundTracker.git"
echo "   git push -u origin main"
echo ""
echo "3. 配置 GitHub Secrets（构建需要）："
echo "   - 访问 https://expo.dev/settings/access-tokens 创建 Token"
echo "   - 在 GitHub 仓库 → Settings → Secrets and variables → Actions"
echo "   - 添加 Secret: Name=EXPO_TOKEN, Value=你的Expo Token"
echo ""
echo "4. 在 GitHub Actions 中运行构建"
echo "   - 仓库 → Actions → Build App → Run workflow"
echo ""
echo "======================================"
echo ""
echo "💡 提示：如果想先在本地测试，可以运行："
echo "   npm install"
echo "   npx expo start"
echo ""
