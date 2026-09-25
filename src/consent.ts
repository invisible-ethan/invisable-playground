declare global {
  interface Window {
    googlefc?: {
      callbackQueue?: Array<Record<string, () => void> | (() => void)>;
      showRevocationMessage?: () => void;
    };
  }
}

// Wires "Privacy & cookie settings" links to Google's consent message
// (AdSense > Privacy & messaging) so visitors can change their choice.
// The links stay hidden until the consent script is present on the page.
export function initConsentLinks(root: ParentNode = document): void {
  const links = root.querySelectorAll<HTMLElement>('[data-consent-settings]');
  if (!links.length) return;

  window.googlefc = window.googlefc || {};
  window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
  window.googlefc.callbackQueue.push({
    CONSENT_API_READY: () => {
      links.forEach((link) => {
        link.hidden = false;
        link.addEventListener('click', (event) => {
          event.preventDefault();
          window.googlefc?.showRevocationMessage?.();
        });
      });
    },
  });
}

initConsentLinks();
