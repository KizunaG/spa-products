import { useMemo, useState } from 'react';
import styles from './RecipeForm.module.css';
import type { Recipe } from '../types';

type Props = {
  initial?: Partial<Recipe>;
  submitText?: string;
  onSubmit: (data: Omit<Recipe,'id'> | Partial<Omit<Recipe,'id'>>) => Promise<void> | void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
};

export default function RecipeForm({
  initial = {},
  submitText = 'Guardar',
  onSubmit,
  onCancel,
  mode = 'create',
}: Props) {
  const [name, setName] = useState(initial.name ?? '');
  const [rating, setRating] = useState<number | ''>(initial.rating ?? '');
  const [cuisine, setCuisine] = useState(initial.cuisine ?? '');
  const [caloriesPerServing, setCalories] = useState<number | ''>(initial.caloriesPerServing ?? '');
  const [servings, setServings] = useState<number | ''>(initial.servings ?? 1);
  const [prepTimeMinutes, setPrep] = useState<number | ''>(initial.prepTimeMinutes ?? '');
  const [cookTimeMinutes, setCook] = useState<number | ''>(initial.cookTimeMinutes ?? '');
  const [difficulty, setDifficulty] = useState<string>(initial.difficulty ?? 'Easy');
  const [tags, setTags] = useState((initial.tags ?? []).join(', '));

  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const r = useMemo(() => rating === '' ? NaN : Number(rating), [rating]);
  const cal = useMemo(() => caloriesPerServing === '' ? NaN : Number(caloriesPerServing), [caloriesPerServing]);
  const s = useMemo(() => servings === '' ? NaN : Number(servings), [servings]);
  const prep = useMemo(() => prepTimeMinutes === '' ? NaN : Number(prepTimeMinutes), [prepTimeMinutes]);
  const cook = useMemo(() => cookTimeMinutes === '' ? NaN : Number(cookTimeMinutes), [cookTimeMinutes]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError('El nombre es requerido.');
    if (!Number.isFinite(r) || r < 0 || r > 5) return setError('Rating 0–5.');
    if (!Number.isFinite(cal) || cal <= 0) return setError('Calorías > 0.');
    if (!Number.isFinite(s) || s <= 0) return setError('Servings > 0.');
    if (!Number.isFinite(prep) || !Number.isFinite(cook) || prep < 0 || cook < 0) return setError('Tiempos válidos.');

    setError(null);
    setSending(true);
    try {
      const payload = {
        name: name.trim(),
        rating: r,
        cuisine: cuisine.trim(),
        caloriesPerServing: cal,
        servings: s,
        prepTimeMinutes: prep,
        cookTimeMinutes: cook,
        difficulty: difficulty as Recipe['difficulty'],
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      await onSubmit(payload);
    } finally {
      setSending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label>Nombre *</label>
        <input className={styles.input} value={name} onChange={e=>setName(e.target.value)} />
      </div>

      <div className={styles.grid2}>
        <div className={styles.row}>
          <label>Rating (0–5) *</label>
          <input className={styles.input} type="number" step="0.1"
            value={rating} onChange={e=>setRating(e.target.value === '' ? '' : Number(e.target.value))}/>
        </div>
        <div className={styles.row}>
          <label>Cocina</label>
          <input className={styles.input} value={cuisine} onChange={e=>setCuisine(e.target.value)} placeholder="Italian, Mexican…" />
        </div>
      </div>

      <div className={styles.grid2}>
        <div className={styles.row}>
          <label>Calorías por porción *</label>
          <input className={styles.input} type="number"
            value={caloriesPerServing} onChange={e=>setCalories(e.target.value === '' ? '' : Number(e.target.value))}/>
        </div>
        <div className={styles.row}>
          <label>Porciones *</label>
          <input className={styles.input} type="number"
            value={servings} onChange={e=>setServings(e.target.value === '' ? '' : Number(e.target.value))}/>
        </div>
      </div>

      <div className={styles.grid2}>
        <div className={styles.row}>
          <label>Prep (min) *</label>
          <input className={styles.input} type="number"
            value={prepTimeMinutes} onChange={e=>setPrep(e.target.value === '' ? '' : Number(e.target.value))}/>
        </div>
        <div className={styles.row}>
          <label>Cook (min) *</label>
          <input className={styles.input} type="number"
            value={cookTimeMinutes} onChange={e=>setCook(e.target.value === '' ? '' : Number(e.target.value))}/>
        </div>
      </div>

      <div className={styles.row}>
        <label>Dificultad</label>
        <select className={styles.select} value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </select>
      </div>

      <div className={styles.row}>
        <label>Tags (separados por coma)</label>
        <input className={styles.input} value={tags} onChange={e=>setTags(e.target.value)} placeholder="vegan, quick" />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        {onCancel && <button type="button" onClick={onCancel} className={`${styles.btn} ${styles.secondary}`}>Cancelar</button>}
        <button className={styles.btn} disabled={sending}>{sending ? 'Guardando…' : submitText}</button>
      </div>
    </form>
  );
}
