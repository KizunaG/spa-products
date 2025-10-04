import type { Recipe } from '../types';

export default function RecipeKpis({ items }: { items: Recipe[] }) {
  const total = items.length;
  const avgRating = items.length ? (items.reduce((s,r)=>s+r.rating,0)/items.length) : 0;
  const avgTime = items.length ? (
    items.reduce((s,r)=>s+r.prepTimeMinutes+r.cookTimeMinutes,0)/items.length
  ) : 0;

  const box = { padding:12, border:'1px solid #e5e7eb', borderRadius:8, minWidth:180 };

  return (
    <div style={{display:'flex', gap:12, margin:'12px 0'}}>
      <div style={box}><div>Total recetas</div><div style={{fontSize:24,fontWeight:700}}>{total}</div></div>
      <div style={box}><div>Promedio rating</div><div style={{fontSize:24,fontWeight:700}}>{avgRating.toFixed(2)}</div></div>
      <div style={box}><div>Tiempo prom. (min)</div><div style={{fontSize:24,fontWeight:700}}>{avgTime.toFixed(0)}</div></div>
    </div>
  );
}
