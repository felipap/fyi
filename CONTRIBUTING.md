# TODO rewrite

# Technical Notes

## Stack

- Electron
- Vite
- Framer Motion
- Tailwind v4
- OpenAI

## Getting started

You know the drill:

```bash
pnpm install
pnpm dev
```

## Resetting macOS permissions

```
sudo tccutil reset All engineering.pi.nudge
```

### Generating icons

Use this:

```

mkdir images/Production.iconset

# Generate all required icon sizes from your original PNG
sips -z 16 16     images/icon-production.png --out images/Production.iconset/icon_16x16.png
sips -z 32 32     images/icon-production.png --out images/Production.iconset/icon_16x16@2x.png
sips -z 32 32     images/icon-production.png --out images/Production.iconset/icon_32x32.png
sips -z 64 64     images/icon-production.png --out images/Production.iconset/icon_32x32@2x.png
sips -z 128 128   images/icon-production.png --out images/Production.iconset/icon_128x128.png
sips -z 256 256   images/icon-production.png --out images/Production.iconset/icon_128x128@2x.png
sips -z 256 256   images/icon-production.png --out images/Production.iconset/icon_256x256.png
sips -z 512 512   images/icon-production.png --out images/Production.iconset/icon_256x256@2x.png
sips -z 512 512   images/icon-production.png --out images/Production.iconset/icon_512x512.png
sips -z 1024 1024 images/icon-production.png --out images/Production.iconset/icon_512x512@2x.png

# Convert the iconset to icns
iconutil -c icns images/Production.iconset
```

```
mkdir images/Development.iconset

# Generate all required icon sizes from your original PNG
sips -z 16 16     images/icon-development.png --out images/Development.iconset/icon_16x16.png
sips -z 32 32     images/icon-development.png --out images/Development.iconset/icon_16x16@2x.png
sips -z 32 32     images/icon-development.png --out images/Development.iconset/icon_32x32.png
sips -z 64 64     images/icon-development.png --out images/Development.iconset/icon_32x32@2x.png
sips -z 128 128   images/icon-development.png --out images/Development.iconset/icon_128x128.png
sips -z 256 256   images/icon-development.png --out images/Development.iconset/icon_128x128@2x.png
sips -z 256 256   images/icon-development.png --out images/Development.iconset/icon_256x256.png
sips -z 512 512   images/icon-development.png --out images/Development.iconset/icon_256x256@2x.png
sips -z 512 512   images/icon-development.png --out images/Development.iconset/icon_512x512.png
sips -z 1024 1024 images/icon-development.png --out images/Development.iconset/icon_512x512@2x.png

# Convert the iconset to icns
iconutil -c icns images/Development.iconset
```

## Why we use a simple back-end API instead of proxying OpenAI calls

For users that don't have an OpenAI API key, we provide a "hosted" version of
Nudge that sends AI requests through our API server at nudge.fyi. The API has
different endpoints like `/api/assess` and `/api/feedback`, one for each type of
AI inference used in the app. Each endpoint expects a different set of inputs,
making them very simple.

The alternative would be to implement a proxy server that mimics the OpenAI API.
But we decided against this due to the complexity. It'd be overkill, and
potentially more dangerous too.

## Why we send fingerprint headers

As a measure to prevent abuse. (write more)

## Debugging available versions

https://update.electronjs.org/felipap/nudge/darwin-arm64/0.1.4 <-- version user is coming from.

## Logs

Nudge writes logs to the following files:

- `~/Library/Logs/Nudge/main.log`
- `~/Library/Logs/Nudge/error.log`

In development, look inside the `~/Library/Logs/FYIDev` folder.
