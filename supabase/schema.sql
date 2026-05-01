-- Supabase SQL Schema for Joy Station Booking System
-- Run this in Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Game slots table (available time slots)
CREATE TABLE IF NOT EXISTS game_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_type VARCHAR(50) NOT NULL,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  duration INT DEFAULT 60,
  max_players INT DEFAULT 4,
  current_players INT DEFAULT 0,
  price INT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  guest_name VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(20) NOT NULL,
  guest_email VARCHAR(255),
  game_type VARCHAR(50) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  player_count INT NOT NULL,
  total_price INT NOT NULL,
  combo_id UUID,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Combos table
CREATE TABLE IF NOT EXISTS combos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  items JSONB,
  price INT NOT NULL,
  original_price INT,
  is_active BOOLEAN DEFAULT true,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_game_slots_date ON game_slots(slot_date);
CREATE INDEX idx_bookings_phone ON bookings(guest_phone);

-- Enable RLS (Row Level Security)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow anonymous bookings (guest checkout)
CREATE POLICY "Anyone can create booking" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view public bookings" ON bookings FOR SELECT USING (true);