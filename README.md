# Invisable Playground

The introduction site for the [Elevator Action web remake](https://github.com/invisible-ethan/elevator-action-playground): home page, how to play, tips, about, contact, privacy and terms. It's a Vite + TypeScript static site with Google AdSense wired in.

The Play buttons link to https://elevator-action.invisable-playground.uk/ (override with `VITE_GAME_URL`).

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

Any slot without an id shows a dashed placeholder in `npm run dev` and is removed entirely from the production build, so reviewers never see empty ad boxes.

## Adding more ad slots

Put `<div data-ad-slot-name="yourname"></div>` anywhere in the page, then add a `yourname` entry to `slots` in `src/ads.ts` and a matching `VITE_ADSENSE_SLOT_YOURNAME` variable.

Ads only serve on a real domain approved in your AdSense account, not on `localhost`.

## EU/UK/Swiss consent (required by Google)

Google requires a certified consent management platform (CMP) that integrates with the IAB TCF to serve personalized ads to visitors in the EEA, the UK and Switzerland ([details](https://support.google.com/adsense/answer/13554116)).

The simplest certified CMP is Google's own, configured in your AdSense account. It is delivered through the AdSense script already on every page, so no extra code is needed:

1. In AdSense, go to **Privacy & messaging > European regulations** and create a message.
2. Select this site's domain, choose the consent options you want, and **Publish** it.

The app already includes the pieces that go with it:

- `privacy.html`, a privacy policy with the cookie disclosures AdSense requires. Edit it to describe your site.
- A "Privacy & cookie settings" link in the footer (and on the privacy page) that reopens the consent message. It stays hidden until Google's consent script loads.

## Getting through AdSense site review

The site already has what reviewers look for structurally: clear navigation, About, Contact, Privacy policy and Terms of use pages on every page's footer, `ads.txt`, `robots.txt`, a `sitemap.xml` (when `VITE_SITE_URL` is set), and no empty ad boxes.

What only you can add, and what decides approval:

1. **Original content.** Google rejects sites with little or no content ("low value content"). The home, how-to-play and tips pages are written from the game's README; keep adding original pages (patch notes, guides) and add each one to `PAGES` in `vite.config.ts`.
2. **Contact details.** Set `VITE_CONTACT_EMAIL` so the contact page shows a real address.
3. **Your own domain.** Deploy to a domain you own, set `VITE_SITE_URL` to it, and add that site under **Sites** in AdSense.
4. **Consent message.** Publish the European regulations message in AdSense (see above).
