export interface Voucher {
  code: string;
  name: string;
  discount: number;
  type: "percent" | "fixed";
  minOrder: number;
  maxDiscount?: number;
  expiry: string;
  usageLimit: number;
  usedCount: number;
}

export const vouchers: Voucher[] = [
  { code: "JOY50K", name: "Giảm 50K cho đơn đầu tiên", discount: 50000, type: "fixed", minOrder: 100000, expiry: "2026-12-31", usageLimit: 1000, usedCount: 234 },
  { code: "WEEKEND10", name: "Giảm 10% cuối tuần", discount: 10, type: "percent", minOrder: 129000, maxDiscount: 100000, expiry: "2026-12-31", usageLimit: 500, usedCount: 89 },
  { code: "STUDENT20", name: "HSSV giảm 20%", discount: 20, type: "percent", minOrder: 129000, maxDiscount: 80000, expiry: "2026-06-30", usageLimit: 2000, usedCount: 567 },
  { code: "VIP100K", name: "Giảm 100K cho VIP", discount: 100000, type: "fixed", minOrder: 249000, expiry: "2026-12-31", usageLimit: 100, usedCount: 45 },
];

export function applyVoucher(code: string, total: number): { discount: number; finalPrice: number } {
  const voucher = vouchers.find((v) => v.code.toUpperCase() === code.toUpperCase());
  if (!voucher) return { discount: 0, finalPrice: total };
  if (total < voucher.minOrder) return { discount: 0, finalPrice: total };
  if (voucher.usedCount >= voucher.usageLimit) return { discount: 0, finalPrice: total };

  let discount = 0;
  if (voucher.type === "fixed") {
    discount = voucher.discount;
  } else {
    discount = Math.round((total * voucher.discount) / 100);
    if (voucher.maxDiscount) discount = Math.min(discount, voucher.maxDiscount);
  }

  return { discount, finalPrice: total - discount };
}