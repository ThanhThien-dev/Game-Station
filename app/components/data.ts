export const games = [
  {
    id: 1,
    name: "It Takes Two",
    image: "/images/It takes two.jpg",
    players: "2",
    category: "Co-op",
    price: 70000,
    link: "https://www.youtube.com/watch?v=cITdMfwJnQs"
  },
  {
    id: 2,
    name: "Rabbids Party of Legends",
    image: "/images/Rabbids party of legends.jpg",
    players: "2-4",
    category: "Party",
    price: 55000,
    link: "https://www.youtube.com/watch?v=UtBEOXg1pDQ"
  },
  {
    id: 3,
    name: "Overcooked",
    image: "/images/Overcooked.jpg",
    players: "2-4",
    category: "Simulation",
    price: 60000,
    link: "https://www.youtube.com/shorts/fCqzFopx9es"
  },
  {
    id: 4,
    name: "Boomerang Fu",
    image: "/images/Boomerang fu.jpg",
    players: "1-4",
    category: "Fighting",
    price: 50000,
    link: "https://www.youtube.com/shorts/Hs3bkUuUoP0"
  },
];

export const combos = [
  {
    id: 1,
    name: "Nintendo Switch",
    items: ["Chơi 2 tặng 1", "Snack Combo", "Bốc thăm trúng quà"],
    originalPrice: 180000,
    price: 129000,
    popular: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Xbox 360",
    items: ["Chơi 2h tặng giờ đầu", "Oder 39k trở lên", "16H - 23H", "Gift"],
    originalPrice: 320000,
    price: 249000,
    popular: false,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Playstation PS4",
    items: ["Free Boardgame", "Free 30p cho nhóm 3", "Free 3 lượt gắp gấu", "Blind Box"],
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
    name: "Gà sốt cay",
    description: "Crispy chicken wings with special sauce",
    price: 45000,
    image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Burger",
    description: "Double patty with cheese and bacon",
    price: 65000,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Khoai tây chiên",
    description: "Large fries with cheese sauce",
    price: 35000,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Cream Chocolate",
    description: "Chocolate milkshake with whipped cream",
    price: 40000,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop",
  },
];

export const reviews = [
  {
    id: 1,
    name: "Quý Phạm",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Joy Station đúng kiểu thiên đường giải trí mini giữa lòng thành phố, bước vô là thấy nguyên một vibe ấm cúng, sạch sẽ, decor xinh xắn. Boardgame thì nhiều vô kể, từ mấy game nhẹ nhàng cho cặp đôi tới mấy game hại não dễ toang tình bạn. Bộ nào cũng mới, đầy đủ phụ kiện, nhân viên còn nhiệt tình chỉ luật cho mấy đứa gà mờ.",
    game: "Cyber Drift",
  },
  {
    id: 2,
    name: "Luân Niên",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Không gian rộng rãi, sạch sẽ, có nhân viên luôn hỗ trợ kịp thời. Nếu bạn lần đầu chơi thì vẫn đc hướng dẫn nhiệt tình nha.",
    game: "It takes two",
  },
  {
    id: 3,
    name: "Tee",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    comment: "Chơi ở đây oke, giá chơi với nước ổn, ngoài ps5 với nintendo thì có boardgame nữa, mỗi tội lâu lâu đang chơi hay bị tắt màn hình nên phải kêu nv mở lại mấy lần, còn lại oke",
    game: "Overcooked",
  },
];

export const location = {
  address: "64/10 Võ Oanh, Phường 25, Thạnh Mỹ Tây, Hồ Chí Minh",
  phone: "08 998 64647",
  email: "joystation2024@gmail.com",
  hours: "09:00 - 23:00",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0848340495804!2d106.71294397451756!3d10.804814458670528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175290015fa2487%3A0x9dc3e7ebce94d8e8!2sJoy%20Station!5e0!3m2!1svi!2s!4v1777455790094!5m2!1svi!2s",
};