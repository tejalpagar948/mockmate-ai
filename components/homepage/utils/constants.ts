import { BrainCircuit, MessageSquareText, Code2, Sparkles } from 'lucide-react';
import type { DemoContent, DemoTab, BentoFeature, FaqItem } from './types';

export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Questions",
    href: "#faq",
  },
  {
    label: "Upgrade",
    href: "/dashboard/upgrade",
  },
  {
    label: "How It Works?",
    href: "#process",
  },
];

export const DEMO_CONTENT: Record<DemoTab, DemoContent> = {
  behavioral: {
    question: "Tell me about a time you disagreed with a teammate's approach.",
    answerStart:
      'In a recent sprint, a teammate wanted to hardcode config values directly into components...',
    tip: 'Use STAR: set up the Situation, your Task, the Action you took, and the Result.',
  },
  technical: {
    question: 'How would you debounce a search input in React without extra libraries?',
    answerStart:
      "I'd use a useEffect with setTimeout, clearing the previous timer on every keystroke...",
    tip: "Mention trade-offs: debounce vs throttle, and when you'd reach for a library instead.",
  },
  system: {
    question: 'Design a rate limiter for an API gateway handling 10k req/sec.',
    answerStart:
      "I'd start with a token bucket per client, backed by Redis for distributed state...",
    tip: 'Call out scaling bottlenecks early — interviewers want to see you anticipate them.',
  },
};

export const BENTO_FEATURES: BentoFeature[] = [
  {
    icon: BrainCircuit,
    title: 'Role-specific question banks',
    desc: "Frontend, backend, system design, and DSA — matched to the company and level you're targeting.",
    big: true,
  },
  {
    icon: MessageSquareText,
    title: 'Instant answer feedback',
    desc: 'Clarity, structure, and accuracy scored right after you finish speaking.',
  },
  {
    icon: Code2,
    title: 'Live coding rounds',
    desc: 'Solve problems in a real editor while the AI asks follow-ups.',
  },
  {
    icon: Sparkles,
    title: 'Personalized weak-spot tracking',
    desc: 'Your dashboard shows exactly what to practice next, based on past sessions.',
    big: true,
  },
];

export const FAQS: FaqItem[] = [
  {
    q: 'Is Mock Mate AI free to use?',
    a: 'Your first interview is free. After that, you can upgrade for unlimited sessions, detailed scoring history, and advanced system design rounds.',
  },
  {
    q: 'Can I practice with voice, or only typing?',
    a: "Both. Speak your answers for a realistic feel, or type them if you're in a quiet space — either way you get the same scoring breakdown.",
  },
  {
    q: 'Does it cover system design interviews?',
    a: 'Yes. The AI interviewer asks follow-up questions about trade-offs and scaling, just like a real system design round.',
  },
  {
    q: 'How is my score calculated?',
    a: 'Each answer is scored on clarity, structure, and technical accuracy, then combined into your overall score out of 100 on your dashboard.',
  },
];