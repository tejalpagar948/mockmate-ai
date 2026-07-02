// components/HideClerkBranding.tsx
'use client';

import { useEffect } from 'react';

export default function HideClerkBranding() {
  useEffect(() => {
    const hide = () => {
      // Target the footer container
      document.querySelectorAll('.cl-footer').forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });

      // Also catch the powered-by tag
      document
        .querySelectorAll('[class*="poweredBy"], [class*="footer"]')
        .forEach((el) => {
          if (
            el.textContent?.includes('Clerk') ||
            el.textContent?.includes('Development')
          ) {
            (el as HTMLElement).style.display = 'none';
          }
        });
    };

    // Run immediately and after a short delay (Clerk renders async)
    hide();
    const t = setTimeout(hide, 800);
    return () => clearTimeout(t);
  }, []);

  return null;
}
