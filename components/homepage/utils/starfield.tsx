const DOT_POSITIONS = [
  'top-10 left-[8%]',
  'top-24 left-1/2',
  'top-6 right-[20%]',
  'top-1/2 left-[4%]',
  'top-1/3 right-[6%]',
  'bottom-24 left-[15%]',
  'bottom-10 right-[12%]',
  'bottom-1/3 right-1/3',
  'top-2/3 left-1/3',
];

export default function StarField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {DOT_POSITIONS.map((pos, i) => (
        <span
          key={i}
          className={`absolute h-1 w-1 rounded-full bg-white/20 ${pos}`}
        />
      ))}
    </div>
  );
}
