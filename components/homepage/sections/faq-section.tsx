'use client';

import { useState } from 'react';
import FaqItem from '../elements/faqitem';
import { FAQS } from '../utils/constants';

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative z-10 mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
          FAQ
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Questions, answered.
        </h2>
      </div>

      <div className="mt-10 space-y-3">
        {FAQS.map((item, i) => (
          <FaqItem
            key={item.q}
            question={item.q}
            answer={item.a}
            isOpen={openFaq === i}
            onToggle={() => setOpenFaq(openFaq === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
