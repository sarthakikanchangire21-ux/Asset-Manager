import { Transaction, Budget, Category, CATEGORY_LABELS } from '@/context/FinanceContext';

function monthTransactions(transactions: Transaction[], month: number, year: number) {
  return transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
}

function categorySpending(txns: Transaction[]): Record<string, number> {
  const map: Record<string, number> = {};
  txns.filter(t => t.type === 'expense').forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return map;
}

function topCategories(spending: Record<string, number>, n = 3) {
  return Object.entries(spending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n);
}

export const SUGGESTED_QUESTIONS = [
  'How am I doing this month?',
  'Where am I spending most?',
  'Am I over budget?',
  'How can I save more?',
  'Show me my savings rate',
  'Compare to last month',
];

export function generateAIResponse(
  query: string,
  transactions: Transaction[],
  budgets: Budget[],
): string {
  const q = query.toLowerCase().trim();
  const now = new Date();
  const cm = now.getMonth();
  const cy = now.getFullYear();
  const lm = cm === 0 ? 11 : cm - 1;
  const ly = cm === 0 ? cy - 1 : cy;

  const curTxns = monthTransactions(transactions, cm, cy);
  const lastTxns = monthTransactions(transactions, lm, ly);

  const curIncome = curTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const curExpenses = curTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const lastExpenses = lastTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = curIncome - curExpenses;
  const savingsRate = curIncome > 0 ? (balance / curIncome) * 100 : 0;

  const catSpend = categorySpending(curTxns);
  const top = topCategories(catSpend);

  const curBudgets = budgets.filter(b => b.month === cm + 1 && b.year === cy);
  const overBudget = curBudgets.filter(b => (catSpend[b.category] || 0) > b.amount);
  const nearBudget = curBudgets.filter(b => {
    const s = catSpend[b.category] || 0;
    return s <= b.amount && s >= b.amount * 0.8;
  });

  const monthName = now.toLocaleString('default', { month: 'long' });

  if (transactions.length === 0) {
    if (q.includes('hello') || q.includes('hi') || q.length < 5) {
      return "Hello! I'm your AI financial advisor. Add some transactions to get started and I'll give you personalized insights about your spending habits and financial health.";
    }
    return "You haven't added any transactions yet. Head to the Transactions tab to log your income and expenses, then come back and I'll provide detailed financial analysis!";
  }

  // Greeting
  if (/^(hi|hello|hey|howdy)[\s!?.]*$/.test(q)) {
    if (curIncome > 0) {
      return `Hello! Here's your ${monthName} snapshot:\n\n• Income: $${curIncome.toFixed(2)}\n• Spent: $${curExpenses.toFixed(2)}\n• Savings rate: ${savingsRate.toFixed(1)}%${overBudget.length > 0 ? `\n• Over budget: ${overBudget.map(b => CATEGORY_LABELS[b.category as Category]).join(', ')}` : ''}\n\nWhat would you like to explore?`;
    }
    return `Hello! You've spent $${curExpenses.toFixed(2)} so far in ${monthName}. Add your income to see your savings rate. What would you like to know?`;
  }

  // Overall status / "how am I doing"
  if (q.includes('how am i') || q.includes('doing') || q.includes('overall') || q.includes('summary') || q.includes('status')) {
    if (curExpenses === 0 && curIncome === 0) {
      return `No transactions logged for ${monthName} yet. Start by adding your income and daily expenses to get a full financial picture.`;
    }
    let r = `Financial health for ${monthName}:\n\n`;
    if (curIncome > 0) r += `• Income: $${curIncome.toFixed(2)}\n`;
    r += `• Expenses: $${curExpenses.toFixed(2)}\n`;
    if (curIncome > 0) {
      r += `• Net: ${balance >= 0 ? '+' : ''}$${balance.toFixed(2)}\n`;
      r += `• Savings rate: ${savingsRate.toFixed(1)}% ${savingsRate >= 20 ? '(excellent)' : savingsRate >= 10 ? '(good)' : '(needs work)'}\n`;
    }
    if (overBudget.length > 0) {
      r += `\nOver budget: ${overBudget.map(b => CATEGORY_LABELS[b.category as Category]).join(', ')}`;
    } else if (curBudgets.length > 0) {
      r += '\nAll spending is within budget limits.';
    }
    if (top.length > 0) {
      r += `\n\nTop expense: ${CATEGORY_LABELS[top[0][0] as Category]} ($${top[0][1].toFixed(2)})`;
    }
    return r;
  }

  // Spending breakdown
  if (q.includes('spend') || q.includes('spent') || q.includes('expense') || q.includes('where') || q.includes('most')) {
    if (curExpenses === 0) {
      return `No expenses logged for ${monthName} yet. Add your transactions and I'll show you a detailed breakdown.`;
    }
    let r = `${monthName} spending breakdown:\n\nTotal: $${curExpenses.toFixed(2)}`;
    if (lastExpenses > 0) {
      const diff = ((curExpenses - lastExpenses) / lastExpenses) * 100;
      r += ` (${diff > 0 ? '+' : ''}${diff.toFixed(1)}% vs last month)`;
    }
    r += '\n\nBy category:\n';
    top.forEach(([cat, amt], i) => {
      const pct = ((amt / curExpenses) * 100).toFixed(0);
      r += `${i + 1}. ${CATEGORY_LABELS[cat as Category]}: $${amt.toFixed(2)} (${pct}%)\n`;
    });
    if (Object.keys(catSpend).length > 3) {
      r += `...and ${Object.keys(catSpend).length - 3} more categories`;
    }
    return r;
  }

  // Budget status
  if (q.includes('budget') || q.includes('limit') || q.includes('over')) {
    if (curBudgets.length === 0) {
      return "You haven't set any budgets for this month. Go to the Budgets tab to create spending limits by category. I'll then track your progress in real time.";
    }
    let r = `Budget status for ${monthName}:\n\n`;
    curBudgets.forEach(b => {
      const spent = catSpend[b.category] || 0;
      const pct = ((spent / b.amount) * 100).toFixed(0);
      const label = spent > b.amount ? 'OVER' : spent >= b.amount * 0.8 ? 'Near limit' : 'On track';
      r += `${CATEGORY_LABELS[b.category as Category]}: $${spent.toFixed(2)}/$${b.amount.toFixed(2)} (${pct}%) — ${label}\n`;
    });
    if (overBudget.length > 0) {
      r += `\nAction needed: Reduce ${overBudget.map(b => CATEGORY_LABELS[b.category as Category]).join(' and ')} spending.`;
    } else if (nearBudget.length > 0) {
      r += `\nHeads up: You're approaching your limit for ${nearBudget.map(b => CATEGORY_LABELS[b.category as Category]).join(' and ')}.`;
    } else {
      r += '\nGreat work! All categories are within budget.';
    }
    return r;
  }

  // Savings
  if (q.includes('saving') || q.includes('save') || q.includes('savings rate')) {
    if (curIncome === 0) {
      return "Log your income this month to see your savings rate. A healthy target is 20% of your income (the 50/30/20 rule). Head to Transactions and add your salary or other income.";
    }
    let r = `Savings summary for ${monthName}:\n\n`;
    r += `• Savings rate: ${savingsRate.toFixed(1)}%\n`;
    r += `• Saved: $${Math.max(0, balance).toFixed(2)}\n\n`;
    if (savingsRate >= 20) {
      r += "Excellent! You're hitting the recommended 20% savings target.\n\n";
    } else if (savingsRate >= 10) {
      r += `Good start! Try to reach 20% — you'd need to save $${(curIncome * 0.2 - balance).toFixed(2)} more.\n\n`;
    } else if (savingsRate > 0) {
      r += "Your savings rate is below recommended levels. Small changes add up.\n\n";
    } else {
      r += "You're spending more than you earn. This needs immediate attention.\n\n";
    }
    if (top.length > 0) {
      const [topCat, topAmt] = top[0];
      r += `Quick win: Cut ${CATEGORY_LABELS[topCat as Category]} by 20% → save $${(topAmt * 0.2).toFixed(2)}/month`;
    }
    return r;
  }

  // 50/30/20 rule
  if (q.includes('50') || q.includes('rule') || q.includes('30/20') || q.includes('50/30')) {
    if (curIncome === 0) {
      return "The 50/30/20 rule suggests:\n\n• 50% on needs (housing, food, transport, utilities)\n• 30% on wants (entertainment, dining, shopping)\n• 20% on savings and debt repayment\n\nAdd your monthly income to see your personalized breakdown!";
    }
    return `50/30/20 rule for your $${curIncome.toFixed(2)} monthly income:\n\n• Needs (50%): $${(curIncome * 0.5).toFixed(2)}\n  housing, groceries, utilities, transport\n\n• Wants (30%): $${(curIncome * 0.3).toFixed(2)}\n  entertainment, dining, hobbies\n\n• Savings (20%): $${(curIncome * 0.2).toFixed(2)}\n  emergency fund, investments, debt\n\nYour current savings rate: ${savingsRate.toFixed(1)}%`;
  }

  // Month comparison
  if (q.includes('last month') || q.includes('compare') || q.includes('trend')) {
    if (lastExpenses === 0 && curExpenses === 0) {
      return "Not enough data for comparison yet. Keep tracking your transactions across months and I'll show detailed trends!";
    }
    let r = 'Month-over-month comparison:\n\n';
    r += `• ${monthName}: $${curExpenses.toFixed(2)} spent\n`;
    if (lastExpenses > 0) {
      const diff = curExpenses - lastExpenses;
      const pct = Math.abs((diff / lastExpenses) * 100).toFixed(1);
      const lmName = new Date(ly, lm).toLocaleString('default', { month: 'long' });
      r += `• ${lmName}: $${lastExpenses.toFixed(2)} spent\n`;
      r += `• Change: ${diff >= 0 ? '+' : ''}$${diff.toFixed(2)} (${diff >= 0 ? '+' : '-'}${pct}%)\n\n`;
      r += diff < 0
        ? 'You spent less this month — great financial discipline!'
        : 'Spending increased this month. Review your largest categories to find savings.';
    }
    return r;
  }

  // Tips / advice
  if (q.includes('tip') || q.includes('advice') || q.includes('recommend') || q.includes('suggest') || q.includes('improve') || q.includes('help') || q.includes('how can')) {
    let r = `Personalized tips for ${monthName}:\n\n`;
    let tip = 1;
    if (top.length > 0) {
      const [topCat, topAmt] = top[0];
      r += `${tip++}. Your top expense is ${CATEGORY_LABELS[topCat as Category]} ($${topAmt.toFixed(2)}). Look for 15-20% cuts here.\n\n`;
    }
    if (curIncome > 0 && savingsRate < 20) {
      r += `${tip++}. Savings rate is ${savingsRate.toFixed(1)}%. Automate savings on payday — aim for 20%.\n\n`;
    }
    if (overBudget.length > 0) {
      r += `${tip++}. You're over budget on ${overBudget.map(b => CATEGORY_LABELS[b.category as Category]).join(', ')}. Tighten up or adjust those limits.\n\n`;
    }
    if (curBudgets.length === 0) {
      r += `${tip++}. Set monthly budgets by category to avoid overspending.\n\n`;
    }
    r += `${tip}. Build an emergency fund covering 3-6 months of expenses ($${(curExpenses * 3).toFixed(0)}–$${(curExpenses * 6).toFixed(0)}).`;
    return r;
  }

  // Income
  if (q.includes('income') || q.includes('earn') || q.includes('salary')) {
    if (curIncome === 0) {
      return `No income logged for ${monthName}. Add your salary, freelance income, or other earnings in the Transactions tab (set type to "Income") to see your complete financial picture.`;
    }
    return `Income for ${monthName}:\n\n• Total income: $${curIncome.toFixed(2)}\n• Total expenses: $${curExpenses.toFixed(2)} (${((curExpenses / curIncome) * 100).toFixed(0)}% of income)\n• Net balance: ${balance >= 0 ? '+' : ''}$${balance.toFixed(2)}\n• Savings rate: ${savingsRate.toFixed(1)}%`;
  }

  // Category-specific
  const cats: { keywords: string[]; category: Category }[] = [
    { keywords: ['food', 'dining', 'restaurant', 'eating', 'grocery', 'groceries'], category: 'food' },
    { keywords: ['transport', 'commute', 'car', 'uber', 'lyft', 'bus', 'train', 'fuel'], category: 'transport' },
    { keywords: ['entertainment', 'movie', 'streaming', 'subscription', 'netflix', 'fun', 'hobby'], category: 'entertainment' },
    { keywords: ['shopping', 'clothes', 'amazon', 'retail', 'purchase'], category: 'shopping' },
    { keywords: ['utilities', 'electricity', 'water', 'internet', 'phone', 'bill'], category: 'utilities' },
    { keywords: ['healthcare', 'doctor', 'medical', 'pharmacy', 'health', 'gym'], category: 'healthcare' },
    { keywords: ['education', 'course', 'book', 'tuition', 'school', 'learning'], category: 'education' },
  ];

  for (const { keywords, category } of cats) {
    if (keywords.some(k => q.includes(k))) {
      const spent = catSpend[category] || 0;
      const bud = curBudgets.find(b => b.category === category);
      let r = `${CATEGORY_LABELS[category]} spending for ${monthName}: $${spent.toFixed(2)}`;
      if (bud) {
        const pct = ((spent / bud.amount) * 100).toFixed(0);
        r += ` (${pct}% of your $${bud.amount.toFixed(2)} budget)`;
        if (spent > bud.amount) r += ' — over budget!';
      }
      if (spent === 0) r = `No ${CATEGORY_LABELS[category]} expenses logged this month yet.`;
      return r;
    }
  }

  // Default summary
  let r = `${monthName} financial overview:\n\n`;
  if (curIncome > 0) r += `• Income: $${curIncome.toFixed(2)}\n`;
  r += `• Expenses: $${curExpenses.toFixed(2)}\n`;
  if (curIncome > 0) r += `• Savings: $${Math.max(0, balance).toFixed(2)} (${Math.max(0, savingsRate).toFixed(1)}%)\n`;
  r += `• Transactions: ${curTxns.length}\n`;
  r += '\nAsk me about spending breakdowns, budget status, savings tips, or monthly trends!';
  return r;
}
