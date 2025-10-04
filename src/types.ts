export type Recipe = {
  id: number;
  name: string;
  rating: number;
  cuisine: string;
  caloriesPerServing: number;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  tags?: string[];
};

