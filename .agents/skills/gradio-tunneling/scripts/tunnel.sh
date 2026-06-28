# Starts a gradio-tun tunnel in the background and prints the public URL.
# Usage: tunnel.sh PORT [SUBDOMAIN]
# Kill the tunnel later with: tunnel.sh --stop PORT
set -euo pipefail

ACTION="${1:-}"
LOG_DIR="${TMPDIR:-/tmp}"

stop_tunnel() {
  local port="$1"
  local pidfile="$LOG_DIR/gradio-tun-$port.pid"
  # Kill the wrapper first, then any orphaned frpc child still bound to this port
  # (killing the wrapper alone does NOT stop frpc: SIGTERM skips Python's atexit).
  if [[ -f "$pidfile" ]] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
    kill "$(cat "$pidfile")" 2>/dev/null || true
  fi
  pkill -f "gradio-tun(-neling)? $port( |$)" 2>/dev/null || true
  pkill -f "frpc.* -l $port" 2>/dev/null || true
  rm -f "$pidfile"
  echo "Stopped tunnel on port $port."
}

if [[ "$ACTION" == "--stop" ]]; then
  [[ $# -ge 2 ]] || { echo "Usage: tunnel.sh --stop PORT" >&2; exit 1; }
  stop_tunnel "$2"
  exit 0
fi

PORT="$ACTION"
SD="${2:-}"
[[ -n "$PORT" ]] || { echo "Usage: tunnel.sh PORT [SUBDOMAIN] | tunnel.sh --stop PORT" >&2; exit 1; }

if ! command -v gradio-tun >/dev/null 2>&1; then
  echo "gradio-tun not found. Install it first with one of:" >&2
  echo "  uv tool install gradio-tunneling" >&2
  echo "  pipx install gradio-tunneling" >&2
  echo "  pip install gradio-tunneling" >&2
  exit 1
fi

# The CLI blocks for 72h after printing the URL, and Python buffers stdout when
# redirected — force unbuffered output so the URL lands in the log immediately.
export PYTHONUNBUFFERED=1

LOG="$LOG_DIR/gradio-tun-$PORT.log"
PIDFILE="$LOG_DIR/gradio-tun-$PORT.pid"

# Stop a previous tunnel on the same port: wrapper AND its frpc child
# (same-name proxies conflict server-side if the old frpc survives).
if [[ -f "$PIDFILE" ]] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  kill "$(cat "$PIDFILE")" 2>/dev/null || true
fi
pgrep -f "gradio-tun(-neling)? $PORT( |$)" >/dev/null 2>&1 && \
  pkill -f "gradio-tun(-neling)? $PORT( |$)" 2>/dev/null || true
pkill -f "frpc.* -l $PORT" 2>/dev/null || true
sleep 2

if [[ -n "$SD" ]]; then
  nohup gradio-tun "$PORT" --sd "$SD" >"$LOG" 2>&1 &
else
  nohup gradio-tun "$PORT" >"$LOG" 2>&1 &
fi
echo $! >"$PIDFILE"
PID="$(cat "$PIDFILE")"
echo "Tunnel starting (pid $PID, log: $LOG)..."

URL=""
for _ in $(seq 1 45); do
  # Preferred: the address line printed by the CLI (公网访问地址：<url>)
  URL="$(sed -n 's/.*公网访问地址[：:][[:space:]]*//p' "$LOG" 2>/dev/null | head -1 || true)"
  # Fallback: first https:// URL in the frpc log ("start proxy success: <url>")
  [[ -z "$URL" ]] && URL="$(grep -oE 'https://[^[:space:]]+' "$LOG" 2>/dev/null | head -1 || true)"
  [[ -n "$URL" ]] && break
  if ! kill -0 "$PID" 2>/dev/null; then
    echo "Tunnel process exited early. Log tail:" >&2
    tail -30 "$LOG" >&2
    rm -f "$PIDFILE"
    exit 1
  fi
  sleep 1
done

if [[ -z "$URL" ]]; then
  echo "Timed out after 45s waiting for the URL. Log tail:" >&2
  tail -30 "$LOG" >&2
  rm -f "$PIDFILE"
  exit 1
fi

echo "PUBLIC_URL=$URL"
echo "Expires in 72h. Follow logs: tail -f $LOG"
echo "Stop later with: $(basename "$0") --stop $PORT"
