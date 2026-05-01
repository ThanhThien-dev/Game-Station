export interface LoyaltyPoints {
  userId: string;
  points: number;
  history: {
    id: string;
    type: "earn" | "redeem";
    points: number;
    description: string;
    date: string;
  }[];
}

export const POINTS_PER_10K = 10;
export const REDEEM_RATE = 100;
export const MIN_REDEEM = 500;

export function getPoints(userId: string): LoyaltyPoints {
  const saved = localStorage.getItem(`loyalty-${userId}`);
  if (saved) return JSON.parse(saved);
  return { userId, points: 0, history: [] };
}

export function savePoints(data: LoyaltyPoints) {
  localStorage.setItem(`loyalty-${data.userId}`, JSON.stringify(data));
}

export function earnPoints(userId: string, amount: number, bookingId: string): LoyaltyPoints {
  const data = getPoints(userId);
  const earned = Math.floor(amount / 10_000) * POINTS_PER_10K;
  data.points += earned;
  data.history.unshift({
    id: `earn-${Date.now()}`,
    type: "earn",
    points: earned,
    description: `Đặt lịch ${bookingId}`,
    date: new Date().toISOString(),
  });
  savePoints(data);
  return data;
}

export function redeemPoints(userId: string, points: number): LoyaltyPoints {
  const data = getPoints(userId);
  if (points < MIN_REDEEM) throw new Error(`Tối thiểu ${MIN_REDEEM} điểm để đổi`);
  if (points > data.points) throw new Error("Không đủ điểm");
  data.points -= points;
  data.history.unshift({
    id: `redeem-${Date.now()}`,
    type: "redeem",
    points: -points,
    description: `Đổi ${points} điểm thành voucher`,
    date: new Date().toISOString(),
  });
  savePoints(data);
  return data;
}

export function pointsToDiscount(points: number): number {
  return Math.floor(points / REDEEM_RATE) * 1000;
}