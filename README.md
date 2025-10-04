# SPA Recetas (DummyJSON)
- KPIs: total, rating promedio, tiempo promedio
- Tabla: id, name, rating, cuisine, caloriesPerServing, servings, prepTimeMinutes, cookTimeMinutes, difficulty
- Filtros: cocina, dificultad, rating mínimo, tags (coma), ordenar por; paginación con texto "x–y de z"
- Crear (/nuevo), Editar (modal), Eliminar (modal), Optimistic UI
- CSS Modules, API aislada

Instalación:
npm i
npm run dev

Build:
npm run build
npm run preview

Netlify:
build: npm run build
publish: dist
_redirects: /* /index.html 200

Link de Netlify
https://spaproductohg.netlify.app/
