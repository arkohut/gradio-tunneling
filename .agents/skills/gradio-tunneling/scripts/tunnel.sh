# Starts a gradio-tun tunnel in the background and prints the public URL.
# Usage: tunnel.sh PORT [SUBDOMAIN] | tunnel.sh --stop PORT
#
# gradio-tunneling >= 0.9.1 flushes the URL line itself and terminates its
# frpc child on SIGTERM. The PYTHONUNBUFFERED export and frpc pkill below
# are kept so the script also works against older installed versions.
set -euo pipefail

ACTION="${1:-}"
LOG_DIR="${TMPDIR:-/tmp}"

kill_port_tunnels() {
  local port="$1"
  local pidfile="$LOG_DIR/gradio-tun-$port.pid"
  if [[ -f "$pidfile" ]] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
    kill "$(cat "$pidfile")" 2>/dev/null || true
  fi
  pkill -f "gradio-tun(-neling)? $port( |$)" 2>/dev/null || true
  pkill -f "frpc.* -l $port" 2>/dev/null || true # orphaned frpc child from <=0.9.0
  rm -f "$pidfile"
}

if [[ "$ACTION" == "--stop" ]]; then
  [[ $# -ge 2 ]] || { echo "Usage: tunnel.sh --stop PORT" >&2; exit 1; }
  kill_port_tunnels "$2"
  echo "Stopped tunnel on port $2."
  exit 0
fi

PORT="$ACTION" SD="${2:-}"
[[ -n "$PORT" ]] || { echo "Usage: tunnel.sh PORT [SUBDOMAIN] | tunnel.sh --stop PORT" >&2; exit 1; }

command -v gradio-tun >/dev/null 2>&1 || {
  echo "gradio-tun not found. Install it first with one of:" >&2
  echo "  uv tool install gradio-tunneling" >&2
  echo "  pipx install gradio-tunneling" >&2
  echo "  pip install gradio-tunneling" >&2
  exit 1
}

export PYTHONUNBUFFERED=1 # <=0.9.0 buffers the URL line when stdout is redirected
LOG="$LOG_DIR/gradio-tun-$PORT.log"
PIDFILE="$LOG_DIR/gradio-tun-$PORT.pid"

kill_port_tunnels "$PORT" # same-port/-sd restarts conflict server-side if the old frpc survives
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
