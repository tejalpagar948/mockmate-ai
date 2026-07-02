// app/dashboard/layout.tsx
import Navbar from '@/components/dashboard/sections/navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
