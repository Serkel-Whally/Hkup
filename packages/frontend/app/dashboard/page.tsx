import { DashboardHome, DashboardShell } from "@/app/components/dashboard-shell";

export default function DashboardPage() {
  return (
    <DashboardShell active="/dashboard">
      <DashboardHome />
    </DashboardShell>
  );
}
