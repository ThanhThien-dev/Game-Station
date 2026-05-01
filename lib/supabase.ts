// Supabase Client Setup
// To enable: npm install @supabase/supabase-js
// Get keys from: https://app.supabase.com
// Create .env.local with:
//   NEXT_PUBLIC_SUPABASE_URL=your-project-url
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any = null;

export type BookingFormData = {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  gameType: string;
  bookingDate: string;
  bookingTime: string;
  playerCount: number;
  comboId?: string;
  notes?: string;
};