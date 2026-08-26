import { describe, expect, it } from "vitest";
import { Clock, formatTime, parseTime, within } from "../src/engine/clock.js";

describe("clock", () => {
  it("parses and formats HH:MM", () => {
    expect(parseTime("07:30")).toBe(450);
    expect(parseTime("0:05")).toBe(5);
    expect(formatTime(450)).toBe("07:30");
    expect(formatTime(1439)).toBe("23:59");
    expect(() => parseTime("25:00")).toThrow();
  });

  it("handles overnight windows", () => {
    expect(within(parseTime("23:00"), "22:00", "06:00")).toBe(true);
    expect(within(parseTime("03:00"), "22:00", "06:00")).toBe(true);
    expect(within(parseTime("12:00"), "22:00", "06:00")).toBe(false);
    expect(within(parseTime("09:00"), "08:00", "17:00")).toBe(true);
    expect(within(parseTime("17:00"), "08:00", "17:00")).toBe(false);
  });

  it("advances and reports midnight", () => {
    const c = new Clock({ minutesPerTick: 10, startDay: 1, startMinute: 23 * 60 + 50 });
    expect(c.day).toBe(1);
    expect(c.time).toBe("23:50");
    expect(c.advance()).toBe(true);
    expect(c.day).toBe(2);
    expect(c.time).toBe("00:00");
    expect(c.advance()).toBe(false);
    expect(c.tick).toBe(2);
  });

  it("names the phase of day", () => {
    const c = new Clock({ minutesPerTick: 10, startDay: 0, startMinute: 0 });
    expect(c.phase).toBe("night");
    c.minute = 6 * 60;
    expect(c.phase).toBe("dawn");
    c.minute = 13 * 60;
    expect(c.phase).toBe("midday");
    c.minute = 20 * 60;
    expect(c.phase).toBe("evening");
  });
});
