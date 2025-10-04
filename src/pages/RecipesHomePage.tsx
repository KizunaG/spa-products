import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Recipe } from '../types';
import { fetchRecipes, updateRecipe, deleteRecipe } from '../api/recipes';
import Modal from '../components/Modal';
import RecipeForm from '../components/RecipeForm';
import RecipeKpis from '../components/RecipeKpis';
import RecipeFilters from '../components/RecipeFilters';

const PAGE_SIZE = 10;

export default function RecipesHomePage() {
  const [items, setItems] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filtros/orden
  const [filters, setFilters] = useState({ cuisine:'', difficulty:'', minRating:0, tags:'', sortBy:'name-asc' });
  const [page, setPage] = useState(1);

  const [editRow, setEditRow] = useState<Recipe | null>(null);
  const [deleteRow, setDeleteRow] = useState<Recipe | null>(null);

  const location = useLocation() as { state?: { newRecipe?: Recipe } };

  useEffect(() => {
    fetchRecipes(200)
      .then(setItems)
      .catch(e=>setError(String(e?.message || e)))
      .finally(()=>setLoading(false));
  }, []);

  // volver de /nuevo con optimistic
  useEffect(() => {
    const nr = location.state?.newRecipe;
    if (nr && !items.find(x=>x.id===nr.id)) setItems(prev=>[nr,...prev]);
  }, [location.state, items]);

  const cuisines = useMemo(() => Array.from(new Set(items.map(i=>i.cuisine).filter(Boolean))).sort(), [items]);
  const difficulties = useMemo(() => Array.from(new Set(items.map(i=>i.difficulty).filter(Boolean))).sort(), [items]);

  const filtered = useMemo(() => {
    const tagList = filters.tags.split(',').map(t=>t.trim().toLowerCase()).filter(Boolean);
    return items.filter(r => {
      if (filters.cuisine && r.cuisine !== filters.cuisine) return false;
      if (filters.difficulty && r.difficulty !== filters.difficulty) return false;
      if (r.rating < filters.minRating) return false;
      if (tagList.length) {
        const rt = (r.tags ?? []).map(t=>t.toLowerCase());
        if (!tagList.every(t => rt.includes(t))) return false;
      }
      return true;
    });
  }, [items, filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a,b)=>{
      const timeA = a.prepTimeMinutes + a.cookTimeMinutes;
      const timeB = b.prepTimeMinutes + b.cookTimeMinutes;
      switch(filters.sortBy){
        case 'name-asc':  return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'rating-asc': return a.rating - b.rating;
        case 'rating-desc': return b.rating - a.rating;
        case 'time-asc': return timeA - timeB;
        case 'time-desc': return timeB - timeA;
        case 'cal-asc': return a.caloriesPerServing - b.caloriesPerServing;
        case 'cal-desc': return b.caloriesPerServing - a.caloriesPerServing;
        default: return 0;
      }
    });
    return arr;
  }, [filtered, filters.sortBy]);

  // paginación
  const total = sorted.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const rows = sorted.slice(start, start + PAGE_SIZE);
  const showingText = `${total===0 ? 0 : start+1}–${start + rows.length} de ${total} recetas`;

  useEffect(()=>{ setPage(1); }, [filters]); // reset al cambiar filtros

  if (loading) return <p style={{padding:20}}>Cargando recetas…</p>;
  if (error) return <p style={{padding:20,color:'red'}}>Error: {error}</p>;

  return (
    <div style={{ padding:20, maxWidth:1200, margin:'0 auto' }}>
      <h1>Recetas</h1>

      {/* KPIs */}
      <RecipeKpis items={sorted} />

      {/* Barra superior */}
      <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:12}}>
        <Link to="/nuevo"><button>➕ Añadir</button></Link>
      </div>

      {/* Filtros */}
      <RecipeFilters
        cuisines={cuisines}
        difficulties={difficulties}
        value={filters}
        onChange={setFilters}
      />

      {/* Tabla */}
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['ID','Nombre','Rating','Cocina','Cal/serv','Serv','Prep(min)','Cook(min)','Dificultad','Acciones'].map(h=>(
                <th key={h} style={{textAlign:'left',borderBottom:'1px solid #e5e7eb',padding:8}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id}>
                <td style={{borderBottom:'1px solid #f3f4f6',padding:8}}>{r.id}</td>
                <td style={{borderBottom:'1px solid #f3f4f6',padding:8}}>{r.name}</td>
                <td style={{borderBottom:'1px solid #f3f4f6',padding:8}}>{r.rating.toFixed(1)}</td>
                <td style={{borderBottom:'1px solid #f3f4f6',padding:8}}>{r.cuisine}</td>
                <td style={{borderBottom:'1px solid #f3f4f6',padding:8}}>{r.caloriesPerServing}</td>
                <td style={{borderBottom:'1px solid #f3f4f6',padding:8}}>{r.servings}</td>
                <td style={{borderBottom:'1px solid #f3f4f6',padding:8}}>{r.prepTimeMinutes}</td>
                <td style={{borderBottom:'1px solid #f3f4f6',padding:8}}>{r.cookTimeMinutes}</td>
                <td style={{borderBottom:'1px solid #f3f4f6',padding:8}}>{r.difficulty}</td>
                <td style={{borderBottom:'1px solid #f3f4f6',padding:8}}>
                  <button onClick={()=>setEditRow(r)} style={{marginRight:8}}>Editar</button>
                  <button onClick={()=>setDeleteRow(r)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={10} style={{padding:16,textAlign:'center'}}>Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación y texto x–y de z */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
        <div>{showingText}</div>
        <div style={{display:'flex',gap:8}}>
          <button disabled={page<=1} onClick={()=>setPage(page-1)}>«</button>
          <span>Página {page} de {pages}</span>
          <button disabled={page>=pages} onClick={()=>setPage(page+1)}>»</button>
        </div>
      </div>

      {/* MODAL EDITAR */}
      <Modal title={`Editar #${editRow?.id ?? ''}`} isOpen={!!editRow} onClose={()=>setEditRow(null)}>
        {editRow && (
          <RecipeForm
            mode="edit"
            submitText="Guardar cambios"
            initial={editRow}
            onCancel={()=>setEditRow(null)}
            onSubmit={async (data) => {
              // Optimistic
              setItems(prev => prev.map(x => x.id === editRow.id ? { ...x, ...(data as any) } : x));
              await updateRecipe(editRow.id, data as any);
              setEditRow(null);
            }}
          />
        )}
      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal title="Confirmar eliminación" isOpen={!!deleteRow} onClose={()=>setDeleteRow(null)}>
        {deleteRow && (
          <div style={{display:'grid',gap:12}}>
            <p>¿Eliminar la receta <b>#{deleteRow.id}</b> (“{deleteRow.name}”)?</p>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button onClick={()=>setDeleteRow(null)}>Cancelar</button>
              <button onClick={async ()=>{
                setItems(prev=>prev.filter(x=>x.id!==deleteRow.id)); // optimistic
                await deleteRecipe(deleteRow.id);
                setDeleteRow(null);
              }}>Eliminar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
