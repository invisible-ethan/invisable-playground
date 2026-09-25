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
// visible placeholder otherwise.
export function renderAds(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-ad-slot-name]').forEach((el) => {
    const name = el.dataset.adSlotName ?? '';
    const slot = slots[name];
    el.classList.add('ad');

    if (!client || !slot) {
      el.classList.add('ad--placeholder');
      el.textContent = `Ad slot "${name}" (set VITE_ADSENSE_CLIENT and VITE_ADSENSE_SLOT_${name.toUpperCase()})`;
      return;
    }

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
