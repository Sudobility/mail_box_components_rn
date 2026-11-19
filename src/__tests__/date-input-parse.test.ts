/**
 * A date-only string is a local calendar day.
 *
 * `new Date('2026-03-05')` is midnight UTC, so anywhere west of UTC the field
 * showed the 4th for a value of the 5th. The component emits `YYYY-MM-DD`
 * from local parts, so it must read it back the same way.
 */
import { parseDateValue } from '../ui/DateInput/DateInput';

describe('parseDateValue', () => {
  it('reads YYYY-MM-DD as that local day, whatever the timezone', () => {
    const date = parseDateValue('2026-03-05');
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([
      2026, 2, 5,
    ]);
    expect(date.getHours()).toBe(0);
  });

  it('round-trips the first and last day of a year', () => {
    for (const [value, parts] of [
      ['2026-01-01', [2026, 0, 1]],
      ['2026-12-31', [2026, 11, 31]],
    ] as const) {
      const date = parseDateValue(value);
      expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual(
        parts
      );
    }
  });

  it('leaves a full timestamp to the Date parser', () => {
    expect(parseDateValue('2026-03-05T10:00:00.000Z').toISOString()).toBe(
      '2026-03-05T10:00:00.000Z'
    );
  });
});
