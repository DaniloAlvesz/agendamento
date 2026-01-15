import test from "node:test";
import assert from "node:assert";
import { minutesToTime, parseTimeToMinutes } from "../src/server/time";
import { localTimeToUtcISO } from "../src/server/availability";

test("time helpers convert minutes", () => {
  assert.equal(parseTimeToMinutes("09:30"), 570);
  assert.equal(minutesToTime(570), "09:30");
});

test("localTimeToUtcISO respects timezone", () => {
  const iso = localTimeToUtcISO({
    date: "2025-01-01",
    time: "12:00",
    timezone: "America/Recife"
  });
  assert.ok(iso.includes("T15:00:00.000Z"));
});
