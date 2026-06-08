import { AuthHeader } from "@/components/AuthHeader";
import { AccountDashboard } from "@/components/AccountDashboard";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      <div className="mx-auto max-w-lg px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">My account</h1>
        <AccountDashboard />
      </div>
    </div>
  );
}
