export const formatCurrency = (amount) => `Rp ${Math.round(amount || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
