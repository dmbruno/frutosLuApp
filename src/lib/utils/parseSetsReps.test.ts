import { describe, it, expect } from 'vitest';
import { parseSetsReps } from './parseSetsReps';

describe('parseSetsReps', () => {
  it('parsea "3X10"', () => {
    expect(parseSetsReps('3X10')).toEqual({ sets: 3, reps: 10, isPerSide: false, unit: 'reps' });
  });

  it('parsea "3X5/5" (por lado con slash)', () => {
    expect(parseSetsReps('3X5/5')).toEqual({ sets: 3, reps: 5, isPerSide: true, unit: 'reps' });
  });

  it('parsea "3X6 A 8" (rango)', () => {
    expect(parseSetsReps('3X6 A 8')).toEqual({ sets: 3, reps: null, isPerSide: false, unit: 'rango' });
  });

  it('parsea "10 TOTAL"', () => {
    expect(parseSetsReps('10 TOTAL')).toEqual({ sets: null, reps: 10, isPerSide: false, unit: 'total' });
  });

  it("parsea \"3X1' POR LADO\" (minutos)", () => {
    expect(parseSetsReps("3X1' POR LADO")).toEqual({ sets: 3, reps: null, isPerSide: true, unit: 'min' });
  });

  it("parsea \"3X10'' POR LADO\" (segundos)", () => {
    expect(parseSetsReps("3X10'' POR LADO")).toEqual({ sets: 3, reps: null, isPerSide: true, unit: 'seg' });
  });

  it("parsea \"1' X LADO\"", () => {
    expect(parseSetsReps("1' X LADO")).toEqual({ sets: null, reps: null, isPerSide: true, unit: 'min' });
  });

  it('parsea combinado "3X8 PASOS + 8 SENT" dejando reps en null', () => {
    expect(parseSetsReps('3X8 PASOS + 8 SENT')).toEqual({
      sets: 3,
      reps: null,
      isPerSide: false,
      unit: 'reps',
    });
  });

  it('nunca lanza error ante texto inesperado', () => {
    expect(() => parseSetsReps('cualquier cosa rara')).not.toThrow();
  });
});
