import { createBrowserRouter } from 'react-router-dom';
import RecipesHomePage from '../pages/RecipesHomePage';
import NewRecipePage from '../pages/NewRecipePage';

export const router = createBrowserRouter([
  { path: '/', element: <RecipesHomePage /> },
  { path: '/nuevo', element: <NewRecipePage /> },
]);
