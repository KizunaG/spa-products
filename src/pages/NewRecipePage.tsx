import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { createRecipe } from '../api/recipes';
import type { Recipe } from '../types';

export default function NewRecipePage() {
  const nav = useNavigate();

  return (
    <div style={{ maxWidth: 900, margin:'0 auto', padding:20 }}>
      <h1>Nueva receta</h1>
      <RecipeForm
        submitText="Crear"
        onCancel={() => nav('/')}
        onSubmit={async (data) => {
          const saved = await createRecipe(data as Omit<Recipe,'id'>);
          nav('/', { replace: true, state: { newRecipe: saved } }); // optimistic UI al volver
        }}
      />
    </div>
  );
}
