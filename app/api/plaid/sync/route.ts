import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { plaidClient } from '@/lib/plaid';
import { categorize } from '@/lib/categorize';

export async function POST(request: Request) {
  try {
    // =========================
    // 1. FETCH ACCOUNT
    // =========================
    const account = await prisma.account.findFirst();

    if (!account) {
      return NextResponse.json({ error: 'No account found' }, { status: 404 });
    }

    // =========================
    // 2. FETCH TRANSACTIONS FROM PLAID
    // =========================
    const response = await plaidClient.transactionsSync({
      access_token: account.accessToken,
    });

    const data = response.data;

    // =========================
    // 3. SAVE NEW TRANSACTIONS
    // =========================
    const newTransactions = await Promise.all(
      data.added.map((tx) =>
        prisma.transaction.upsert({
          where: { plaidId: tx.transaction_id },
          update: {},
          create: {
            plaidId: tx.transaction_id,
            accountId: account.id,
            amount: tx.amount,
            date: new Date(tx.date),
            name: tx.name,
            category: categorize(tx.name, tx.category?.[0]),
            merchantName: tx.merchant_name || null,
          },
        })
      )
    );

    // =========================
    // 4. FETCH & UPDATE ACCOUNT BALANCE (SAFE WRAPPED)
    // =========================
    try {
      const balanceResponse = await plaidClient.accountsGet({
        access_token: account.accessToken,
      });

      // Sandbox usually returns multiple accounts; we'll take the first one
      const plaidAccount = balanceResponse.data.accounts[0];

      const latestBalance =
        plaidAccount.balances.available ??
        plaidAccount.balances.current ??
        0;

      await prisma.account.update({
        where: { id: account.id },
        data: { balance: latestBalance },
      });

      console.log(`Success: Updated balance to ${latestBalance}`);
    } catch (balError) {
      console.error('Balance Sync Error:', balError);
    }

    // =========================
    // 5. RESPONSE
    // =========================
    return NextResponse.json({
      success: true,
      added: newTransactions.length,
    });

  } catch (error) {
    console.error('SYNC ERROR:', error);
    return NextResponse.json({ error: 'Failed to sync' }, { status: 500 });
  }
}