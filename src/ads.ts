declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const client = import.meta.env.VITE_ADSENSE_CLIENT ?? '';

const slots: Record<string, string | undefined> = {
  top: import.meta.env.VITE_ADSENSE_SLOT_TOP,
  sidebar: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR,
  bottom: import.meta.env.VITE_ADSENSE_SLOT_BOTTOM,
};

// Fills every element marked with data-ad-slot-name. A slot renders a real
// AdSense unit when both the client and its slot id are configured, and a
// placeholder in dev (and nothing in production) otherwise.
export function renderAds(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-ad-slot-name]').forEach((el) => {
    const name = el.dataset.adSlotName ?? '';
    const slot = slots[name];
    if (!client || !slot) {
      // Empty boxes look unfinished to AdSense reviewers, so only show
      // the placeholder in dev and remove the slot from production pages.
      if (!import.meta.env.DEV) {
        el.remove();
        return;
      }
      el.classList.add('ad', 'ad--placeholder');
      el.textContent = `Ad slot "${name}" (set VITE_ADSENSE_CLIENT and VITE_ADSENSE_SLOT_${name.toUpperCase()})`;
      return;
    }

    el.classList.add('ad');
    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.dataset.adClient = client;
    ins.dataset.adSlot = slot;
    ins.dataset.adFormat = 'auto';
    ins.dataset.fullWidthResponsive = 'true';
    el.replaceChildren(ins);
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  });
}
