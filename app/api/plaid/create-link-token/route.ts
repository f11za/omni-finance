import { plaidClient } from '@/lib/plaid';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'unique_user_123' },
      client_name: 'Personal Finance Dashboard',
      products: ['transactions'] as any,
      country_codes: ['US'] as any,
      language: 'en',
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PLAID ERROR:", error);
    return NextResponse.json({ error: 'Failed to create link token' }, { status: 500 });
  }
}