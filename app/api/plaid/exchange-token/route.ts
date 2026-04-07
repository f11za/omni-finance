import { plaidClient } from '@/lib/plaid';
import { prisma } from '@/lib/prisma'; // Our database helper
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { public_token } = await request.json();
    
    // 1. Exchange the public token for a permanent access token
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    const { access_token, item_id } = response.data;

    // 2. Save this "Account" to your Supabase Database
    // In a real app, you'd use the actual logged-in user's ID
    const newAccount = await prisma.account.create({
      data: {
        userId: "user_123",
        accessToken: access_token, // Now it matches your schema!
        itemId: item_id,           // Now it matches your schema!
        plaidId: item_id,          // Using item_id as the unique plaidId
        name: "First Platypus Bank",
        type: "depository",
        balance: 0.0,              // We will update this later with real data
  },
});

    return NextResponse.json({ success: true, accountId: newAccount.id });
  } catch (error) {
    console.error("EXCHANGE ERROR:", error);
    return NextResponse.json({ error: 'Failed to save account' }, { status: 500 });
  }
}