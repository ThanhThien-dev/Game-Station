export const games = [
  {
    id: 1,
    name: "Cyber Drift",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
    players: "2-4",
    category: "Racing",
    price: 50000,
  },
  {
    id: 2,
    name: "Neon Arena",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    players: "4-8",
    category: "FPS",
    price: 60000,
  },
  {
    id: 3,
    name: "Void Runner",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
    players: "1",
    category: "Arcade",
    price: 30000,
  },
  {
    id: 4,
    name: "Star Command",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop",
    players: "2-6",
    category: "Strategy",
    price: 45000,
  },
];

export const combos = [
  {
    id: 1,
    name: "Full Gaming Setup",
    items: ["2 Hours Play", "Snack Combo", "Drink"],
    originalPrice: 180000,
    price: 129000,
    popular: true,
    image: "https://images.unsplash.com/photo-1511882150382-421056c85733?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Tournament Pack",
    items: ["4 Hours Play", "Food Plate", "2 Drinks", "Gift"],
    originalPrice: 320000,
    price: 249000,
    popular: false,
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf50?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "VIP Experience",
    items: ["All Day Pass", "Premium Food", "Unlimited Drinks", "Swag"],
    originalPrice: 550000,
    price: 399000,
    popular: false,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  },
];

export const promotions = [
  {
    id: 1,
    title: "Weekend Special",
    description: "50% off on all racing games every Saturday & Sunday",
    discount: "50%",
    validUntil: "Every Weekend",
    color: "neon-cyan",
  },
  {
    id: 2,
    title: "Student Discount",
    description: "Show your student ID and get 20% off any game",
    discount: "20%",
    validUntil: "Valid ID Required",
    color: "neon-pink",
  },
  {
    id: 3,
    title: "Birthday Bash",
    description: "Free game on your birthday! Valid ID needed.",
    discount: "FREE",
    validUntil: "Your Birthday",
    color: "neon-yellow",
  },
];

export const foods = [
  {
    id: 1,
    name: "Neon Bites",
    description: "Crispy chicken wings with special sauce",
    price: 45000,
    image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Pixel Burger",
    description: "Double patty with cheese and bacon",
    price: 65000,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Cyber Fries",
    description: "Large fries with cheese sauce",
    price: 35000,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Power Shake",
    description: "Chocolate milkshake with whipped cream",
    price: 40000,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop",
  },
];

export const reviews = [
  {
    id: 1,
    name: "Khoa Nguyen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Best gaming center ever! Great equipment and amazing vibes.",
    game: "Cyber Drift",
  },
  {
    id: 2,
    name: "Minh Pham",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc4a43e09?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Love the neon aesthetic. Staff is super helpful!",
    game: "Neon Arena",
  },
  {
    id: 3,
    name: "Tu Le",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    comment: "Great food and awesome combo deals. Will come back!",
    game: "Void Runner",
  },
];

export const location = {
  address: "123 Gaming Street, District 1, Ho Chi Minh City",
  phone: "1900 636 648",
  email: "info@gamecenter.vn",
  hours: "10:00 - 24:00",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.509992233818!2d106.68829711478638!3d10.77223239231945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f2111111111%3A0x1!2zMTIzIELDo8OqIFRyaeG4gU8OieSwgS2h1IFTpbmgsIEhvIENoaS1NaW5oIENpdHksIFZpdG5hbQ!5e0!3m2!1sen!2s!4v1609459200000",
};