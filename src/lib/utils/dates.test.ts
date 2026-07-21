import { describe, it, expect } from 'vitest';
import { daysRemaining } from './dates';

describe('daysRemaining', () => {
  const today = new Date('2026-07-21T15:00:00');

  it('devuelve null si no hay fecha de vencimiento', () => {
    expect(daysRemaining(null, today)).toBeNull();
  });

  it('cuenta los días restantes hasta una fecha futura', () => {
    expect(daysRemaining('2026-07-31', today)).toBe(10);
  });

  it('devuelve 0 el mismo día del vencimiento', () => {
    expect(daysRemaining('2026-07-21', today)).toBe(0);
  });

  it('devuelve negativo si ya venció', () => {
    expect(daysRemaining('2026-07-19', today)).toBe(-2);
  });
});
