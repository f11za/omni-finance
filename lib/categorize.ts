const RULES: Record<string, string[]> = {
  'Food & Drink':  ['restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'sushi', 'starbucks', 'mcdonalds', 'kfc', 'deliveroo', 'talabat', 'zomato'],
  'Transport':     ['uber', 'careem', 'lyft', 'taxi', 'metro', 'parking', 'airline', 'fuel', 'petrol', 'adnoc', 'enoc'],
  'Shopping':      ['amazon', 'noon', 'mall', 'store', 'walmart', 'target', 'ikea', 'h&m', 'zara'],
  'Utilities':     ['electric', 'water', 'internet', 'phone', 'du', 'etisalat', 'dewa', 'sewa', 'addc'],
  'Healthcare':    ['pharmacy', 'hospital', 'clinic', 'dentist', 'doctor', 'aster', 'boots'],
  'Entertainment': ['netflix', 'spotify', 'cinema', 'vox', 'reel', 'steam', 'playstation', 'xbox','touchstone climbing'],
  'Groceries':     ['supermarket', 'grocery', 'lulu', 'carrefour', 'spinneys', 'waitrose', 'choithrams'],
  'Income':        ['salary', 'transfer', 'deposit', 'refund'],
}

export function categorize(name: string, plaidCategory?: string): string {
  const lower = name.toLowerCase();
  
  for (const [category, keywords] of Object.entries(RULES)) {
    if (keywords.some(k => lower.includes(k))) return category;
  }

  // Fallback to Plaid's primary category if it exists
  return plaidCategory || 'Other';
}