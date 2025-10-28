export function formatThaiBaht(amount: string | number): string {
  const num = typeof amount === 'string' ? Number(amount) : amount;

  if (isNaN(num)) return '฿0';

  return new Intl.NumberFormat('th-TH',
    {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
}
