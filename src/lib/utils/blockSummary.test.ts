import { describe, it, expect } from 'vitest';
import { getUniformSets, stripSetsPrefix } from './blockSummary';
import type { ProgramExerciseWithExercise } from '../../types/domain';

function withSets(parsed_sets: number | null): ProgramExerciseWithExercise {
  return { parsed_sets } as ProgramExerciseWithExercise;
}

describe('getUniformSets', () => {
  it('devuelve el número cuando todos comparten el mismo parsed_sets', () => {
    expect(getUniformSets([withSets(3), withSets(3), withSets(3)])).toBe(3);
  });

  it('devuelve null si los sets difieren', () => {
    expect(getUniformSets([withSets(3), withSets(4)])).toBeNull();
  });

  it('devuelve null si alguno no tiene parsed_sets', () => {
    expect(getUniformSets([withSets(3), withSets(null)])).toBeNull();
  });

  it('devuelve null con lista vacía', () => {
    expect(getUniformSets([])).toBeNull();
  });
});

describe('stripSetsPrefix', () => {
  it('saca el prefijo "3X" de "3X5/5"', () => {
    expect(stripSetsPrefix('3X5/5', 3)).toBe('5/5');
  });

  it('es case-insensitive y tolera espacios', () => {
    expect(stripSetsPrefix('3 x 10', 3)).toBe('10');
  });

  it('devuelve el texto tal cual si no matchea el prefijo', () => {
    expect(stripSetsPrefix('10 TOTAL', 3)).toBe('10 TOTAL');
  });
});
