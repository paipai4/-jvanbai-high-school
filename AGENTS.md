# Project Instructions

## Git sync rule (mandatory)

Every round of modifications to this project MUST be synced to the GitHub repo
(`git@github.com:paipai4/-jvanbai-high-school.git`, branch `main`) before the
round is considered finished.

Use the one-click script (Git Bash, no encoding issues on this machine):

```bash
./sync.sh                    # commit with default timestamp message, then push
./sync.sh "custom message"   # commit with a custom message, then push
```

The script stages all changes, commits (skips if the tree is clean), and pushes.
After it finishes, `git status` must show no uncommitted changes.

本目录是开发副本，发布在 GitHub 仓库 paipai4/-jvanbai-high-school，每轮修改后须同步推送。