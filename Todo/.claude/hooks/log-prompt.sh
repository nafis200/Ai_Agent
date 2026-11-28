#!/usr/bin/env bash
# UserPromptSubmit hook: append each submitted prompt to prompt-log.txt.
input="$(cat)"
log="${CLAUDE_PROJECT_DIR:-.}/.claude/hooks/prompt-log.txt"
prompt="$(printf '%s' "$input" | jq -r '.prompt // empty' 2>/dev/null)"
[ -z "$prompt" ] && exit 0
printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$prompt" >> "$log"
exit 0
