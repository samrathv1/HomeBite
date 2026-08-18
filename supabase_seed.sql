-- ==============================================================================
-- HomeBite Realistic Seed Data
-- Run this AFTER supabase_schema.sql and AFTER creating at least one test user.
-- ==============================================================================

INSERT INTO public.kitchens (id, name, chef_name, bio, cuisine, area, delivery_radius_km, lat, lng, rating, is_verified, emoji, img, lunch_capacity, dinner_capacity, is_open_today)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Priya''s Kitchen', 'Priya Sharma', 'Homestyle North Indian meals cooked with cold-pressed oil.', 'North Indian', 'Andheri West', 5.0, 19.1363, 72.8277, 4.8, TRUE, '👩🏽‍🍳', '🍛', 30, 20, TRUE),
  ('22222222-2222-2222-2222-222222222222', 'Asha''s Ghar Ka Khana', 'Asha Patel', 'Authentic Gujarati pure veg food.', 'Gujarati', 'Powai', 5.0, 19.1176, 72.9060, 4.7, TRUE, '👩🏾‍🍳', '🥘', 25, 25, TRUE),
  ('33333333-3333-3333-3333-333333333333', 'Maa''s Kitchen', 'Anjali Deshmukh', 'Traditional Maharashtrian everyday meals.', 'Maharashtrian', 'Vile Parle', 5.0, 19.1001, 72.8437, 4.6, TRUE, '👩🏻‍🍳', '🍱', 40, 40, TRUE),
  ('44444444-4444-4444-4444-444444444444', 'Meera''s South Kitchen', 'Meera Iyer', 'South Indian comfort food and high protein meals.', 'South Indian', 'Bandra', 5.0, 19.0596, 72.8295, 4.9, TRUE, '👩🏽‍🍳', '🍲', 20, 20, TRUE),
  ('55555555-5555-5555-5555-555555555555', 'Fitness Dabba Co.', 'Rahul Verma', 'Macro-counted high protein fitness meals.', 'Healthy', 'Dadar', 5.0, 19.0178, 72.8478, 4.7, TRUE, '👨🏽‍🍳', '🥗', 50, 50, TRUE);

INSERT INTO public.menu_items (id, kitchen_id, name, description, price, is_veg)
VALUES
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Rajma Chawal Thali', 'Authentic Delhi style Rajma with jeera rice and salad.', 120.00, TRUE),
  ('a1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Paneer Butter Masala Combo', 'Paneer butter masala, 3 roti, dal fry, rice.', 150.00, TRUE),
  ('a1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'Chicken Curry Thali', 'Home style chicken curry with 3 chapati and rice.', 180.00, FALSE),
  ('a3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'Pithla Bhakri', 'Traditional pithla, 2 jowar bhakri, thecha.', 110.00, TRUE),
  ('a3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'Bharli Vangi Thali', 'Stuffed brinjal, amti, 3 chapati, rice.', 130.00, TRUE),
  ('a5555555-5555-5555-5555-555555555551', '55555555-5555-5555-5555-555555555555', 'Grilled Chicken Salad', 'High protein chicken breast with veggies.', 199.00, FALSE),
  ('a5555555-5555-5555-5555-555555555552', '55555555-5555-5555-5555-555555555555', 'Paneer Quinoa Bowl', 'Healthy paneer tikka with quinoa and greens.', 189.00, TRUE);

INSERT INTO public.kitchen_weekly_menus (kitchen_id, day_of_week, meal_type, menu_item_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', 1, 'Lunch', 'a1111111-1111-1111-1111-111111111111'),
  ('11111111-1111-1111-1111-111111111111', 1, 'Dinner', 'a1111111-1111-1111-1111-111111111112'),
  ('11111111-1111-1111-1111-111111111111', 2, 'Lunch', 'a1111111-1111-1111-1111-111111111113'),
  ('33333333-3333-3333-3333-333333333333', 1, 'Lunch', 'a3333333-3333-3333-3333-333333333331'),
  ('33333333-3333-3333-3333-333333333333', 1, 'Dinner', 'a3333333-3333-3333-3333-333333333332'),
  ('55555555-5555-5555-5555-555555555555', 1, 'Lunch', 'a5555555-5555-5555-5555-555555555551'),
  ('55555555-5555-5555-5555-555555555555', 1, 'Dinner', 'a5555555-5555-5555-5555-555555555552');
