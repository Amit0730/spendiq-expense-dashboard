import { CategoryType, Expense, UserSettings, BudgetConfig } from '../types/expense';

export const CATEGORIES: CategoryType[] = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Education',
  'Bills',
  'Health',
  'Travel',
  'Other',
];

export interface CategoryMeta {
  name: CategoryType;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  iconName: string;
}

export const CATEGORY_DETAILS: Record<CategoryType, CategoryMeta> = {
  Food: {
    name: 'Food',
    color: '#f97316', // Orange
    bgColor: 'rgba(249, 115, 22, 0.12)',
    textColor: '#ea580c',
    borderColor: 'rgba(249, 115, 22, 0.25)',
    iconName: 'UtensilsCrossed',
  },
  Transport: {
    name: 'Transport',
    color: '#0284c7', // Sky Blue
    bgColor: 'rgba(2, 132, 199, 0.12)',
    textColor: '#0284c7',
    borderColor: 'rgba(2, 132, 199, 0.25)',
    iconName: 'Car',
  },
  Shopping: {
    name: 'Shopping',
    color: '#a855f7', // Purple
    bgColor: 'rgba(168, 85, 247, 0.12)',
    textColor: '#9333ea',
    borderColor: 'rgba(168, 85, 247, 0.25)',
    iconName: 'ShoppingBag',
  },
  Entertainment: {
    name: 'Entertainment',
    color: '#ec4899', // Pink
    bgColor: 'rgba(236, 72, 153, 0.12)',
    textColor: '#db2777',
    borderColor: 'rgba(236, 72, 153, 0.25)',
    iconName: 'Film',
  },
  Education: {
    name: 'Education',
    color: '#6366f1', // Indigo
    bgColor: 'rgba(99, 102, 241, 0.12)',
    textColor: '#4f46e5',
    borderColor: 'rgba(99, 102, 241, 0.25)',
    iconName: 'GraduationCap',
  },
  Bills: {
    name: 'Bills',
    color: '#ef4444', // Red / Rose
    bgColor: 'rgba(239, 68, 68, 0.12)',
    textColor: '#dc2626',
    borderColor: 'rgba(239, 68, 68, 0.25)',
    iconName: 'Receipt',
  },
  Health: {
    name: 'Health',
    color: '#10b981', // Emerald
    bgColor: 'rgba(16, 185, 129, 0.12)',
    textColor: '#059669',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    iconName: 'HeartPulse',
  },
  Travel: {
    name: 'Travel',
    color: '#06b6d4', // Cyan
    bgColor: 'rgba(6, 182, 212, 0.12)',
    textColor: '#0891b2',
    borderColor: 'rgba(6, 182, 212, 0.25)',
    iconName: 'Plane',
  },
  Other: {
    name: 'Other',
    color: '#64748b', // Slate
    bgColor: 'rgba(100, 116, 139, 0.12)',
    textColor: '#475569',
    borderColor: 'rgba(100, 116, 139, 0.25)',
    iconName: 'HelpCircle',
  },
};

export const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD ($)' },
  { code: 'AUD', symbol: 'AU$', label: 'AUD ($)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
];

export const DEFAULT_SETTINGS: UserSettings = {
  currency: 'USD',
  currencySymbol: '$',
  theme: 'dark',
};

export const DEFAULT_BUDGET: BudgetConfig = {
  monthlyLimit: 2800,
  alertThreshold: 80,
};

