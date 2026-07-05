# gradio-tunneling explainer video (Remotion)

A ~15s, 1920×1080 explainer showing how `gradio-tunneling` exposes a local
service on port 8080 to the public internet.

## Develop

```sh
cd remotion
npm install
npm run dev      # opens Remotion Studio
```

## Render

```sh
npm run render   # -> out/gradio-tunneling-remotion.mp4
```

Composition: `ExposePort` (450 frames @ 30fps). Scenes: Problem → Commands → Result.

## Note on re-rendering elsewhere

The diagram uses color emoji (🖥️ 🌍 🔒 …). They render correctly on macOS. If you
re-render on a bare Linux/CI host, install a color-emoji font (e.g. `fonts-noto-color-emoji`)
first, or the emoji may appear as empty boxes.
