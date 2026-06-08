import Link from "next/link";
import { AuthHeader } from "./AuthHeader";

interface LegalLayoutProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, updated, children }: LegalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AuthHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <Link href="/" className="text-sm font-medium text-green-700 hover:underline">
          ← Back to home
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {updated}</p>
        <article className="prose-legal mt-8 space-y-6 text-gray-700">{children}</article>
      </main>
    </div>
  );
}
