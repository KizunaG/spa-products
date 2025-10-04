type Props = {
  cuisines: string[];
  difficulties: string[];
  value: { cuisine: string; difficulty: string; minRating: number; tags: string; sortBy: string; };
  onChange: (v: Props['value']) => void;
};

export default function RecipeFilters({ cuisines, difficulties, value, onChange }: Props) {
  function set<K extends keyof Props['value']>(k: K, v: Props['value'][K]) {
    onChange({ ...value, [k]: v });
  }

  return (
    <div style={{display:'grid', gap:8, gridTemplateColumns:'repeat(5, 1fr)', margin:'12px 0'}}>
      <select value={value.cuisine} onChange={e=>set('cuisine', e.target.value)}>
        <option value="">Cocina (todas)</option>
        {cuisines.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={value.difficulty} onChange={e=>set('difficulty', e.target.value)}>
        <option value="">Dificultad (todas)</option>
        {difficulties.map(d=> <option key={d} value={d}>{d}</option>)}
      </select>
      <input type="number" step="0.1" placeholder="Rating mínimo"
             value={value.minRating} onChange={e=>set('minRating', Number(e.target.value)||0)} />
      <input placeholder="Tags (coma)" value={value.tags} onChange={e=>set('tags', e.target.value)} />
      <select value={value.sortBy} onChange={e=>set('sortBy', e.target.value)}>
        <option value="name-asc">Nombre ↑</option>
        <option value="name-desc">Nombre ↓</option>
        <option value="rating-desc">Rating ↓</option>
        <option value="rating-asc">Rating ↑</option>
        <option value="time-asc">Tiempo (prep+cook) ↑</option>
        <option value="time-desc">Tiempo (prep+cook) ↓</option>
        <option value="cal-asc">Calorías ↑</option>
        <option value="cal-desc">Calorías ↓</option>
      </select>
    </div>
  );
}
