export interface SeedFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  serving_size: number;
  serving_unit: string;
  category?: string;
}

export const SEED_FOODS: SeedFood[] = [
  // ─── FRUITS ───────────────────────────────────────────────────────────────
  { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, sodium: 2, serving_size: 182, serving_unit: '1 medium', category: 'fruits' },
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10, sodium: 1, serving_size: 100, serving_unit: '100g', category: 'fruits' },
  { name: 'Apple', calories: 57, protein: 0.3, carbs: 15, fat: 0.2, fiber: 2.6, sugar: 11, sodium: 1, serving_size: 109, serving_unit: '1 cup sliced', category: 'fruits' },

  { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, sodium: 1, serving_size: 118, serving_unit: '1 medium', category: 'fruits' },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12, sodium: 1, serving_size: 100, serving_unit: '100g', category: 'fruits' },

  { name: 'Orange', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12, sodium: 0, serving_size: 131, serving_unit: '1 medium', category: 'fruits' },
  { name: 'Orange', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sugar: 9, sodium: 0, serving_size: 100, serving_unit: '100g', category: 'fruits' },

  { name: 'Grapes', calories: 104, protein: 1.1, carbs: 27, fat: 0.2, fiber: 1.4, sugar: 23, sodium: 3, serving_size: 151, serving_unit: '1 cup', category: 'fruits' },
  { name: 'Grapes', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, sugar: 15, sodium: 2, serving_size: 100, serving_unit: '100g', category: 'fruits' },

  { name: 'Strawberries', calories: 49, protein: 1.0, carbs: 12, fat: 0.5, fiber: 3.0, sugar: 7, sodium: 1, serving_size: 152, serving_unit: '1 cup', category: 'fruits' },
  { name: 'Strawberries', calories: 32, protein: 0.7, carbs: 8, fat: 0.3, fiber: 2.0, sugar: 5, sodium: 1, serving_size: 100, serving_unit: '100g', category: 'fruits' },

  { name: 'Blueberries', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, sugar: 15, sodium: 1, serving_size: 148, serving_unit: '1 cup', category: 'fruits' },
  { name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, sugar: 10, sodium: 1, serving_size: 100, serving_unit: '100g', category: 'fruits' },

  { name: 'Mango', calories: 201, protein: 2.8, carbs: 50, fat: 1.3, fiber: 5.4, sugar: 45, sodium: 3, serving_size: 336, serving_unit: '1 whole', category: 'fruits' },
  { name: 'Mango', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sugar: 14, sodium: 1, serving_size: 100, serving_unit: '100g', category: 'fruits' },

  { name: 'Pineapple', calories: 82, protein: 0.9, carbs: 22, fat: 0.2, fiber: 2.3, sugar: 16, sodium: 2, serving_size: 165, serving_unit: '1 cup chunks', category: 'fruits' },
  { name: 'Watermelon', calories: 86, protein: 1.7, carbs: 22, fat: 0.4, fiber: 1.1, sugar: 18, sodium: 3, serving_size: 280, serving_unit: '2 cups diced', category: 'fruits' },
  { name: 'Peach', calories: 59, protein: 1.4, carbs: 14, fat: 0.4, fiber: 2.3, sugar: 13, sodium: 0, serving_size: 150, serving_unit: '1 medium', category: 'fruits' },
  { name: 'Pear', calories: 101, protein: 0.6, carbs: 27, fat: 0.2, fiber: 5.5, sugar: 17, sodium: 2, serving_size: 178, serving_unit: '1 medium', category: 'fruits' },
  { name: 'Kiwi', calories: 42, protein: 0.8, carbs: 10, fat: 0.4, fiber: 2.1, sugar: 6, sodium: 2, serving_size: 69, serving_unit: '1 medium', category: 'fruits' },
  { name: 'Cherries', calories: 87, protein: 1.5, carbs: 22, fat: 0.3, fiber: 2.9, sugar: 18, sodium: 0, serving_size: 138, serving_unit: '1 cup', category: 'fruits' },
  { name: 'Raspberries', calories: 64, protein: 1.5, carbs: 15, fat: 0.8, fiber: 8.0, sugar: 5, sodium: 1, serving_size: 123, serving_unit: '1 cup', category: 'fruits' },
  { name: 'Avocado', calories: 234, protein: 2.9, carbs: 12, fat: 21, fiber: 9.8, sugar: 1, sodium: 10, serving_size: 150, serving_unit: '1 medium', category: 'fruits' },
  { name: 'Avocado', calories: 160, protein: 2.0, carbs: 9, fat: 15, fiber: 6.7, sugar: 1, sodium: 7, serving_size: 100, serving_unit: '100g', category: 'fruits' },

  // ─── VEGETABLES ───────────────────────────────────────────────────────────
  { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, sugar: 2.6, sodium: 64, serving_size: 182, serving_unit: '1 cup chopped', category: 'vegetables' },
  { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33, serving_size: 100, serving_unit: '100g', category: 'vegetables' },

  { name: 'Spinach', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, sugar: 0.1, sodium: 24, serving_size: 30, serving_unit: '1 cup raw', category: 'vegetables' },
  { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79, serving_size: 100, serving_unit: '100g', category: 'vegetables' },

  { name: 'Carrot', calories: 25, protein: 0.6, carbs: 6, fat: 0.1, fiber: 1.7, sugar: 2.9, sodium: 42, serving_size: 61, serving_unit: '1 medium', category: 'vegetables' },
  { name: 'Carrot', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, sugar: 4.7, sodium: 69, serving_size: 100, serving_unit: '100g', category: 'vegetables' },

  { name: 'Potato', calories: 161, protein: 4.3, carbs: 37, fat: 0.2, fiber: 3.8, sugar: 1.7, sodium: 17, serving_size: 213, serving_unit: '1 medium baked', category: 'vegetables' },
  { name: 'Potato', calories: 77, protein: 2.0, carbs: 17, fat: 0.1, fiber: 2.2, sugar: 0.8, sodium: 6, serving_size: 100, serving_unit: '100g', category: 'vegetables' },

  { name: 'Sweet Potato', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.8, sugar: 7.4, sodium: 41, serving_size: 130, serving_unit: '1 medium baked', category: 'vegetables' },
  { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3.0, sugar: 4.2, sodium: 55, serving_size: 100, serving_unit: '100g', category: 'vegetables' },

  { name: 'Tomato', calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5, sugar: 3.2, sodium: 6, serving_size: 123, serving_unit: '1 medium', category: 'vegetables' },
  { name: 'Cucumber', calories: 16, protein: 0.7, carbs: 3.8, fat: 0.1, fiber: 0.5, sugar: 1.7, sodium: 2, serving_size: 119, serving_unit: '1 cup sliced', category: 'vegetables' },
  { name: 'Bell Pepper', calories: 31, protein: 1.0, carbs: 6, fat: 0.3, fiber: 2.1, sugar: 4.2, sodium: 4, serving_size: 119, serving_unit: '1 medium', category: 'vegetables' },
  { name: 'Onion', calories: 44, protein: 1.2, carbs: 10, fat: 0.1, fiber: 1.9, sugar: 4.7, sodium: 4, serving_size: 110, serving_unit: '1 medium', category: 'vegetables' },
  { name: 'Garlic', calories: 4, protein: 0.2, carbs: 1.0, fat: 0.0, fiber: 0.1, sugar: 0.0, sodium: 1, serving_size: 3, serving_unit: '1 clove', category: 'vegetables' },
  { name: 'Lettuce (Romaine)', calories: 8, protein: 0.6, carbs: 1.5, fat: 0.1, fiber: 1.0, sugar: 0.6, sodium: 4, serving_size: 47, serving_unit: '1 cup shredded', category: 'vegetables' },
  { name: 'Kale', calories: 33, protein: 2.9, carbs: 6, fat: 0.5, fiber: 1.3, sugar: 1.6, sodium: 29, serving_size: 67, serving_unit: '1 cup chopped', category: 'vegetables' },
  { name: 'Zucchini', calories: 21, protein: 1.5, carbs: 3.9, fat: 0.4, fiber: 1.2, sugar: 3.1, sodium: 10, serving_size: 124, serving_unit: '1 cup sliced', category: 'vegetables' },
  { name: 'Corn', calories: 132, protein: 4.9, carbs: 29, fat: 1.8, fiber: 3.6, sugar: 5, sodium: 15, serving_size: 154, serving_unit: '1 cup kernels', category: 'vegetables' },
  { name: 'Peas', calories: 118, protein: 7.9, carbs: 21, fat: 0.6, fiber: 7.4, sugar: 8, sodium: 7, serving_size: 160, serving_unit: '1 cup', category: 'vegetables' },
  { name: 'Green Beans', calories: 31, protein: 1.8, carbs: 7.1, fat: 0.2, fiber: 2.7, sugar: 3.3, sodium: 1, serving_size: 110, serving_unit: '1 cup raw', category: 'vegetables' },
  { name: 'Mushrooms', calories: 15, protein: 2.2, carbs: 2.3, fat: 0.2, fiber: 0.7, sugar: 1.4, sodium: 3, serving_size: 70, serving_unit: '1 cup sliced', category: 'vegetables' },
  { name: 'Celery', calories: 6, protein: 0.3, carbs: 1.2, fat: 0.1, fiber: 0.6, sugar: 0.5, sodium: 32, serving_size: 40, serving_unit: '1 stalk', category: 'vegetables' },
  { name: 'Cauliflower', calories: 27, protein: 2.1, carbs: 5.3, fat: 0.3, fiber: 2.5, sugar: 2.4, sodium: 32, serving_size: 107, serving_unit: '1 cup chopped', category: 'vegetables' },
  { name: 'Asparagus', calories: 27, protein: 2.9, carbs: 5.2, fat: 0.2, fiber: 2.8, sugar: 2.5, sodium: 2, serving_size: 134, serving_unit: '1 cup', category: 'vegetables' },

  // ─── PROTEINS / MEATS ─────────────────────────────────────────────────────
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, serving_size: 100, serving_unit: '100g cooked', category: 'proteins' },
  { name: 'Chicken Breast', calories: 284, protein: 53, carbs: 0, fat: 6.2, fiber: 0, sugar: 0, sodium: 127, serving_size: 172, serving_unit: '1 breast cooked', category: 'proteins' },

  { name: 'Chicken Thigh', calories: 209, protein: 26, carbs: 0, fat: 11, fiber: 0, sugar: 0, sodium: 88, serving_size: 100, serving_unit: '100g cooked', category: 'proteins' },

  { name: 'Ground Beef 80/20', calories: 254, protein: 24, carbs: 0, fat: 17, fiber: 0, sugar: 0, sodium: 94, serving_size: 100, serving_unit: '100g cooked', category: 'proteins' },
  { name: 'Ground Beef 93/7', calories: 218, protein: 27, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 94, serving_size: 100, serving_unit: '100g cooked', category: 'proteins' },

  { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, sodium: 59, serving_size: 100, serving_unit: '100g cooked', category: 'proteins' },
  { name: 'Salmon', calories: 367, protein: 35, carbs: 0, fat: 23, fiber: 0, sugar: 0, sodium: 103, serving_size: 176, serving_unit: '1 fillet', category: 'proteins' },

  { name: 'Tuna (Canned in Water)', calories: 109, protein: 25, carbs: 0, fat: 0.5, fiber: 0, sugar: 0, sodium: 300, serving_size: 113, serving_unit: '1 can drained', category: 'proteins' },
  { name: 'Tilapia', calories: 128, protein: 26, carbs: 0, fat: 2.7, fiber: 0, sugar: 0, sodium: 56, serving_size: 100, serving_unit: '100g cooked', category: 'proteins' },
  { name: 'Shrimp', calories: 99, protein: 24, carbs: 0.3, fat: 0.3, fiber: 0, sugar: 0, sodium: 111, serving_size: 100, serving_unit: '100g cooked', category: 'proteins' },

  { name: 'Eggs', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, sugar: 0.6, sodium: 62, serving_size: 50, serving_unit: '1 large', category: 'proteins' },
  { name: 'Egg Whites', calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, fiber: 0, sugar: 0.2, sodium: 55, serving_size: 33, serving_unit: '1 large white', category: 'proteins' },

  { name: 'Turkey Breast', calories: 135, protein: 30, carbs: 0, fat: 1.0, fiber: 0, sugar: 0, sodium: 70, serving_size: 100, serving_unit: '100g cooked', category: 'proteins' },
  { name: 'Pork Tenderloin', calories: 143, protein: 26, carbs: 0, fat: 3.5, fiber: 0, sugar: 0, sodium: 58, serving_size: 100, serving_unit: '100g cooked', category: 'proteins' },
  { name: 'Bacon', calories: 161, protein: 12, carbs: 0.1, fat: 12, fiber: 0, sugar: 0, sodium: 573, serving_size: 34, serving_unit: '2 slices cooked', category: 'proteins' },
  { name: 'Ham', calories: 109, protein: 17, carbs: 1.5, fat: 4.0, fiber: 0, sugar: 1.2, sodium: 1117, serving_size: 100, serving_unit: '100g', category: 'proteins' },
  { name: 'Beef Steak Sirloin', calories: 207, protein: 26, carbs: 0, fat: 11, fiber: 0, sugar: 0, sodium: 56, serving_size: 100, serving_unit: '100g cooked', category: 'proteins' },
  { name: 'Lamb Chop', calories: 294, protein: 25, carbs: 0, fat: 21, fiber: 0, sugar: 0, sodium: 72, serving_size: 100, serving_unit: '100g cooked', category: 'proteins' },
  { name: 'Sardines (Canned in Oil)', calories: 191, protein: 23, carbs: 0, fat: 11, fiber: 0, sugar: 0, sodium: 414, serving_size: 92, serving_unit: '1 can', category: 'proteins' },

  // ─── DAIRY ────────────────────────────────────────────────────────────────
  { name: 'Whole Milk', calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0, sugar: 12, sodium: 105, serving_size: 244, serving_unit: '1 cup', category: 'dairy' },
  { name: '2% Milk', calories: 122, protein: 8, carbs: 12, fat: 4.8, fiber: 0, sugar: 12, sodium: 100, serving_size: 244, serving_unit: '1 cup', category: 'dairy' },
  { name: 'Skim Milk', calories: 83, protein: 8.3, carbs: 12, fat: 0.2, fiber: 0, sugar: 12, sodium: 103, serving_size: 244, serving_unit: '1 cup', category: 'dairy' },

  { name: 'Greek Yogurt Plain', calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0, sugar: 6, sodium: 65, serving_size: 170, serving_unit: '1 container (6 oz)', category: 'dairy' },
  { name: 'Greek Yogurt Flavored', calories: 150, protein: 12, carbs: 20, fat: 2.5, fiber: 0, sugar: 17, sodium: 75, serving_size: 170, serving_unit: '1 container (6 oz)', category: 'dairy' },
  { name: 'Regular Yogurt', calories: 149, protein: 8.5, carbs: 17, fat: 8, fiber: 0, sugar: 17, sodium: 113, serving_size: 227, serving_unit: '1 cup', category: 'dairy' },

  { name: 'Cheddar Cheese', calories: 113, protein: 7, carbs: 0.4, fat: 9.3, fiber: 0, sugar: 0.1, sodium: 174, serving_size: 28, serving_unit: '1 oz', category: 'dairy' },
  { name: 'Mozzarella Cheese', calories: 85, protein: 6.3, carbs: 0.6, fat: 6.3, fiber: 0, sugar: 0.3, sodium: 138, serving_size: 28, serving_unit: '1 oz', category: 'dairy' },
  { name: 'Cottage Cheese', calories: 206, protein: 25, carbs: 8.2, fat: 9, fiber: 0, sugar: 6.5, sodium: 918, serving_size: 226, serving_unit: '1 cup', category: 'dairy' },
  { name: 'Cream Cheese', calories: 99, protein: 1.7, carbs: 1.2, fat: 9.8, fiber: 0, sugar: 0.9, sodium: 92, serving_size: 28, serving_unit: '2 tbsp (1 oz)', category: 'dairy' },
  { name: 'Butter', calories: 102, protein: 0.1, carbs: 0.0, fat: 11.5, fiber: 0, sugar: 0.0, sodium: 82, serving_size: 14, serving_unit: '1 tbsp', category: 'dairy' },
  { name: 'Heavy Cream', calories: 52, protein: 0.3, carbs: 0.4, fat: 5.6, fiber: 0, sugar: 0.4, sodium: 6, serving_size: 15, serving_unit: '1 tbsp', category: 'dairy' },
  { name: 'Sour Cream', calories: 60, protein: 0.7, carbs: 1.2, fat: 5.8, fiber: 0, sugar: 1.2, sodium: 16, serving_size: 32, serving_unit: '2 tbsp', category: 'dairy' },
  { name: 'American Cheese', calories: 104, protein: 5, carbs: 1.3, fat: 8.9, fiber: 0, sugar: 1.3, sodium: 406, serving_size: 28, serving_unit: '1 slice (1 oz)', category: 'dairy' },
  { name: 'Parmesan Cheese', calories: 111, protein: 10, carbs: 0.9, fat: 7.3, fiber: 0, sugar: 0.2, sodium: 449, serving_size: 28, serving_unit: '1 oz', category: 'dairy' },

  // ─── GRAINS / BREAD ───────────────────────────────────────────────────────
  { name: 'White Bread', calories: 79, protein: 2.7, carbs: 15, fat: 1.0, fiber: 0.6, sugar: 1.4, sodium: 142, serving_size: 30, serving_unit: '1 slice', category: 'grains' },
  { name: 'Whole Wheat Bread', calories: 81, protein: 4.0, carbs: 14, fat: 1.1, fiber: 1.9, sugar: 1.4, sodium: 146, serving_size: 30, serving_unit: '1 slice', category: 'grains' },

  { name: 'White Rice', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, sugar: 0.1, sodium: 2, serving_size: 186, serving_unit: '1 cup cooked', category: 'grains' },
  { name: 'Brown Rice', calories: 216, protein: 5.0, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.7, sodium: 10, serving_size: 195, serving_unit: '1 cup cooked', category: 'grains' },

  { name: 'Oatmeal', calories: 166, protein: 5.9, carbs: 28, fat: 3.6, fiber: 4.0, sugar: 0.6, sodium: 9, serving_size: 234, serving_unit: '1 cup cooked', category: 'grains' },
  { name: 'Pasta (White)', calories: 220, protein: 8.1, carbs: 43, fat: 1.3, fiber: 2.5, sugar: 0.6, sodium: 1, serving_size: 140, serving_unit: '1 cup cooked', category: 'grains' },
  { name: 'Whole Wheat Pasta', calories: 174, protein: 7.5, carbs: 37, fat: 0.8, fiber: 4.0, sugar: 1.1, sodium: 4, serving_size: 140, serving_unit: '1 cup cooked', category: 'grains' },

  { name: 'Quinoa', calories: 222, protein: 8.1, carbs: 39, fat: 3.6, fiber: 5.2, sugar: 1.6, sodium: 13, serving_size: 185, serving_unit: '1 cup cooked', category: 'grains' },
  { name: 'Bagel', calories: 270, protein: 11, carbs: 53, fat: 1.6, fiber: 2.3, sugar: 6, sodium: 430, serving_size: 105, serving_unit: '1 plain bagel', category: 'grains' },
  { name: 'English Muffin', calories: 134, protein: 4.4, carbs: 26, fat: 1.0, fiber: 1.5, sugar: 2.4, sodium: 265, serving_size: 57, serving_unit: '1 muffin', category: 'grains' },
  { name: 'Flour Tortilla', calories: 146, protein: 3.9, carbs: 25, fat: 3.5, fiber: 1.6, sugar: 1.5, sodium: 324, serving_size: 45, serving_unit: '1 medium (8 inch)', category: 'grains' },
  { name: 'Corn Tortilla', calories: 58, protein: 1.5, carbs: 12, fat: 0.7, fiber: 1.4, sugar: 0.3, sodium: 11, serving_size: 26, serving_unit: '1 small tortilla', category: 'grains' },
  { name: 'Crackers (Wheat)', calories: 71, protein: 1.4, carbs: 11, fat: 2.5, fiber: 0.9, sugar: 0.2, sodium: 135, serving_size: 16, serving_unit: '4 crackers', category: 'grains' },
  { name: 'Granola', calories: 471, protein: 14, carbs: 64, fat: 21, fiber: 6.6, sugar: 21, sodium: 14, serving_size: 122, serving_unit: '1 cup', category: 'grains' },
  { name: 'Corn Flakes', calories: 101, protein: 1.9, carbs: 24, fat: 0.2, fiber: 1.0, sugar: 2.4, sodium: 203, serving_size: 28, serving_unit: '1 cup', category: 'grains' },
  { name: 'Rolled Oats (Dry)', calories: 307, protein: 11, carbs: 55, fat: 5, fiber: 8.2, sugar: 1.1, sodium: 5, serving_size: 81, serving_unit: '1 cup dry', category: 'grains' },

  // ─── LEGUMES ──────────────────────────────────────────────────────────────
  { name: 'Black Beans', calories: 227, protein: 15, carbs: 41, fat: 0.9, fiber: 15, sugar: 0.6, sodium: 2, serving_size: 172, serving_unit: '1 cup cooked', category: 'legumes' },
  { name: 'Kidney Beans', calories: 225, protein: 15, carbs: 40, fat: 0.9, fiber: 13, sugar: 0.6, sodium: 4, serving_size: 177, serving_unit: '1 cup cooked', category: 'legumes' },
  { name: 'Chickpeas', calories: 269, protein: 15, carbs: 45, fat: 4.2, fiber: 12, sugar: 7.9, sodium: 11, serving_size: 164, serving_unit: '1 cup cooked', category: 'legumes' },
  { name: 'Lentils', calories: 230, protein: 18, carbs: 40, fat: 0.8, fiber: 16, sugar: 3.6, sodium: 4, serving_size: 198, serving_unit: '1 cup cooked', category: 'legumes' },
  { name: 'Edamame', calories: 189, protein: 17, carbs: 15, fat: 8, fiber: 8, sugar: 3.4, sodium: 9, serving_size: 155, serving_unit: '1 cup shelled', category: 'legumes' },
  { name: 'Peanut Butter', calories: 188, protein: 8, carbs: 6.9, fat: 16, fiber: 1.9, sugar: 3.4, sodium: 147, serving_size: 32, serving_unit: '2 tbsp', category: 'legumes' },
  { name: 'Hummus', calories: 177, protein: 5, carbs: 20, fat: 8, fiber: 5.9, sugar: 3.8, sodium: 568, serving_size: 123, serving_unit: '0.5 cup', category: 'legumes' },
  { name: 'Tofu (Firm)', calories: 144, protein: 17, carbs: 3.5, fat: 8.7, fiber: 0.3, sugar: 0.9, sodium: 18, serving_size: 126, serving_unit: '0.5 cup', category: 'legumes' },
  { name: 'Tempeh', calories: 320, protein: 34, carbs: 16, fat: 18, fiber: 0.4, sugar: 0.4, sodium: 15, serving_size: 166, serving_unit: '1 cup', category: 'legumes' },

  // ─── NUTS / SEEDS ─────────────────────────────────────────────────────────
  { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1.2, sodium: 0, serving_size: 28, serving_unit: '1 oz (~23 almonds)', category: 'nuts' },
  { name: 'Walnuts', calories: 185, protein: 4.3, carbs: 3.9, fat: 18, fiber: 1.9, sugar: 0.7, sodium: 1, serving_size: 28, serving_unit: '1 oz (~14 halves)', category: 'nuts' },
  { name: 'Cashews', calories: 157, protein: 5.2, carbs: 9, fat: 12, fiber: 0.9, sugar: 1.7, sodium: 3, serving_size: 28, serving_unit: '1 oz (~18 cashews)', category: 'nuts' },
  { name: 'Peanuts', calories: 161, protein: 7.3, carbs: 4.6, fat: 14, fiber: 2.4, sugar: 1.1, sodium: 5, serving_size: 28, serving_unit: '1 oz', category: 'nuts' },
  { name: 'Sunflower Seeds', calories: 165, protein: 5.5, carbs: 7, fat: 14, fiber: 3.1, sugar: 1.0, sodium: 1, serving_size: 28, serving_unit: '1 oz', category: 'nuts' },
  { name: 'Chia Seeds', calories: 138, protein: 4.7, carbs: 12, fat: 8.7, fiber: 9.8, sugar: 0.0, sodium: 5, serving_size: 28, serving_unit: '1 oz (2 tbsp)', category: 'nuts' },
  { name: 'Flaxseeds', calories: 150, protein: 5.2, carbs: 8.2, fat: 12, fiber: 7.7, sugar: 0.4, sodium: 9, serving_size: 28, serving_unit: '1 oz (3 tbsp)', category: 'nuts' },
  { name: 'Mixed Nuts', calories: 173, protein: 5, carbs: 6, fat: 16, fiber: 2.6, sugar: 1.3, sodium: 110, serving_size: 28, serving_unit: '1 oz', category: 'nuts' },
  { name: 'Pistachios', calories: 159, protein: 5.7, carbs: 7.7, fat: 13, fiber: 3.0, sugar: 2.2, sodium: 0, serving_size: 28, serving_unit: '1 oz (~49 kernels)', category: 'nuts' },
  { name: 'Pecans', calories: 196, protein: 2.6, carbs: 3.9, fat: 20, fiber: 2.7, sugar: 1.1, sodium: 0, serving_size: 28, serving_unit: '1 oz (~19 halves)', category: 'nuts' },

  // ─── BEVERAGES ────────────────────────────────────────────────────────────
  { name: 'Orange Juice', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, sugar: 21, sodium: 2, serving_size: 248, serving_unit: '1 cup', category: 'beverages' },
  { name: 'Apple Juice', calories: 114, protein: 0.3, carbs: 28, fat: 0.3, fiber: 0.5, sugar: 24, sodium: 10, serving_size: 248, serving_unit: '1 cup', category: 'beverages' },
  { name: 'Coffee (Black)', calories: 2, protein: 0.3, carbs: 0, fat: 0.0, fiber: 0, sugar: 0, sodium: 5, serving_size: 240, serving_unit: '1 cup (8 fl oz)', category: 'beverages' },
  { name: 'Green Tea', calories: 2, protein: 0.2, carbs: 0.5, fat: 0.0, fiber: 0, sugar: 0, sodium: 2, serving_size: 240, serving_unit: '1 cup (8 fl oz)', category: 'beverages' },
  { name: 'Cola Soda', calories: 136, protein: 0.3, carbs: 35, fat: 0.1, fiber: 0, sugar: 35, sodium: 45, serving_size: 355, serving_unit: '1 can (12 fl oz)', category: 'beverages' },
  { name: 'Diet Soda', calories: 0, protein: 0.1, carbs: 0.1, fat: 0.0, fiber: 0, sugar: 0, sodium: 40, serving_size: 355, serving_unit: '1 can (12 fl oz)', category: 'beverages' },
  { name: 'Sports Drink (Gatorade)', calories: 80, protein: 0, carbs: 21, fat: 0.0, fiber: 0, sugar: 21, sodium: 160, serving_size: 355, serving_unit: '1 bottle (12 fl oz)', category: 'beverages' },
  { name: 'Almond Milk (Unsweetened)', calories: 37, protein: 1.4, carbs: 3.4, fat: 2.7, fiber: 0.7, sugar: 0.1, sodium: 174, serving_size: 240, serving_unit: '1 cup', category: 'beverages' },
  { name: 'Oat Milk', calories: 120, protein: 3.0, carbs: 16, fat: 5.0, fiber: 2.0, sugar: 7.0, sodium: 100, serving_size: 240, serving_unit: '1 cup', category: 'beverages' },
  { name: 'Protein Shake (Whey)', calories: 160, protein: 30, carbs: 5.0, fat: 2.5, fiber: 0.5, sugar: 3.0, sodium: 150, serving_size: 300, serving_unit: '1 serving mixed', category: 'beverages' },

  // ─── SNACKS / SWEETS ──────────────────────────────────────────────────────
  { name: 'Potato Chips', calories: 152, protein: 2.0, carbs: 15, fat: 9.8, fiber: 1.3, sugar: 0.1, sodium: 149, serving_size: 28, serving_unit: '1 oz (~15 chips)', category: 'snacks' },
  { name: 'Popcorn (Air-Popped)', calories: 93, protein: 3.0, carbs: 19, fat: 1.1, fiber: 3.6, sugar: 0.2, sodium: 2, serving_size: 32, serving_unit: '3 cups', category: 'snacks' },
  { name: 'Chocolate Bar (Milk)', calories: 235, protein: 3.4, carbs: 26, fat: 13, fiber: 1.5, sugar: 22, sodium: 36, serving_size: 43, serving_unit: '1 bar (1.55 oz)', category: 'snacks' },
  { name: 'Ice Cream (Vanilla)', calories: 273, protein: 4.6, carbs: 31, fat: 15, fiber: 0.6, sugar: 25, sodium: 103, serving_size: 132, serving_unit: '0.5 cup (2 scoops)', category: 'snacks' },
  { name: 'Chocolate Chip Cookie', calories: 148, protein: 1.8, carbs: 19, fat: 7.3, fiber: 0.5, sugar: 11, sodium: 79, serving_size: 28, serving_unit: '1 large cookie', category: 'snacks' },
  { name: 'Brownie', calories: 243, protein: 3.1, carbs: 36, fat: 10, fiber: 1.3, sugar: 24, sodium: 160, serving_size: 56, serving_unit: '1 brownie (2 inch sq)', category: 'snacks' },
  { name: 'Pretzels', calories: 108, protein: 2.6, carbs: 23, fat: 0.8, fiber: 0.9, sugar: 0.8, sodium: 385, serving_size: 28, serving_unit: '1 oz', category: 'snacks' },
  { name: 'Rice Cake (Plain)', calories: 35, protein: 0.7, carbs: 7.3, fat: 0.3, fiber: 0.3, sugar: 0.0, sodium: 29, serving_size: 9, serving_unit: '1 rice cake', category: 'snacks' },
  { name: 'Granola Bar', calories: 193, protein: 4.3, carbs: 27, fat: 7.6, fiber: 2.7, sugar: 13, sodium: 95, serving_size: 47, serving_unit: '1 bar', category: 'snacks' },
  { name: 'Protein Bar', calories: 200, protein: 20, carbs: 21, fat: 7.0, fiber: 5.0, sugar: 8.0, sodium: 180, serving_size: 60, serving_unit: '1 bar', category: 'snacks' },

  // ─── FAST FOOD / RESTAURANT ───────────────────────────────────────────────
  { name: "McDonald's Big Mac", calories: 563, protein: 26, carbs: 45, fat: 33, fiber: 3.0, sugar: 9.0, sodium: 1007, serving_size: 208, serving_unit: '1 burger', category: 'fast_food' },
  { name: "Chick-fil-A Chicken Sandwich", calories: 440, protein: 28, carbs: 40, fat: 19, fiber: 2.0, sugar: 5.0, sodium: 1350, serving_size: 170, serving_unit: '1 sandwich', category: 'fast_food' },
  { name: 'Subway 6-inch Turkey Breast', calories: 280, protein: 18, carbs: 46, fat: 3.5, fiber: 5.0, sugar: 7.0, sodium: 760, serving_size: 228, serving_unit: '1 sandwich', category: 'fast_food' },
  { name: 'Pizza Pepperoni Slice', calories: 298, protein: 12, carbs: 35, fat: 11, fiber: 2.0, sugar: 3.5, sodium: 710, serving_size: 107, serving_unit: '1 slice (1/8 of 14in)', category: 'fast_food' },
  { name: 'French Fries (Medium)', calories: 320, protein: 4.3, carbs: 43, fat: 15, fiber: 3.8, sugar: 0.2, sodium: 400, serving_size: 117, serving_unit: '1 medium serving', category: 'fast_food' },
  { name: 'Chicken Burrito', calories: 565, protein: 35, carbs: 64, fat: 16, fiber: 5.0, sugar: 3.0, sodium: 1390, serving_size: 330, serving_unit: '1 burrito', category: 'fast_food' },
  { name: 'Caesar Salad (Restaurant)', calories: 470, protein: 13, carbs: 25, fat: 36, fiber: 4.0, sugar: 3.0, sodium: 1050, serving_size: 300, serving_unit: '1 entree salad', category: 'fast_food' },
  { name: 'Cheeseburger', calories: 313, protein: 15, carbs: 32, fat: 14, fiber: 1.0, sugar: 5.0, sodium: 743, serving_size: 113, serving_unit: '1 burger', category: 'fast_food' },
  { name: 'Hot Dog (with bun)', calories: 290, protein: 10, carbs: 24, fat: 17, fiber: 0.9, sugar: 4.0, sodium: 700, serving_size: 98, serving_unit: '1 hot dog with bun', category: 'fast_food' },
  { name: 'Fried Chicken (Breast)', calories: 364, protein: 35, carbs: 13, fat: 19, fiber: 0.5, sugar: 0.0, sodium: 1060, serving_size: 163, serving_unit: '1 breast piece', category: 'fast_food' },

  // ─── CONDIMENTS / SAUCES ─────────────────────────────────────────────────
  { name: 'Ketchup', calories: 19, protein: 0.3, carbs: 4.8, fat: 0.0, fiber: 0.1, sugar: 3.7, sodium: 154, serving_size: 17, serving_unit: '1 tbsp', category: 'condiments' },
  { name: 'Mustard (Yellow)', calories: 9, protein: 0.5, carbs: 0.9, fat: 0.5, fiber: 0.2, sugar: 0.1, sodium: 168, serving_size: 5, serving_unit: '1 tsp', category: 'condiments' },
  { name: 'Mayonnaise', calories: 94, protein: 0.1, carbs: 0.1, fat: 10, fiber: 0, sugar: 0.1, sodium: 88, serving_size: 14, serving_unit: '1 tbsp', category: 'condiments' },
  { name: 'Olive Oil', calories: 119, protein: 0, carbs: 0, fat: 13.5, fiber: 0, sugar: 0, sodium: 0, serving_size: 14, serving_unit: '1 tbsp', category: 'condiments' },
  { name: 'Vegetable Oil', calories: 120, protein: 0, carbs: 0, fat: 13.6, fiber: 0, sugar: 0, sodium: 0, serving_size: 14, serving_unit: '1 tbsp', category: 'condiments' },
  { name: 'Ranch Dressing', calories: 129, protein: 0.3, carbs: 2.0, fat: 13, fiber: 0, sugar: 1.2, sodium: 270, serving_size: 30, serving_unit: '2 tbsp', category: 'condiments' },
  { name: 'Italian Dressing', calories: 71, protein: 0.1, carbs: 2.4, fat: 7.1, fiber: 0, sugar: 1.6, sodium: 314, serving_size: 30, serving_unit: '2 tbsp', category: 'condiments' },
  { name: 'Soy Sauce', calories: 9, protein: 1.0, carbs: 0.8, fat: 0.1, fiber: 0.1, sugar: 0.1, sodium: 879, serving_size: 16, serving_unit: '1 tbsp', category: 'condiments' },
  { name: 'Hot Sauce', calories: 0, protein: 0.0, carbs: 0.1, fat: 0.0, fiber: 0, sugar: 0.0, sodium: 124, serving_size: 5, serving_unit: '1 tsp', category: 'condiments' },
  { name: 'Salsa', calories: 10, protein: 0.5, carbs: 2.2, fat: 0.0, fiber: 0.5, sugar: 1.2, sodium: 230, serving_size: 32, serving_unit: '2 tbsp', category: 'condiments' },

  // ─── PREPARED / MIXED FOODS ───────────────────────────────────────────────
  { name: 'Chicken Noodle Soup', calories: 75, protein: 6.1, carbs: 9.4, fat: 2.1, fiber: 0.7, sugar: 1.1, sodium: 866, serving_size: 244, serving_unit: '1 cup', category: 'prepared' },
  { name: 'Tomato Soup', calories: 85, protein: 2.1, carbs: 17, fat: 0.5, fiber: 1.5, sugar: 8.9, sodium: 695, serving_size: 244, serving_unit: '1 cup', category: 'prepared' },
  { name: 'Mac and Cheese (Box)', calories: 355, protein: 12, carbs: 52, fat: 11, fiber: 1.6, sugar: 7.4, sodium: 724, serving_size: 225, serving_unit: '1 cup prepared', category: 'prepared' },
  { name: 'Beef Chili', calories: 287, protein: 23, carbs: 29, fat: 9, fiber: 7.5, sugar: 5.0, sodium: 1029, serving_size: 253, serving_unit: '1 cup', category: 'prepared' },
  { name: 'Fried Rice', calories: 238, protein: 7.5, carbs: 36, fat: 7.5, fiber: 1.8, sugar: 2.4, sodium: 669, serving_size: 198, serving_unit: '1 cup', category: 'prepared' },
  { name: 'Scrambled Eggs', calories: 182, protein: 13, carbs: 1.6, fat: 13, fiber: 0, sugar: 1.5, sodium: 234, serving_size: 122, serving_unit: '2 large eggs prepared', category: 'prepared' },
  { name: 'Pancakes', calories: 227, protein: 6.8, carbs: 28, fat: 10, fiber: 0.9, sugar: 7.5, sodium: 573, serving_size: 114, serving_unit: '3 pancakes (4 inch)', category: 'prepared' },
  { name: 'Waffles', calories: 218, protein: 5.9, carbs: 33, fat: 7.9, fiber: 1.4, sugar: 6.7, sodium: 383, serving_size: 104, serving_unit: '2 waffles (7 inch)', category: 'prepared' },
  { name: 'Beef Stew', calories: 218, protein: 16, carbs: 16, fat: 9, fiber: 2.5, sugar: 3.0, sodium: 730, serving_size: 245, serving_unit: '1 cup', category: 'prepared' },
  { name: 'Omelette (2-egg)', calories: 196, protein: 14, carbs: 1.8, fat: 15, fiber: 0, sugar: 1.6, sodium: 294, serving_size: 122, serving_unit: '1 omelette', category: 'prepared' },

  // ─── SEAFOOD EXTRAS ───────────────────────────────────────────────────────
  { name: 'Crab (Blue)', calories: 98, protein: 21, carbs: 0, fat: 1.5, fiber: 0, sugar: 0, sodium: 395, serving_size: 100, serving_unit: '100g cooked', category: 'seafood' },
  { name: 'Lobster', calories: 98, protein: 21, carbs: 0.5, fat: 0.6, fiber: 0, sugar: 0, sodium: 380, serving_size: 100, serving_unit: '100g cooked', category: 'seafood' },
  { name: 'Scallops', calories: 111, protein: 23, carbs: 2.6, fat: 0.8, fiber: 0, sugar: 0, sodium: 529, serving_size: 100, serving_unit: '100g cooked', category: 'seafood' },
  { name: 'Cod', calories: 105, protein: 23, carbs: 0, fat: 0.9, fiber: 0, sugar: 0, sodium: 78, serving_size: 100, serving_unit: '100g cooked', category: 'seafood' },
  { name: 'Halibut', calories: 140, protein: 27, carbs: 0, fat: 2.9, fiber: 0, sugar: 0, sodium: 68, serving_size: 100, serving_unit: '100g cooked', category: 'seafood' },

  // ─── ADDITIONAL PRODUCE ───────────────────────────────────────────────────
  { name: 'Lemon', calories: 17, protein: 0.6, carbs: 5.4, fat: 0.2, fiber: 1.6, sugar: 1.5, sodium: 1, serving_size: 58, serving_unit: '1 medium', category: 'fruits' },
  { name: 'Lime', calories: 20, protein: 0.5, carbs: 7.1, fat: 0.1, fiber: 1.9, sugar: 1.1, sodium: 1, serving_size: 67, serving_unit: '1 medium', category: 'fruits' },
  { name: 'Cantaloupe', calories: 54, protein: 1.3, carbs: 13, fat: 0.3, fiber: 1.4, sugar: 13, sodium: 26, serving_size: 177, serving_unit: '1 cup diced', category: 'fruits' },
  { name: 'Honeydew Melon', calories: 64, protein: 1.0, carbs: 16, fat: 0.3, fiber: 1.4, sugar: 14, sodium: 32, serving_size: 177, serving_unit: '1 cup diced', category: 'fruits' },
  { name: 'Plum', calories: 30, protein: 0.5, carbs: 7.5, fat: 0.2, fiber: 0.9, sugar: 6.6, sodium: 0, serving_size: 66, serving_unit: '1 medium', category: 'fruits' },
  { name: 'Apricot', calories: 17, protein: 0.5, carbs: 3.9, fat: 0.1, fiber: 0.7, sugar: 3.2, sodium: 0, serving_size: 35, serving_unit: '1 medium', category: 'fruits' },
  { name: 'Dates', calories: 277, protein: 1.8, carbs: 75, fat: 0.2, fiber: 6.7, sugar: 64, sodium: 1, serving_size: 100, serving_unit: '100g (~5 dates)', category: 'fruits' },
  { name: 'Raisins', calories: 129, protein: 1.4, carbs: 34, fat: 0.2, fiber: 1.9, sugar: 25, sodium: 5, serving_size: 43, serving_unit: '1 small box (1.5 oz)', category: 'fruits' },
  { name: 'Cranberries (Fresh)', calories: 46, protein: 0.4, carbs: 12, fat: 0.1, fiber: 4.6, sugar: 4.0, sodium: 2, serving_size: 100, serving_unit: '100g', category: 'fruits' },
  { name: 'Fig', calories: 37, protein: 0.4, carbs: 9.6, fat: 0.1, fiber: 1.4, sugar: 8.1, sodium: 1, serving_size: 50, serving_unit: '1 medium', category: 'fruits' },

  // ─── ADDITIONAL ITEMS TO REACH 200+ ───────────────────────────────────────
  { name: 'Beef Jerky', calories: 116, protein: 9.4, carbs: 3.1, fat: 7.3, fiber: 0.5, sugar: 2.6, sodium: 627, serving_size: 28, serving_unit: '1 oz', category: 'snacks' },
  { name: 'Trail Mix', calories: 173, protein: 5, carbs: 17, fat: 11, fiber: 2.5, sugar: 8.0, sodium: 69, serving_size: 43, serving_unit: '0.25 cup', category: 'snacks' },
  { name: 'Dark Chocolate (70%)', calories: 170, protein: 2.2, carbs: 13, fat: 12, fiber: 3.1, sugar: 6.8, sodium: 6, serving_size: 28, serving_unit: '1 oz', category: 'snacks' },
  { name: 'Gummy Bears', calories: 130, protein: 2.0, carbs: 30, fat: 0.1, fiber: 0, sugar: 20, sodium: 25, serving_size: 43, serving_unit: '0.25 cup (~17 pieces)', category: 'snacks' },

  { name: 'Sausage (Pork Link)', calories: 268, protein: 17, carbs: 1.4, fat: 22, fiber: 0, sugar: 0.6, sodium: 736, serving_size: 67, serving_unit: '2 links', category: 'proteins' },
  { name: 'Pepperoni', calories: 138, protein: 5.9, carbs: 0.7, fat: 12, fiber: 0, sugar: 0.2, sodium: 493, serving_size: 28, serving_unit: '1 oz (~14 slices)', category: 'proteins' },
  { name: 'Deli Turkey', calories: 59, protein: 11, carbs: 1.0, fat: 1.1, fiber: 0, sugar: 0.7, sodium: 578, serving_size: 56, serving_unit: '2 oz (2 slices)', category: 'proteins' },
  { name: 'Roast Beef (Deli)', calories: 71, protein: 12, carbs: 0.5, fat: 2.1, fiber: 0, sugar: 0.3, sodium: 344, serving_size: 56, serving_unit: '2 oz (2 slices)', category: 'proteins' },

  { name: 'Baked Beans', calories: 239, protein: 11, carbs: 54, fat: 0.9, fiber: 10, sugar: 18, sodium: 867, serving_size: 254, serving_unit: '1 cup', category: 'legumes' },
  { name: 'Pinto Beans', calories: 245, protein: 15, carbs: 45, fat: 1.1, fiber: 15, sugar: 0.6, sodium: 2, serving_size: 171, serving_unit: '1 cup cooked', category: 'legumes' },

  { name: 'White Bread Roll', calories: 120, protein: 4.0, carbs: 22, fat: 2.0, fiber: 0.9, sugar: 2.5, sodium: 210, serving_size: 43, serving_unit: '1 roll', category: 'grains' },
  { name: 'Croissant', calories: 231, protein: 4.7, carbs: 26, fat: 12, fiber: 1.5, sugar: 6.1, sodium: 424, serving_size: 57, serving_unit: '1 medium', category: 'grains' },
  { name: 'Pita Bread', calories: 165, protein: 5.5, carbs: 33, fat: 0.7, fiber: 1.3, sugar: 0.6, sodium: 321, serving_size: 60, serving_unit: '1 pita (6.5 inch)', category: 'grains' },

  { name: 'Cottage Cheese (Low Fat)', calories: 163, protein: 28, carbs: 6.2, fat: 2.3, fiber: 0, sugar: 6.2, sodium: 918, serving_size: 226, serving_unit: '1 cup', category: 'dairy' },
  { name: 'Ricotta Cheese', calories: 216, protein: 14, carbs: 7.8, fat: 16, fiber: 0, sugar: 0.3, sodium: 155, serving_size: 124, serving_unit: '0.5 cup', category: 'dairy' },
  { name: 'Swiss Cheese', calories: 111, protein: 8, carbs: 1.5, fat: 8.7, fiber: 0, sugar: 0.5, sodium: 54, serving_size: 28, serving_unit: '1 oz', category: 'dairy' },

  { name: 'Beef Taco', calories: 170, protein: 8.2, carbs: 15, fat: 8.6, fiber: 1.6, sugar: 0.9, sodium: 303, serving_size: 78, serving_unit: '1 taco', category: 'fast_food' },
  { name: 'Cheese Pizza Slice', calories: 272, protein: 12, carbs: 34, fat: 9.8, fiber: 2.3, sugar: 3.6, sodium: 551, serving_size: 107, serving_unit: '1 slice (1/8 of 14in)', category: 'fast_food' },
  { name: "McDonald's McChicken", calories: 400, protein: 14, carbs: 40, fat: 21, fiber: 2.0, sugar: 5.0, sodium: 840, serving_size: 150, serving_unit: '1 sandwich', category: 'fast_food' },

  { name: 'Miso Soup', calories: 40, protein: 3.3, carbs: 5.4, fat: 1.0, fiber: 1.5, sugar: 0.9, sodium: 912, serving_size: 240, serving_unit: '1 cup', category: 'prepared' },
  { name: 'Chicken Fried Rice', calories: 343, protein: 14, carbs: 45, fat: 12, fiber: 1.5, sugar: 1.9, sodium: 890, serving_size: 227, serving_unit: '1 cup', category: 'prepared' },
  { name: 'Spaghetti with Meat Sauce', calories: 338, protein: 18, carbs: 44, fat: 10, fiber: 4.0, sugar: 7.0, sodium: 542, serving_size: 280, serving_unit: '1 cup', category: 'prepared' },
  { name: 'Grilled Cheese Sandwich', calories: 378, protein: 15, carbs: 32, fat: 22, fiber: 1.3, sugar: 3.5, sodium: 742, serving_size: 141, serving_unit: '1 sandwich', category: 'prepared' },
  { name: 'French Toast', calories: 266, protein: 8.8, carbs: 34, fat: 11, fiber: 1.3, sugar: 14, sodium: 344, serving_size: 135, serving_unit: '2 slices', category: 'prepared' },

  { name: 'Canned Tomatoes', calories: 41, protein: 2.0, carbs: 9.6, fat: 0.2, fiber: 2.4, sugar: 6.5, sodium: 355, serving_size: 240, serving_unit: '1 cup', category: 'vegetables' },
  { name: 'Artichoke', calories: 60, protein: 4.2, carbs: 13, fat: 0.2, fiber: 6.9, sugar: 1.2, sodium: 120, serving_size: 128, serving_unit: '1 medium', category: 'vegetables' },
  { name: 'Brussels Sprouts', calories: 56, protein: 4.0, carbs: 11, fat: 0.8, fiber: 4.1, sugar: 2.7, sodium: 33, serving_size: 155, serving_unit: '1 cup', category: 'vegetables' },
  { name: 'Beets', calories: 59, protein: 2.2, carbs: 13, fat: 0.2, fiber: 3.8, sugar: 9.2, sodium: 106, serving_size: 170, serving_unit: '1 cup sliced cooked', category: 'vegetables' },
  { name: 'Butternut Squash', calories: 82, protein: 1.8, carbs: 22, fat: 0.2, fiber: 6.6, sugar: 4.1, sodium: 8, serving_size: 205, serving_unit: '1 cup cubed cooked', category: 'vegetables' },

  { name: 'Coconut Oil', calories: 121, protein: 0, carbs: 0, fat: 13.5, fiber: 0, sugar: 0, sodium: 0, serving_size: 14, serving_unit: '1 tbsp', category: 'condiments' },
  { name: 'Honey', calories: 64, protein: 0.1, carbs: 17, fat: 0.0, fiber: 0, sugar: 17, sodium: 1, serving_size: 21, serving_unit: '1 tbsp', category: 'condiments' },
  { name: 'Maple Syrup', calories: 52, protein: 0.0, carbs: 13, fat: 0.0, fiber: 0, sugar: 12, sodium: 2, serving_size: 20, serving_unit: '1 tbsp', category: 'condiments' },
  { name: 'Balsamic Vinegar', calories: 14, protein: 0.1, carbs: 2.7, fat: 0.0, fiber: 0, sugar: 2.4, sodium: 4, serving_size: 16, serving_unit: '1 tbsp', category: 'condiments' },
  { name: 'Barbecue Sauce', calories: 47, protein: 0.3, carbs: 11, fat: 0.2, fiber: 0.2, sugar: 9.1, sodium: 362, serving_size: 34, serving_unit: '2 tbsp', category: 'condiments' },

  { name: 'Protein Powder (Whey)', calories: 120, protein: 24, carbs: 3.0, fat: 2.0, fiber: 0.5, sugar: 2.0, sodium: 130, serving_size: 30, serving_unit: '1 scoop', category: 'proteins' },
  { name: 'Whey Isolate Powder', calories: 110, protein: 25, carbs: 1.0, fat: 0.5, fiber: 0, sugar: 0.5, sodium: 100, serving_size: 28, serving_unit: '1 scoop', category: 'proteins' },

  { name: 'Coconut Milk (Canned)', calories: 445, protein: 4.6, carbs: 6.4, fat: 48, fiber: 0, sugar: 3.3, sodium: 29, serving_size: 240, serving_unit: '1 cup', category: 'dairy' },
  { name: 'Soy Milk', calories: 131, protein: 8.0, carbs: 15, fat: 4.3, fiber: 1.5, sugar: 9.0, sodium: 120, serving_size: 240, serving_unit: '1 cup', category: 'beverages' },
  { name: 'Orange Juice (Fresh)', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, sugar: 21, sodium: 2, serving_size: 248, serving_unit: '1 cup freshly squeezed', category: 'beverages' },
  { name: 'Lemonade', calories: 99, protein: 0.2, carbs: 26, fat: 0.0, fiber: 0.3, sugar: 25, sodium: 7, serving_size: 248, serving_unit: '1 cup', category: 'beverages' },

  { name: 'Beef Bone Broth', calories: 45, protein: 9.0, carbs: 0, fat: 1.0, fiber: 0, sugar: 0, sodium: 480, serving_size: 240, serving_unit: '1 cup', category: 'prepared' },
  { name: 'Vegetable Broth', calories: 15, protein: 1.0, carbs: 3.0, fat: 0.0, fiber: 0, sugar: 1.5, sodium: 940, serving_size: 240, serving_unit: '1 cup', category: 'prepared' },

  { name: 'Mackerel', calories: 262, protein: 24, carbs: 0, fat: 18, fiber: 0, sugar: 0, sodium: 83, serving_size: 100, serving_unit: '100g cooked', category: 'seafood' },
  { name: 'Oysters', calories: 69, protein: 7.1, carbs: 4.2, fat: 2.5, fiber: 0, sugar: 0, sodium: 244, serving_size: 100, serving_unit: '100g raw', category: 'seafood' },
  { name: 'Mussels', calories: 172, protein: 24, carbs: 7.4, fat: 4.5, fiber: 0, sugar: 0, sodium: 369, serving_size: 150, serving_unit: '1 cup cooked', category: 'seafood' },

  { name: 'Corn on the Cob', calories: 99, protein: 3.3, carbs: 21, fat: 1.5, fiber: 2.4, sugar: 6.4, sodium: 0, serving_size: 126, serving_unit: '1 medium ear', category: 'vegetables' },
  { name: 'Edamame (in pod)', calories: 94, protein: 9.2, carbs: 6.9, fat: 4.0, fiber: 4.7, sugar: 1.9, sodium: 9, serving_size: 120, serving_unit: '1 cup in pod', category: 'legumes' },
  { name: 'Seaweed (Nori)', calories: 10, protein: 1.5, carbs: 1.4, fat: 0.1, fiber: 0.3, sugar: 0.1, sodium: 98, serving_size: 10, serving_unit: '1 sheet (10g)', category: 'vegetables' },
  { name: 'Sushi Rice', calories: 298, protein: 5.2, carbs: 66, fat: 0.5, fiber: 0.7, sugar: 5.9, sodium: 522, serving_size: 155, serving_unit: '1 cup', category: 'grains' },
  { name: 'Miso Paste', calories: 56, protein: 3.3, carbs: 7.5, fat: 1.6, fiber: 1.5, sugar: 1.6, sodium: 1149, serving_size: 28, serving_unit: '1 oz (about 2 tbsp)', category: 'condiments' },
];
