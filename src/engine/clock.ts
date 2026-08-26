import type { ClockSpec } from "../types.js";

export const MINUTES_PER_DAY = 24 * 60;

/** Parse "HH:MM" into minutes since midnight. */
export function parseTime(hhmm: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) throw new Error(`Bad time "${hhmm}", expected HH:MM`);
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new Error(`Bad time "${hhmm}"`);
  return h * 60 + min;
}

export function formatTime(minuteOfDay: number): string {
  const m = ((minuteOfDay % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/** True when `minuteOfDay` falls inside [start, end), handling overnight windows. */
export function within(minuteOfDay: number, start: string, end: string): boolean {
  const s = parseTime(start);
  const e = parseTime(end);
  const m = minuteOfDay % MINUTES_PER_DAY;
  if (s === e) return true;
  if (s < e) return m >= s && m < e;
  return m >= s || m < e;
}

export type Phase = "night" | "dawn" | "morning" | "midday" | "afternoon" | "evening";

export class Clock {
  readonly minutesPerTick: number;
  /** Absolute simulated minute since day 0, 00:00. */
  minute: number;
  tick = 0;

  constructor(spec: ClockSpec) {
    if (spec.minutesPerTick <= 0) throw new Error("minutesPerTick must be positive");
    this.minutesPerTick = spec.minutesPerTick;
    this.minute = spec.startDay * MINUTES_PER_DAY + spec.startMinute;
  }

  get day(): number {
    return Math.floor(this.minute / MINUTES_PER_DAY);
  }

  get minuteOfDay(): number {
    return this.minute % MINUTES_PER_DAY;
  }

  get time(): string {
    return formatTime(this.minuteOfDay);
  }

  get label(): string {
    return `Day ${this.day} ${this.time}`;
  }

  /** Advance one tick. Returns true when the advance crossed midnight. */
  advance(): boolean {
    const before = this.day;
    this.minute += this.minutesPerTick;
    this.tick += 1;
    return this.day !== before;
  }

  /** Hours elapsed between an earlier absolute minute and now. */
  hoursSince(minute: number): number {
    return Math.max(0, this.minute - minute) / 60;
  }

  get phase(): Phase {
    const m = this.minuteOfDay;
    if (m < 5 * 60) return "night";
    if (m < 8 * 60) return "dawn";
    if (m < 12 * 60) return "morning";
    if (m < 14 * 60) return "midday";
    if (m < 18 * 60) return "afternoon";
    if (m < 22 * 60) return "evening";
    return "night";
  }
}
