import { Expense } from '../types/expense';

/**
 * Escapes a CSV field to handle quotes, commas, and newlines safely.
 */
const escapeCSVField = (field: string | number | undefined | null): string => {
  if (field === null || field === undefined) return '""';
  const stringValue = String(field);
  // If field contains quotes, commas, or newlines, wrap in quotes and escape internal quotes
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${stringValue}"`;
};

/**
 * Generates and downloads a CSV file with the required columns:
 * Date, Expense name, Category, Amount, Note
 */
export const exportExpensesToCSV = (expenses: Expense[], _currencySymbol: string = '$'): void => {
  if (!expenses || expenses.length === 0) {
    alert('No expenses available to export.');
    return;
  }

  // Header row
  const headers = ['Date', 'Expense name', 'Category', 'Amount', 'Note'];
  
  // Sort by date descending for clean exported log
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const rows = sortedExpenses.map((exp) => [
    escapeCSVField(exp.date),
    escapeCSVField(exp.title),
    escapeCSVField(exp.category),
    escapeCSVField(exp.amount.toFixed(2)),
    escapeCSVField(exp.note || ''),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\r\n');

  // Create blob with UTF-8 BOM for Microsoft Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const todayStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `spendiq-expenses-${todayStr}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
