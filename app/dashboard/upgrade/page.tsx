// app/dashboard/upgrade/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import UpgradeClient from "./UpgradeClient";

export default async function UpgradePage() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return <UpgradeClient userEmail={email} />;
}