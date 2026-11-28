#!/usr/bin/env bash
# PostCompact hook: open the YouTube link from video.md in the default browser.
cat > /dev/null  # drain hook input
file="${CLAUDE_PROJECT_DIR:-.}/video.md"
url="$(grep -oE 'https?://(www\.)?(youtube\.com|youtu\.be)/[^[:space:])]+' "$file" 2>/dev/null | head -n1)"
[ -z "$url" ] && exit 0
setsid xdg-open "$url" >/dev/null 2>&1 < /dev/null &
exit 0
