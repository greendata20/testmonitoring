#!/bin/bash
# 이 파일은 github 설정되지 않은 프로젝트에서만 실행시킴
#
echo "🚀 CTSS Hackathon Quick Deploy Script"
echo "======================================"

# 프로젝트 번호 입력 받기
read -p "깃헙 ctss 프로젝트 번호를 입력해주세요 (숫자만): " project_number

# 입력값 검증
if [[ ! $project_number =~ ^[0-9]+$ ]]; then
    echo "❌ 숫자만 입력해주세요!"
    exit 1
fi

echo "📝 선택된 프로젝트: ctss-$project_number"

# 프로젝트 번호에 따른 GitHub 정보 설정
if [ $((project_number % 2)) -eq 0 ]; then
    # 짝수인 경우 - 진규님 계정
    github_username="ijg0341"
    github_token="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"
    user_email="ijg0341@naver.com"
    echo "📝 짝수 프로젝트 - 진규님 계정 사용"
else
    # 홀수인 경우 - 기존 계정
    github_username="SeeSoRuFree"
    github_token="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"
    user_email="seesoorufree@hackathon.com"
    echo "📝 홀수 프로젝트 - 기존 계정 사용"
fi

echo "⚙️  Git 설정 중..."
# Git 사용자 정보 설정
git config user.name "$github_username"
git config user.email "$user_email"

echo "🔗 원격 저장소 설정 중..."
# 원격 저장소 URL 설정 (토큰 포함)
git remote remove origin 2>/dev/null || true
git remote add origin https://$github_username:$github_token@github.com/$github_username/ctss-$project_number.git

echo "📦 변경사항 커밋 중..."
# 모든 변경사항 추가 및 커밋
git add .
git commit -m "CTSS Hackathon Project $project_number - Initial Implementation

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>" || echo "변경사항이 없거나 이미 커밋되었습니다."

echo "🚀 GitHub에 푸시 중..."
# GitHub에 푸시
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ 성공적으로 배포되었습니다!"
    echo "🌐 배포 URL: https://ctss-$project_number.vercel.app/"
    echo "📝 GitHub 저장소: https://github.com/$github_username/ctss-$project_number"
    echo ""
    echo "💡 Vercel에서 자동 배포가 진행됩니다. 몇 분 후 URL에서 확인하세요!"
else
    echo "❌ 푸시에 실패했습니다. 토큰이나 저장소 설정을 확인해주세요."
    exit 1
fi
