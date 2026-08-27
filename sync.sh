#!/usr/bin/env bash
# 一键同步脚本：将本目录（paischool / 卷摆高中模块）改动 提交 -> 推送 GitHub。
# 用法：./sync.sh [自定义提交信息]   （不带参数则用默认信息）
set -euo pipefail
cd "$(dirname "$0")"

REMOTE=origin
BRANCH=main
MSG="${1:-sync: $(date +'%Y-%m-%d %H:%M')}"

if [ -z "$(git status --porcelain)" ]; then
  echo "工作树干净，无改动可提交。"
else
  git add -A
  git commit -m "$MSG"
fi

echo "推送中：${REMOTE}/${BRANCH} ..."
git push "$REMOTE" "$BRANCH"

LEFT=$(git status --porcelain | wc -l)
echo "完成。剩余未提交文件数：${LEFT}"