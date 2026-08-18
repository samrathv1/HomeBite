import { createClient } from './supabase/client';
import { Kitchen, MenuItem as AppMenuItem } from './data/kitchens';

const supabase = createClient();

// Haversine formula to calculate distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const distance = R * c; 
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

async function fetchKitchensFromSupabase(): Promise<Kitchen[]> {
  const { data: kitchensData, error: kitchenError } = await supabase.from('kitchens').select('*');
  const { data: menuData, error: menuError } = await supabase.from('menu_items').select('*');
  const { data: weeklyMenuData, error: weeklyMenuError } = await supabase.from('kitchen_weekly_menus').select('*, menu_items(*)');

  if (kitchenError || menuError || weeklyMenuError) {
    console.error("Error fetching data from Supabase", { kitchenError, menuError, weeklyMenuError });
    return [];
  }

  // Transform to app Kitchen interface
  const kitchens: Kitchen[] = kitchensData.map(k => {
    // Determine diet from menu items (if all veg, then 'Veg', else 'Mixed')
    const kMenus = menuData.filter(m => m.kitchen_id === k.id);
    const isPureVeg = kMenus.length > 0 && kMenus.every(m => m.is_veg);
    const minPrice = kMenus.length > 0 ? Math.min(...kMenus.map(m => m.price)) : 100;

    // Build weekly menu
    const weeklyMenuObj: Record<string, { lunch?: AppMenuItem; dinner?: AppMenuItem }> = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // We default fill with empty so UI doesn't crash
    days.forEach(d => {
      weeklyMenuObj[d] = {};
    });

    const kWeekly = weeklyMenuData.filter(wm => wm.kitchen_id === k.id);
    kWeekly.forEach(wm => {
      const dayName = days[wm.day_of_week - 1];
      if (!dayName) return;
      
      const menuItem = wm.menu_items;
      if (!menuItem) return;

      const appMenuItem: AppMenuItem = {
        name: menuItem.name,
        description: menuItem.description,
        items: menuItem.description.split(',').map((i: string) => i.trim()),
        price: menuItem.price,
        diet: menuItem.is_veg ? "Veg" : "Non-Veg",
        imageUrl: k.emoji === '👩🏽‍🍳' ? '🍛' : k.emoji // Fallback img
      };

      if (wm.meal_type === 'Lunch') {
        weeklyMenuObj[dayName].lunch = appMenuItem;
      } else {
        weeklyMenuObj[dayName].dinner = appMenuItem;
      }
    });

    const currentDay = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]; // 0=Sunday, 1=Mon

    return {
      id: k.id,
      name: k.name,
      chefName: k.chef_name,
      distance: 0,
      rating: k.rating || 4.5,
      reviews: 120, // stub
      cuisine: k.cuisine,
      diet: isPureVeg ? "Veg" : "Mixed",
      price: minPrice,
      imageUrl: k.img || '/images/default-kitchen.jpg', // Default images should be added
      chefImageUrl: '/images/default-chef.jpg',
      story: k.bio || '',
      verified: k.is_verified,
      hygiene: true, // stub
      lat: k.lat || 19.1176, // Default fallback
      lng: k.lng || 72.9060,
      delivery_radius_km: k.delivery_radius_km || 5,
      availability: {
        lunch: k.is_open_today,
        dinner: k.is_open_today,
        closedToday: !k.is_open_today
      },
      capacity: {
        lunch: k.lunch_capacity || 30,
        dinner: k.dinner_capacity || 30,
      },
      cutoffs: {
        lunch: '10:30 AM',
        dinner: '5:30 PM'
      },
      todayMenu: weeklyMenuObj[currentDay] || {},
      weeklyMenu: weeklyMenuObj,
    } as Kitchen;
  });

  return kitchens;
}

export async function getKitchens(userLat?: number, userLng?: number): Promise<Kitchen[]> {
  const kitchensList = await fetchKitchensFromSupabase();
  
  if (!userLat || !userLng) return kitchensList.sort((a, b) => b.rating - a.rating);

  return kitchensList.map(k => {
    return { ...k, distance: calculateDistance(userLat, userLng, k.lat, k.lng) };
  }).filter(k => k.distance <= k.delivery_radius_km).sort((a, b) => a.distance - b.distance);
}

export async function getKitchenById(id: string, userLat?: number, userLng?: number): Promise<Kitchen | undefined> {
  const kitchensList = await fetchKitchensFromSupabase();
  const kitchen = kitchensList.find(k => k.id === id);
  
  if (!kitchen || !userLat || !userLng) return kitchen;
  
  const dist = calculateDistance(userLat, userLng, kitchen.lat, kitchen.lng);
  return { ...kitchen, distance: dist };
}

export async function searchKitchens(query: string, filterStr: string = 'All', userLat?: number, userLng?: number): Promise<Kitchen[]> {
  const availableKitchens = await getKitchens(userLat, userLng);

  return availableKitchens.filter(c => {
    // Normalise filter string
    const textFilter = filterStr.replace(/[^a-zA-Z -₹0-9]/g, '').trim();
    
    // Check specific diets
    const isVegOnlyFilter = textFilter === "Pure Veg" || textFilter === "Veg";
    
    let matchesFilter = true;
    if (textFilter !== "All" && textFilter !== "") {
      if (textFilter === "Lunch") matchesFilter = c.availability.lunch && c.capacity.lunch > 0;
      else if (textFilter === "Dinner") matchesFilter = c.availability.dinner && c.capacity.dinner > 0;
      else if (isVegOnlyFilter) matchesFilter = c.diet === "Veg";
      else if (textFilter === "High Protein" || textFilter === "Healthy") matchesFilter = c.cuisine.includes("Healthy");
      else if (textFilter === "Under 120") matchesFilter = c.price <= 120;
      else matchesFilter = c.cuisine?.includes(textFilter) || c.name?.includes(textFilter);
    }
    
    const matchesQuery = query 
      ? (c.name.toLowerCase().includes(query.toLowerCase()) || 
         c.cuisine.toLowerCase().includes(query.toLowerCase()) || 
         c.chefName.toLowerCase().includes(query.toLowerCase()))
      : true;
      
    return matchesFilter && matchesQuery;
  });
}
