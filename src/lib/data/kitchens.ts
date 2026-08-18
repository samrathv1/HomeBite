export interface MenuItem {
  name: string;
  description: string;
  items: string[];
  price: number;
  diet: string;
  imageUrl?: string;
}

export interface Kitchen {
  id: string;
  name: string;
  chefName: string;
  distance: number;
  rating: number;
  reviews: number;
  cuisine: string;
  diet: string;
  price: number;
  imageUrl: string;
  chefImageUrl: string;
  story: string;
  verified: boolean;
  hygiene: boolean;
  lat: number;
  lng: number;
  delivery_radius_km: number;
  availability: {
    lunch: boolean;
    dinner: boolean;
    closedToday: boolean;
  };
  capacity: {
    lunch: number;
    dinner: number;
  };
  cutoffs: {
    lunch: string;
    dinner: string;
  };
  todayMenu: {
    lunch?: MenuItem;
    dinner?: MenuItem;
  };
  weeklyMenu: Record<string, { lunch?: MenuItem; dinner?: MenuItem }>;
}

export const kitchens: Kitchen[] = [
  {
    id: "k1",
    name: "Asha's Home Kitchen",
    chefName: "Asha Joshi",
    distance: 0,
    lat: 18.5080,
    lng: 73.8100, // Kothrud
    delivery_radius_km: 4,
    rating: 4.8,
    reviews: 124,
    cuisine: "Maharashtrian",
    diet: "Veg",
    price: 90,
    imageUrl: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=600&auto=format&fit=crop",
    chefImageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    story: "I prepare traditional Maharashtrian meals using recipes from my family kitchen. Cooking brings me joy, and I love sharing fresh, healthy food with students.",
    verified: true,
    hygiene: true,
    availability: { lunch: true, dinner: true, closedToday: false },
    capacity: { lunch: 15, dinner: 8 },
    cutoffs: { lunch: "10:00 AM", dinner: "04:00 PM" },
    todayMenu: {
      lunch: { name: "Traditional Veg Thali", description: "Simple, homely lunch", items: ["3 Chapati", "Bharli Vangi", "Varan", "Jeera Rice", "Koshimbir"], price: 90, diet: "Veg", imageUrl: "https://images.unsplash.com/photo-1546833998-877b37c2e5c4?q=80&w=600&auto=format&fit=crop" },
      dinner: { name: "Light Dinner Combo", description: "Easy to digest dinner", items: ["2 Bhakri", "Pithla", "Rice", "Thecha", "Onion Salad"], price: 100, diet: "Veg", imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop" }
    },
    weeklyMenu: {
      "Monday": { lunch: { name: "Matki Usal Thali", description: "", items: ["3 Chapati", "Matki Usal", "Varan", "Rice"], price: 90, diet: "Veg" }, dinner: { name: "Bhakri & Pithla", description: "", items: ["2 Bhakri", "Pithla", "Rice", "Thecha"], price: 100, diet: "Veg" } },
      "Tuesday": { lunch: { name: "Bharli Vangi Thali", description: "", items: ["3 Chapati", "Bharli Vangi", "Varan", "Jeera Rice"], price: 90, diet: "Veg" }, dinner: { name: "Masale Bhaat", description: "", items: ["Masale Bhaat", "Kadhi", "Papad", "Salad"], price: 100, diet: "Veg" } },
      "Wednesday": { lunch: { name: "Aloo Gobi Thali", description: "", items: ["3 Chapati", "Aloo Gobi", "Varan", "Rice"], price: 90, diet: "Veg" }, dinner: { name: "Bhakri & Zunka", description: "", items: ["2 Bhakri", "Zunka", "Rice", "Thecha"], price: 100, diet: "Veg" } },
      "Thursday": { lunch: { name: "Chana Masala Thali", description: "", items: ["3 Chapati", "Chana Masala", "Varan", "Rice"], price: 90, diet: "Veg" }, dinner: { name: "Khichdi & Kadhi", description: "", items: ["Moong Dal Khichdi", "Kadhi", "Papad", "Pickle"], price: 90, diet: "Veg" } },
      "Friday": { lunch: { name: "Mix Veg Thali", description: "", items: ["3 Chapati", "Mix Veg Sabzi", "Varan", "Rice"], price: 90, diet: "Veg" }, dinner: { name: "Bhakri & Pithla", description: "", items: ["2 Bhakri", "Pithla", "Rice", "Thecha"], price: 100, diet: "Veg" } },
      "Saturday": { lunch: { name: "Puran Poli Special", description: "", items: ["2 Puran Poli", "Katachi Amti", "Rice", "Batata Bhaji"], price: 130, diet: "Veg" }, dinner: { name: "Misal Pav", description: "", items: ["Misal", "2 Pav", "Farsan", "Onion"], price: 90, diet: "Veg" } },
      "Sunday": {}
    }
  },
  {
    id: "k2",
    name: "Maa Ki Rasoi",
    chefName: "Kavita Singh",
    distance: 0,
    lat: 18.5050,
    lng: 73.8050, // Kothrud
    delivery_radius_km: 3,
    rating: 4.6,
    reviews: 89,
    cuisine: "North Indian",
    diet: "Both",
    price: 110,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop",
    chefImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    story: "Serving authentic and rich Punjabi thalis. We use pure ghee and homemade spices to recreate the magic of North India.",
    verified: true,
    hygiene: true,
    availability: { lunch: true, dinner: true, closedToday: false },
    capacity: { lunch: 0, dinner: 12 }, // Sold out demo
    cutoffs: { lunch: "10:30 AM", dinner: "04:30 PM" },
    todayMenu: {
      lunch: { name: "Rajma Chawal Combo", description: "Classic Punjabi comfort", items: ["3 Phulkas", "Rajma", "Jeera Rice", "Aloo Gobi", "Salad"], price: 110, diet: "Veg", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop" },
      dinner: { name: "Paneer & Dal Tadka", description: "Rich dinner thali", items: ["Paneer Masala", "Dal Tadka", "3 Rotis", "Rice"], price: 140, diet: "Veg", imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop" }
    },
    weeklyMenu: {
      "Monday": { lunch: { name: "Rajma Chawal", description: "", items: ["3 Phulkas", "Rajma", "Jeera Rice"], price: 110, diet: "Veg" }, dinner: { name: "Paneer Masala", description: "", items: ["Paneer Masala", "Dal Tadka", "3 Rotis", "Rice"], price: 140, diet: "Veg" } },
      "Tuesday": { lunch: { name: "Kadhi Pakora", description: "", items: ["Kadhi Pakora", "Rice", "2 Rotis", "Aloo Sabzi"], price: 110, diet: "Veg" }, dinner: { name: "Chicken Curry", description: "", items: ["Chicken Curry", "3 Rotis", "Rice", "Salad"], price: 160, diet: "Non-Veg" } },
      "Wednesday": { lunch: { name: "Chole Bhature", description: "", items: ["2 Bhature", "Chole", "Onion Salad", "Pickle"], price: 120, diet: "Veg" }, dinner: { name: "Dal Makhani", description: "", items: ["Dal Makhani", "3 Rotis", "Jeera Rice"], price: 130, diet: "Veg" } },
      "Thursday": { lunch: { name: "Rajma Chawal", description: "", items: ["3 Phulkas", "Rajma", "Jeera Rice"], price: 110, diet: "Veg" }, dinner: { name: "Egg Curry", description: "", items: ["Egg Curry", "3 Rotis", "Rice", "Salad"], price: 130, diet: "Non-Veg" } },
      "Friday": { lunch: { name: "Mix Veg & Dal", description: "", items: ["3 Phulkas", "Mix Veg", "Dal Fry", "Rice"], price: 110, diet: "Veg" }, dinner: { name: "Butter Chicken", description: "", items: ["Butter Chicken", "3 Rotis", "Rice", "Salad"], price: 170, diet: "Non-Veg" } },
      "Saturday": { lunch: { name: "Aloo Paratha", description: "", items: ["2 Aloo Parathas", "Curd", "Pickle", "Butter"], price: 100, diet: "Veg" }, dinner: { name: "Paneer Bhurji", description: "", items: ["Paneer Bhurji", "3 Rotis", "Dal", "Rice"], price: 140, diet: "Veg" } },
      "Sunday": { lunch: { name: "Special Biryani", description: "", items: ["Chicken Biryani", "Raita", "Salad"], price: 180, diet: "Non-Veg" } }
    }
  },
  {
    id: "k3",
    name: "Annapurna Tiffins",
    chefName: "Meena Kulkarni",
    distance: 0,
    lat: 18.5580,
    lng: 73.7850, // Baner
    delivery_radius_km: 5,
    rating: 4.7,
    reviews: 156,
    cuisine: "South Indian",
    diet: "Veg",
    price: 85,
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop",
    chefImageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    story: "Just like your mother's cooking. Pure veg, authentic South Indian meals. No onion, no garlic options available on request.",
    verified: true,
    hygiene: true,
    availability: { lunch: true, dinner: true, closedToday: false },
    capacity: { lunch: 25, dinner: 20 },
    cutoffs: { lunch: "09:30 AM", dinner: "03:30 PM" },
    todayMenu: {
      lunch: { name: "South Indian Meals", description: "Classic fulfilling lunch", items: ["Rice", "Sambar", "Rasam", "Poriyal", "Curd", "Papad"], price: 85, diet: "Veg", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?q=80&w=600&auto=format&fit=crop" },
      dinner: { name: "Dosa Combo", description: "Light and crispy", items: ["2 Masala Dosa", "Sambar", "Coconut Chutney", "Tomato Chutney"], price: 95, diet: "Veg" }
    },
    weeklyMenu: {
      "Monday": { lunch: { name: "South Indian Meals", description: "", items: ["Rice", "Sambar", "Rasam", "Poriyal"], price: 85, diet: "Veg" }, dinner: { name: "Idli & Vada", description: "", items: ["3 Idli", "1 Vada", "Sambar", "Chutney"], price: 80, diet: "Veg" } },
      "Tuesday": { lunch: { name: "Lemon Rice Combo", description: "", items: ["Lemon Rice", "Curd Rice", "Pickle", "Papad"], price: 85, diet: "Veg" }, dinner: { name: "Dosa Combo", description: "", items: ["2 Masala Dosa", "Sambar", "Chutney"], price: 95, diet: "Veg" } },
      "Wednesday": { lunch: { name: "South Indian Meals", description: "", items: ["Rice", "Sambar", "Rasam", "Cabbage Poriyal"], price: 85, diet: "Veg" }, dinner: { name: "Uttapam", description: "", items: ["2 Onion Uttapam", "Sambar", "Chutney"], price: 90, diet: "Veg" } },
      "Thursday": { lunch: { name: "Tamarind Rice Combo", description: "", items: ["Tamarind Rice", "Curd Rice", "Papad"], price: 85, diet: "Veg" }, dinner: { name: "Upma & Kesari", description: "", items: ["Rava Upma", "Kesari Bath", "Chutney"], price: 80, diet: "Veg" } },
      "Friday": { lunch: { name: "South Indian Meals", description: "", items: ["Rice", "Sambar", "Rasam", "Beans Poriyal"], price: 85, diet: "Veg" }, dinner: { name: "Pongal", description: "", items: ["Ven Pongal", "Medu Vada", "Sambar", "Chutney"], price: 90, diet: "Veg" } },
      "Saturday": { lunch: { name: "Bisi Bele Bath", description: "", items: ["Bisi Bele Bath", "Boondi", "Curd Rice"], price: 95, diet: "Veg" }, dinner: { name: "Chapati & Kurma", description: "", items: ["3 Chapati", "Veg Kurma", "Onion Raitha"], price: 90, diet: "Veg" } },
      "Sunday": {}
    }
  },
  {
    id: "k4",
    name: "Patil Home Kitchen",
    chefName: "Sunita Patil",
    distance: 0,
    lat: 18.5680,
    lng: 73.9150, // Viman Nagar
    delivery_radius_km: 4,
    rating: 4.4,
    reviews: 67,
    cuisine: "Maharashtrian",
    diet: "Both",
    price: 100,
    imageUrl: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=600&auto=format&fit=crop",
    chefImageUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&auto=format&fit=crop",
    story: "Specializing in spicy Maharashtrian non-veg and veg thalis. Every meal is made with fresh ingredients sourced daily.",
    verified: true,
    hygiene: false,
    availability: { lunch: true, dinner: true, closedToday: false },
    capacity: { lunch: 10, dinner: 15 },
    cutoffs: { lunch: "11:00 AM", dinner: "05:00 PM" },
    todayMenu: {
      lunch: { name: "Chicken Thali", description: "Spicy and delicious", items: ["2 Bhakri", "Chicken Sukka", "Chicken Rassa", "Rice", "Onion"], price: 150, diet: "Non-Veg", imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop" },
      dinner: { name: "Egg Thali", description: "Comforting egg curry", items: ["3 Chapati", "Anda Curry", "Rice", "Salad"], price: 120, diet: "Non-Veg" }
    },
    weeklyMenu: {
      "Monday": { lunch: { name: "Veg Thali", description: "", items: ["3 Chapati", "Matki Usal", "Amti", "Rice"], price: 100, diet: "Veg" }, dinner: { name: "Egg Curry Thali", description: "", items: ["3 Chapati", "Anda Curry", "Rice"], price: 120, diet: "Non-Veg" } },
      "Tuesday": { lunch: { name: "Veg Thali", description: "", items: ["3 Chapati", "Aloo Sabzi", "Amti", "Rice"], price: 100, diet: "Veg" }, dinner: { name: "Veg Pulao", description: "", items: ["Veg Pulao", "Kadhi", "Papad"], price: 100, diet: "Veg" } },
      "Wednesday": { lunch: { name: "Chicken Thali", description: "", items: ["2 Bhakri", "Chicken Sukka", "Rassa", "Rice"], price: 150, diet: "Non-Veg" }, dinner: { name: "Chicken Biryani", description: "", items: ["Chicken Biryani", "Raita", "Salad"], price: 160, diet: "Non-Veg" } },
      "Thursday": { lunch: { name: "Veg Thali", description: "", items: ["3 Chapati", "Chana Masala", "Amti", "Rice"], price: 100, diet: "Veg" }, dinner: { name: "Masale Bhaat", description: "", items: ["Masale Bhaat", "Kadhi", "Papad"], price: 100, diet: "Veg" } },
      "Friday": { lunch: { name: "Egg Bhurji Thali", description: "", items: ["3 Chapati", "Egg Bhurji", "Amti", "Rice"], price: 110, diet: "Non-Veg" }, dinner: { name: "Chicken Thali", description: "", items: ["2 Bhakri", "Chicken Curry", "Rice"], price: 150, diet: "Non-Veg" } },
      "Saturday": { lunch: { name: "Mutton Thali", description: "", items: ["2 Bhakri", "Mutton Sukka", "Rassa", "Rice"], price: 200, diet: "Non-Veg" }, dinner: { name: "Veg Thali", description: "", items: ["3 Chapati", "Paneer Masala", "Amti", "Rice"], price: 120, diet: "Veg" } },
      "Sunday": { lunch: { name: "Mutton Biryani", description: "", items: ["Mutton Biryani", "Raita", "Salad"], price: 220, diet: "Non-Veg" } }
    }
  },
  {
    id: "k5",
    name: "Healthy Dabba Co.",
    chefName: "Rahul Sharma",
    distance: 0,
    lat: 18.5600,
    lng: 73.7880, // Baner
    delivery_radius_km: 6,
    rating: 4.9,
    reviews: 310,
    cuisine: "Healthy",
    diet: "Both",
    price: 140,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop",
    chefImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    story: "Focusing on high-protein, low-oil meals perfect for fitness enthusiasts. Measured macros in every meal.",
    verified: true,
    hygiene: true,
    availability: { lunch: true, dinner: true, closedToday: false },
    capacity: { lunch: 40, dinner: 40 },
    cutoffs: { lunch: "09:00 AM", dinner: "03:00 PM" },
    todayMenu: {
      lunch: { name: "Grilled Chicken & Brown Rice", description: "45g Protein, Low Carb", items: ["150g Grilled Chicken", "100g Brown Rice", "Dal", "Mixed Veggies", "Salad"], price: 160, diet: "Non-Veg", imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop" },
      dinner: { name: "Paneer & Multigrain Roti", description: "30g Protein, High Fiber", items: ["3 Multigrain Rotis", "Low-oil Paneer Curry", "Stir-fried Veggies", "Curd"], price: 140, diet: "Veg" }
    },
    weeklyMenu: {
      "Monday": { lunch: { name: "Grilled Chicken & Brown Rice", description: "45g Protein", items: ["Grilled Chicken", "Brown Rice", "Dal", "Salad"], price: 160, diet: "Non-Veg" }, dinner: { name: "Paneer & Multigrain Roti", description: "30g Protein", items: ["3 Multigrain Rotis", "Paneer Curry", "Veggies"], price: 140, diet: "Veg" } },
      "Tuesday": { lunch: { name: "Tofu Stir-fry", description: "35g Protein", items: ["Tofu Stir-fry", "Quinoa", "Broccoli", "Clear Soup"], price: 150, diet: "Veg" }, dinner: { name: "Chicken Salad", description: "40g Protein", items: ["Grilled Chicken Salad", "Boiled Eggs", "Soup"], price: 150, diet: "Non-Veg" } },
      "Wednesday": { lunch: { name: "Soya Chunks Curry", description: "40g Protein", items: ["Soya Curry", "Brown Rice", "Dal", "Salad"], price: 130, diet: "Veg" }, dinner: { name: "Grilled Fish", description: "45g Protein", items: ["Grilled Fish", "Mashed Sweet Potato", "Veggies"], price: 180, diet: "Non-Veg" } },
      "Thursday": { lunch: { name: "Chicken & Multigrain Roti", description: "45g Protein", items: ["3 Multigrain Rotis", "Chicken Curry", "Salad"], price: 160, diet: "Non-Veg" }, dinner: { name: "Dal & Quinoa", description: "25g Protein", items: ["Mix Dal", "Quinoa", "Sautéed Greens", "Curd"], price: 140, diet: "Veg" } },
      "Friday": { lunch: { name: "Paneer Tikka Bowl", description: "35g Protein", items: ["Paneer Tikka", "Brown Rice", "Mint Chutney", "Salad"], price: 150, diet: "Veg" }, dinner: { name: "Chicken Stir-fry", description: "40g Protein", items: ["Chicken Stir-fry", "Veggies", "Clear Soup"], price: 150, diet: "Non-Veg" } },
      "Saturday": { lunch: { name: "Egg Curry & Brown Rice", description: "35g Protein", items: ["Egg Curry (3 eggs)", "Brown Rice", "Salad"], price: 140, diet: "Non-Veg" }, dinner: { name: "Oats Chilla", description: "20g Protein", items: ["3 Oats Chilla", "Paneer Bhurji", "Mint Chutney"], price: 130, diet: "Veg" } },
      "Sunday": { lunch: { name: "Cheat Meal: Healthy Biryani", description: "Lower fat", items: ["Chicken/Paneer Biryani", "Cucumber Raita", "Salad"], price: 170, diet: "Both" } }
    }
  },
  {
    id: "k6",
    name: "Ghar Ka Swad",
    chefName: "Bhavna Patel",
    distance: 0,
    lat: 18.5100,
    lng: 73.8120, // Kothrud
    delivery_radius_km: 5,
    rating: 4.8,
    reviews: 145,
    cuisine: "Gujarati",
    diet: "Veg",
    price: 110,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop",
    chefImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    story: "Sweet, spicy, and tangy Gujarati thalis prepared with love and lots of authentic flavors. Perfect for everyday eating.",
    verified: true,
    hygiene: true,
    availability: { lunch: true, dinner: true, closedToday: false },
    capacity: { lunch: 30, dinner: 25 },
    cutoffs: { lunch: "10:30 AM", dinner: "04:30 PM" },
    todayMenu: {
      lunch: { name: "Gujarati Thali", description: "Authentic Gujarati lunch", items: ["4 Rotli", "Gujarati Dal", "Bhindi Shaak", "Rice", "Salad", "Chaas"], price: 110, diet: "Veg", imageUrl: "https://images.unsplash.com/photo-1546833998-877b37c2e5c4?q=80&w=600&auto=format&fit=crop" },
      dinner: { name: "Khichdi Kadhi", description: "Light and comforting", items: ["Masala Khichdi", "Gujarati Kadhi", "Ringan nu Shaak", "Papad"], price: 90, diet: "Veg" }
    },
    weeklyMenu: {
      "Monday": { lunch: { name: "Gujarati Thali", description: "", items: ["4 Rotli", "Gujarati Dal", "Bhindi Shaak", "Rice", "Chaas"], price: 110, diet: "Veg" }, dinner: { name: "Khichdi Kadhi", description: "", items: ["Masala Khichdi", "Gujarati Kadhi", "Papad"], price: 90, diet: "Veg" } },
      "Tuesday": { lunch: { name: "Gujarati Thali", description: "", items: ["4 Rotli", "Toor Dal", "Aloo Shaak", "Rice", "Chaas"], price: 110, diet: "Veg" }, dinner: { name: "Bhakri & Sev Tameta", description: "", items: ["2 Bhakri", "Sev Tameta nu Shaak", "Kadhi"], price: 100, diet: "Veg" } },
      "Wednesday": { lunch: { name: "Gujarati Thali", description: "", items: ["4 Rotli", "Gujarati Dal", "Cabbage Shaak", "Rice", "Chaas"], price: 110, diet: "Veg" }, dinner: { name: "Vaghareli Khichdi", description: "", items: ["Vaghareli Khichdi", "Kadhi", "Papad"], price: 90, diet: "Veg" } },
      "Thursday": { lunch: { name: "Gujarati Thali", description: "", items: ["4 Rotli", "Moong Dal", "Turiya Shaak", "Rice", "Chaas"], price: 110, diet: "Veg" }, dinner: { name: "Thepla & Chundo", description: "", items: ["4 Thepla", "Chundo", "Aloo Shaak", "Curd"], price: 100, diet: "Veg" } },
      "Friday": { lunch: { name: "Gujarati Thali", description: "", items: ["4 Rotli", "Gujarati Dal", "Ringan Batata", "Rice", "Chaas"], price: 110, diet: "Veg" }, dinner: { name: "Dal Dhokli", description: "", items: ["Dal Dhokli", "Rice", "Papad", "Pickle"], price: 110, diet: "Veg" } },
      "Saturday": { lunch: { name: "Farsan Special Thali", description: "", items: ["4 Puri", "Shrikhand", "Khaman", "Aloo Shaak"], price: 140, diet: "Veg" }, dinner: { name: "Pulao & Kadhi", description: "", items: ["Veg Pulao", "Kadhi", "Papad", "Salad"], price: 100, diet: "Veg" } },
      "Sunday": {}
    }
  }
];