// Generates dynamic demo expenses relative to today's date so charts are always active and relevant
export const generateDemoExpenses = (): Expense[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const today = now.getDate();

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatDate = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

  // Previous month dates
  const prevMonthDate = new Date(year, month - 1, 15);
  const prevY = prevMonthDate.getFullYear();
  const prevM = prevMonthDate.getMonth();

  const demoList: Omit<Expense, 'id' | 'createdAt'>[] = [
    // Today's expenses
    {
      title: 'Espresso & Avocado Toast',
      amount: 14.50,
      category: 'Food',
      date: formatDate(year, month, today),
      note: 'Morning coffee meeting at Blue Bottle',
    },
    {
      title: 'Uber to Tech Office',
      amount: 22.80,
      category: 'Transport',
      date: formatDate(year, month, today),
      note: 'Express ride downtown',
    },
    // This month (earlier days)
    {
      title: 'Whole Foods Organic Groceries',
      amount: 148.60,
      category: 'Food',
      date: formatDate(year, month, Math.max(1, today - 1)),
      note: 'Weekly essentials and fresh produce',
    },
    {
      title: 'MacBook USB-C Hub & Cable',
      amount: 69.99,
      category: 'Shopping',
      date: formatDate(year, month, Math.max(1, today - 2)),
      note: 'Hardware accessory upgrade for desk setup',
    },
    {
      title: 'High-speed Fiber Internet',
      amount: 79.99,
      category: 'Bills',
      date: formatDate(year, month, Math.max(1, today - 4)),
      note: 'Monthly 1Gbps fiber bill',
    },
    {
      title: 'Dental Hygiene & Fluoride',
      amount: 120.00,
      category: 'Health',
      date: formatDate(year, month, Math.max(1, today - 6)),
      note: 'Semi-annual preventative dental check',
    },
    {
      title: 'Netflix & Spotify Premium',
      amount: 32.98,
      category: 'Entertainment',
      date: formatDate(year, month, Math.max(1, today - 8)),
      note: 'Recurring monthly streaming bundle',
    },
    {
      title: 'Advanced TypeScript Masterclass',
      amount: 89.00,
      category: 'Education',
      date: formatDate(year, month, Math.max(1, today - 10)),
      note: 'Online certificate and engineering labs',
    },
    {
      title: 'Sushi Dinner with Team',
      amount: 86.40,
      category: 'Food',
      date: formatDate(year, month, Math.max(1, today - 12)),
      note: 'Celebratory milestone dinner',
    },
    {
      title: 'Monthly Subway MetroCard',
      amount: 132.00,
      category: 'Transport',
      date: formatDate(year, month, Math.max(1, today - 15)),
      note: 'Unlimited 30-day city transit pass',
    },
    {
      title: 'Electric & Heating Utility',
      amount: 115.30,
      category: 'Bills',
      date: formatDate(year, month, Math.max(1, today - 18)),
      note: 'City Power & Gas invoice',
    },
    {
      title: 'Weekend Mountain Cabin Rental',
      amount: 320.00,
      category: 'Travel',
      date: formatDate(year, month, Math.max(1, today - 20)),
      note: 'Hiking retreat cabin reservation deposit',
    },
    {
      title: 'Running Shoes & Sports Insoles',
      amount: 139.50,
      category: 'Shopping',
      date: formatDate(year, month, Math.max(1, today - 22)),
      note: 'Nike Pegasus marathon gear',
    },
    {
      title: 'Monthly Gym Membership',
      amount: 65.00,
      category: 'Health',
      date: formatDate(year, month, Math.max(1, today - 24)),
      note: 'Equinox fitness club monthly fee',
    },
    {
      title: 'IMAX Cinema Movie Night',
      amount: 44.00,
      category: 'Entertainment',
      date: formatDate(year, month, Math.max(1, today - 26)),
      note: 'Two tickets + popcorn combo',
    },

    // Last month expenses (for comparative charts and analytics)
    {
      title: 'Flight Tickets for Tech Summit',
      amount: 410.00,
      category: 'Travel',
      date: formatDate(prevY, prevM, 24),
      note: 'Roundtrip direct flights',
    },
    {
      title: 'Trader Joe’s Stock Up',
      amount: 175.20,
      category: 'Food',
      date: formatDate(prevY, prevM, 18),
      note: 'Monthly pantry restocking',
    },
    {
      title: 'Apartment Water & Trash Service',
      amount: 65.00,
      category: 'Bills',
      date: formatDate(prevY, prevM, 15),
      note: 'Municipal utility charge',
    },
    {
      title: 'Ergonomic Desk Chair',
      amount: 289.00,
      category: 'Shopping',
      date: formatDate(prevY, prevM, 10),
      note: 'Lumbar support office upgrade',
    },
    {
      title: 'Cloud Architecture Certification Exam',
      amount: 150.00,
      category: 'Education',
      date: formatDate(prevY, prevM, 5),
      note: 'AWS Certified Solutions Architect voucher',
    },
  ];

  return demoList.map((item, idx) => ({
    ...item,
    id: `demo-${idx + 1}-${Date.now().toString(36)}`,
    createdAt: Date.now() - idx * 86400000,
  }));
};
