import type { Recipe } from '../types';
import { BASE_URL, http } from './client';

/** DummyJSON: GET /recipes soporta limit & skip. Traemos muchas y filtramos en cliente. */
export async function fetchRecipes(limit = 200, skip = 0): Promise<Recipe[]> {
  const data = await http<{ recipes: Recipe[] }>(`${BASE_URL}/recipes?limit=${limit}&skip=${skip}`);
  return data.recipes;
}

/** Crear (simulado) */
export async function createRecipe(data: Omit<Recipe, 'id'>): Promise<Recipe> {
  return http<Recipe>(`${BASE_URL}/recipes/add`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Actualizar parcial */
export async function updateRecipe(id: number, data: Partial<Omit<Recipe,'id'>>): Promise<Recipe> {
  return http<Recipe>(`${BASE_URL}/recipes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/** Eliminar (simulado) */
export async function deleteRecipe(id: number): Promise<void> {
  await http<void>(`${BASE_URL}/recipes/${id}`, { method: 'DELETE' });
}
