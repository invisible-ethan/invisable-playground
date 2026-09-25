import { defineConfig, loadEnv, type Plugin } from 'vite';

// Injects the AdSense loader into <head> and writes ads.txt at build time,
// but only when VITE_ADSENSE_CLIENT is set, so no publisher id lives in the repo.
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [adsense(env.VITE_ADSENSE_CLIENT ?? '')],
  };
});
