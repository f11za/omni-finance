'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlaidLink, PlaidLinkOptions } from 'react-plaid-link';

export default function PlaidLink() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Get a Link Token from the backend API on mount
  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch('/api/plaid/create-link-token', { method: 'POST' });
        const data = await response.json();
        
        if (data.link_token) {
          setToken(data.link_token);
        } else {
          console.error("No token received. Error:", data.error);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    createLinkToken();
  }, []);

  // 2. Handle the success event (when user logs in via Plaid)
  const onSuccess = useCallback(async (public_token: string) => {
    setIsLoading(true); // Start a loading state for a smoother transition
    
    try {
      // Step A: Exchange the public token for a permanent access token
      const response = await fetch('/api/plaid/exchange-token', {
        method: 'POST',
        body: JSON.stringify({ public_token }),
      });

      if (response.ok) {
        // Step B: Trigger an initial sync so the dashboard isn't empty on arrival
        await fetch('/api/plaid/sync', { method: 'POST' });

        // Step C: Push the user to the dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("OnSuccess Error:", error);
      setIsLoading(false);
    }
  }, [router]);

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button
      onClick={() => open()}
      disabled={!ready || isLoading}
      className={`
        inline-flex items-center justify-center
        bg-indigo-600 text-white 
        px-8 py-4 rounded-2xl 
        font-bold text-lg
        transition-all duration-200
        shadow-lg shadow-indigo-200
        hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]
        disabled:bg-slate-300 disabled:shadow-none disabled:scale-100
      `}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Connecting...
        </span>
      ) : (
        "Connect Bank Account"
      )}
    </button>
  );
}