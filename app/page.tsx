import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PlaidLink from '@/components/PlaidLink';

export default async function Home() {
  // 1. Check if ANY account exists in the database
  const existingAccount = await prisma.account.findFirst();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 text-slate-900">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-black mb-6 tracking-tight">
          Omni<span className="text-indigo-600">Finance</span>
        </h1>
        
        {existingAccount ? (
          // IF ACCOUNT EXISTS: Show the shortcut
          <div className="space-y-6">
            <p className="text-slate-600 text-lg">
              Welcome back! Your bank account is already connected.
            </p>
            <Link 
              href="/dashboard"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200"
            >
              Enter Dashboard →
            </Link>
          </div>
        ) : (
          // IF NO ACCOUNT: Show the onboarding flow
          <>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Welcome to OmniFinance. The smartest way to track your spending. Connect your bank securely 
              using Plaid to unlock real-time insights.
            </p>
            <PlaidLink />
          </>
        )}
      </div>
    </main>
  );
}