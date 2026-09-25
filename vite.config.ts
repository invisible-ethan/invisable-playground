import { defineConfig, loadEnv, type Plugin } from 'vite';

// Default AdSense publisher id; override with VITE_ADSENSE_CLIENT.
const DEFAULT_ADSENSE_CLIENT = 'ca-pub-6470972930893111';

// Every page of the site. Adding a page means adding its HTML file here.
const PAGES: Record<string, string> = {
  main: 'index.html',
  howToPlay: 'how-to-play.html',
  tips: 'tips.html',
  about: 'about.html',
  contact: 'contact.html',
  privacy: 'privacy.html',
  terms: 'terms.html',
};

// Injects the AdSense loader into <head> and writes ads.txt at build time.
function adsense(client: string): Plugin {
  const pubId = client.replace(/^ca-/, '');
  return {
    name: 'adsense',
    transformIndexHtml() {
      if (!client) return [];
      return [
        {
          tag: 'meta',
          attrs: { name: 'google-adsense-account', content: client },
          injectTo: 'head',
        },
        {
          tag: 'script',
          attrs: {
            async: true,
            src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`,
            crossorigin: 'anonymous',
          },
          injectTo: 'head',
        },
      ];
    },
    generateBundle() {
      if (!client) return;
      this.emitFile({
        type: 'asset',
        fileName: 'ads.txt',
        source: `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`,
      });
    },
  };
}

const HEADER = `<header class="site-header">
      <a class="site-name" href="/">Elevator Action Remake</a>
      <nav>
        <a href="/">Home</a>
        <a href="/how-to-play.html">How to play</a>
        <a href="/tips.html">Tips</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
      </nav>
    </header>`;

const FOOTER = `<footer class="site-footer">
      <span>&copy; ${new Date().getFullYear()} Elevator Action Remake</span>
      <a href="/about.html">About</a>
      <a href="/contact.html">Contact</a>
      <a href="/privacy.html">Privacy policy</a>
      <a href="/terms.html">Terms of use</a>
      <a href="#" data-consent-settings hidden>Privacy &amp; cookie settings</a>
    </footer>`;

// Where visitors play the game. Override with VITE_GAME_URL once it's deployed.
const DEFAULT_GAME_URL = 'https://github.com/invisible-ethan/elevator-action-playground';

// Shares one header and footer across pages, fills in the contact email and game URL,
// and writes robots.txt plus (when the site URL is known) sitemap.xml.
function site(opts: { siteUrl: string; contactEmail: string; gameUrl: string }): Plugin {
  const siteUrl = opts.siteUrl.replace(/\/$/, '');
  return {
    name: 'site',
    transformIndexHtml(html) {
      return html
        .replace('<!-- site-header -->', HEADER)
        .replace('<!-- site-footer -->', FOOTER)
        .replaceAll('%CONTACT_EMAIL%', opts.contactEmail)
        .replaceAll('%GAME_URL%', opts.gameUrl);
    },
    buildStart() {
      if (!opts.contactEmail) this.warn('VITE_CONTACT_EMAIL is not set; the contact page will have no email address.');
      if (!siteUrl) this.warn('VITE_SITE_URL is not set; sitemap.xml will not be generated.');
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /'];
      if (siteUrl) robots.push(`Sitemap: ${siteUrl}/sitemap.xml`);
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots.join('\n') + '\n' });

      if (!siteUrl) return;
      const urls = Object.values(PAGES)
        .map((file) => (file === 'index.html' ? '/' : `/${file}`))
        .map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`)
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const client = env.VITE_ADSENSE_CLIENT || DEFAULT_ADSENSE_CLIENT;
  return {
    plugins: [
      site({
        siteUrl: env.VITE_SITE_URL ?? '',
        contactEmail: env.VITE_CONTACT_EMAIL ?? '',
        gameUrl: env.VITE_GAME_URL || DEFAULT_GAME_URL,
      }),
      adsense(client),
    ],
    define: {
      'import.meta.env.VITE_ADSENSE_CLIENT': JSON.stringify(client),
    },
    build: {
      rollupOptions: { input: PAGES },
    },
  };
});
