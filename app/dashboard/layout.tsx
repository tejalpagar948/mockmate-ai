// app/dashboard/layout.tsx
import { InterviewModalProvider } from "../context/interview-modal-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InterviewModalProvider>
      {children}
    </InterviewModalProvider>
  );
}
