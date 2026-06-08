import { AuthHeader } from "@/components/AuthHeader";
import { PracticeSetup } from "@/components/PracticeSetup";

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      <PracticeSetup />
    </div>
  );
}
