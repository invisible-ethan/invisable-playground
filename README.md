# Invisable Playground

A minimal Vite + TypeScript web app with Google AdSense wired in.

## Run it

```sh
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
```

## Plug in your AdSense ids

1. Copy `.env.example` to `.env`.
2. The publisher id `ca-pub-6470972930893111` is the default (in `vite.config.ts`). Set `VITE_ADSENSE_CLIENT` only to use a different one.
3. Set `VITE_ADSENSE_SLOT_TOP`, `VITE_ADSENSE_SLOT_SIDEBAR` and `VITE_ADSENSE_SLOT_BOTTOM` to ad unit ids from AdSense > Ads > By ad unit.
4. Run `npm run build` and deploy `dist/`.

On your host (Netlify, Vercel, etc.) set the same variables in its environment settings instead of a `.env` file.

The build:

- adds the AdSense loader script and the `google-adsense-account` meta tag to `<head>` (needed for site verification),
- writes `dist/ads.txt` for your publisher id.

Any slot without an id shows a dashed placeholder, so the page works before your account is approved.

## Adding more ad slots

Put `<div data-ad-slot-name="yourname"></div>` anywhere in the page, then add a `yourname` entry to `slots` in `src/ads.ts` and a matching `VITE_ADSENSE_SLOT_YOURNAME` variable.

Ads only serve on a real domain approved in your AdSense account, not on `localhost`.
