// components/dashboard/TabBar.tsx

interface TabBarProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onChange: (tab: T) => void;
}

export function TabBar<T extends string>({
  tabs,
  activeTab,
  onChange,
}: TabBarProps<T>) {
  return (
    <div className="flex gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] mb-6 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
            activeTab === tab
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
              : 'text-white/40 hover:text-white/70'
          }`}>
          {tab}
        </button>
      ))}
    </div>
  );
}
