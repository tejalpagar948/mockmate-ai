export type DemoTab = 'behavioral' | 'technical' | 'system';

export interface DemoContent {
  question: string;
  answerStart: string;
  tip: string;
}

export interface BentoFeature {
  icon: React.ElementType;
  title: string;
  desc: string;
  big?: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}