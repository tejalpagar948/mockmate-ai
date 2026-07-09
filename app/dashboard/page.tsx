// app/dashboard/page.tsx
import db from "@/utils/db";
import { mockInterview } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from '@/components/homepage/sections/navbar';
import Footer from '@/components/homepage/sections/footer';
import Dashboard from '@/components/dashboard/sections/dashboard';

export default async function DashboardPage() {
  const user = await currentUser();

  let interviewList: typeof mockInterview.$inferSelect[] = [];

  try {
    interviewList = await db
      .select()
      .from(mockInterview)
      .where(eq(mockInterview.createdBy, user?.primaryEmailAddress?.emailAddress ?? ""))
      .orderBy(desc(mockInterview.id));
  } catch (error) {
    console.error("Dashboard DB fetch error:", error);
  }

  return (
    <>
      <Navbar variant="dashboard" />
      <main>
        <Dashboard interviewList={interviewList} />
      </main>
      <Footer />
    </>
  );
}