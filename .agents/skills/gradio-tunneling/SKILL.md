---
name: gradio-tunneling
description: Expose a local port to a public HTTPS URL using the gradio-tun CLI (frpc-based reverse tunnel through Gradio's share servers). Use when the user wants to put localhost on the internet, share a local web app (Gradio, Streamlit, FastAPI, Vite/Next dev server, ComfyUI, Jupyter) with other people, get a public URL for testing external webhook callbacks (Stripe, GitHub, WeChat), demo from a laptop, or mentions tunnel / tunneling / public URL / 内网穿透 / 公网地址 / 公网访问 / 把本地服务分享出去. Covers install, background start, URL extraction, deterministic subdomains, and the 72-hour expiry.
---

# gradio-tunneling

Turn any local HTTP service into a public `https://*.gradio.live` URL with one command. No account, no config, no server needed.

## When to use

- User wants a public URL for something running on localhost (any HTTP service on any port)
- Sharing a local app/demo with teammates or users outside the LAN
- Testing external webhook callbacks (payment providers, GitHub webhooks, OAuth redirects) against a local dev server
- Keywords: tunnel, expose port, public URL, share local app, 内网穿透, 公网地址, 公网访问

## Install (once per machine)

```sh
uv tool install gradio-tunneling   # recommended; or:
pipx install gradio-tunneling      # or:
pip install gradio-tunneling
```

Verify with `gradio-tun --help`. First tunnel start also downloads the `frpc` binary automatically (needs network access to `cdn-media.huggingface.co`); it is cached in the package directory for subsequent runs.

## Core workflow

⚠️ **Critical: `gradio-tun` never exits on its own.** After printing the URL it sleeps for 72 hours, so it MUST run in the background with output redirected to a log file. Never run it in the foreground of a shell command — it will block until timeout.

Also export `PYTHONUNBUFFERED=1`, otherwise the URL line stays stuck in Python's stdout buffer when redirected to a file and never reaches the log.

```sh
# 1. The local service must already be listening on the port
curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:7860/   # expect 2xx/3xx (or at least a response)

# 2. Start the tunnel in the background
export PYTHONUNBUFFERED=1
nohup gradio-tun 7860 >/tmp/gradio-tun.log 2>&1 &
echo $! >/tmp/gradio-tun.pid

# 3. Poll the log for the URL (takes a few seconds)
for i in $(seq 1 30); do
  URL=$(grep -oE 'https://[^[:space:]]+' /tmp/gradio-tun.log | head -1)
  [[ -n "$URL" ]] && break
  sleep 1
done
echo "$URL"   # e.g. https://a1b2c3d4e5f6.gradio.live

# 4. Verify end-to-end
curl -s -o /dev/null -w '%{http_code}' "$URL"

# 5. Stop it when done — kill the wrapper AND any frpc child
kill "$(cat /tmp/gradio-tun.pid)"
pkill -f "frpc.* -l 7860" 2>/dev/null || true
```

Or use the bundled helper, which does steps 2–4 and handles restart/stop:

```sh
bash "$(dirname "$SKILL_PATH")/scripts/tunnel.sh" 7860            # prints PUBLIC_URL=...
bash "$(dirname "$SKILL_PATH")/scripts/tunnel.sh" 7860 myapp      # with subdomain
bash "$(dirname "$SKILL_PATH")/scripts/tunnel.sh" --stop 7860
```

(Resolve `SKILL_PATH` against this skill's directory: `.agents/skills/gradio-tunneling`.)

## CLI reference

```
gradio-tun PORT [--sd NAME]      # positional port
gradio-tun --port PORT [--sd NAME]
```

| Flag | Meaning |
|---|---|
| `PORT` / `--port PORT` | Local port to expose (1–65535). Required. |
| `--sd NAME` (alias `--subdomain`) | Deterministic subdomain. **Not used literally** — it is hashed into a unique string, but the same `NAME` always yields the same result. |

Both `gradio-tun` and `gradio-tunneling` invoke the same entry point.

## Gotchas

- **72-hour expiry.** The URL dies and the process exits after 72h. Restart the tunnel to get a new URL; with a fixed `--sd` the new URL keeps the same subdomain.
- **The URL line is printed in Chinese:** `公网访问地址：https://....gradio.live`. When parsing output, match `公网访问地址` or the first `https://` URL — don't assume an English label.
- **Killing the wrapper does not kill the frpc child.** SIGTERM skips Python's atexit, so an orphaned `frpc` process keeps the proxy registered server-side. Always follow up with `pkill -f "frpc.* -l PORT"` (the bundled script does this for you).
- **One proxy per `--sd` name at a time.** Starting a second tunnel with the same `--sd` while the old frpc is still alive fails with `new proxy ... error`. Kill the old tunnel first, wait a couple of seconds, retry.
- **502 from the tunnel** almost always means nothing is listening on the local port (or it listens on a different interface). Fix the local service, not the tunnel.
- **Login/proxy errors from frpc** in the log mean the share server is unreachable or the platform binary is missing. Check network access; unsupported platforms get a 403 at binary download.
- The `--sd` hash is one-way: the user's chosen name never appears in the URL.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `gradio-tun: command not found` | Not installed, or installed into a venv that isn't active. Use `uv tool install` / `pipx install`. |
| Log stalls with no URL | First-run binary download slow, or `cdn-media.huggingface.co` blocked. Check the log tail. |
| Tunnel process exits immediately | Read `tail -30` of the log — usually bad port (out of range), frpc login failure, or a same-`--sd` name conflict (see Gotchas). |
| `new proxy ... error` in frpc log | Another live tunnel (possibly an orphaned frpc) is using the same `--sd`. `pkill -f "frpc.* -l PORT"`, wait ~2s, retry. |
| Public URL returns 502 | Local service not running on that port / crashed after tunnel start. |
| URL worked but now fails | 72h expiry passed — restart the tunnel (same `--sd` keeps the same subdomain). |
