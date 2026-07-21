export type RepUnit = 'reps' | 'seg' | 'min' | 'total' | 'rango' | null;

export interface ParsedSetsReps {
  sets: number | null;
  reps: number | null;
  isPerSide: boolean;
  unit: RepUnit;
}

// Espejo de parse_sets_reps() en supabase/migrations/0001_initial_schema.sql.
// Ante la duda, null — el texto de sets_reps_text siempre manda para mostrar.
export function parseSetsReps(text: string): ParsedSetsReps {
  const norm = text.trim().toUpperCase();

  const isPerSide = /POR LADO/.test(norm) || /X LADO/.test(norm) || /\/\s*\d+\s*$/.test(norm);

  let unit: RepUnit;
  if (norm.includes("''")) {
    unit = 'seg';
  } else if (norm.includes("'")) {
    unit = 'min';
  } else if (norm.includes('TOTAL')) {
    unit = 'total';
  } else if (/\d+\s+A\s+\d+/.test(norm)) {
    unit = 'rango';
  } else {
    unit = 'reps';
  }

  let sets: number | null = null;
  const setsMatch = norm.match(/^(\d+)\s*X/);
  if (setsMatch) {
    sets = parseInt(setsMatch[1], 10);
  }

  let reps: number | null = null;
  if (unit === 'reps' && !norm.includes('+')) {
    const repsMatch = norm.match(/^\d+\s*X\s*(\d+)/);
    if (repsMatch) {
      reps = parseInt(repsMatch[1], 10);
    } else if (sets === null) {
      const soloMatch = norm.match(/^(\d+)\s*$/);
      if (soloMatch) {
        reps = parseInt(soloMatch[1], 10);
      }
    }
  } else if (unit === 'total') {
    const totalMatch = norm.match(/^(\d+)\s+TOTAL/);
    if (totalMatch) {
      reps = parseInt(totalMatch[1], 10);
    }
  }

  return { sets, reps, isPerSide, unit };
}
