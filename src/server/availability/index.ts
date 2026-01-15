import { addDays, addMinutes, differenceInMinutes, isAfter, isBefore } from "date-fns";
import { prisma } from "@/server/db";
import {
  getWeekdayFromDate,
  minutesToTime,
  parseLocalDate,
  parseTimeToMinutes,
  utcToZonedTime,
  zonedTimeToUtc
} from "@/server/time";

const MAX_DAYS = 60;
const MIN_NOTICE_MINUTES = 120;

export async function getAvailableSlots({
  professionalId,
  date,
  serviceId
}: {
  professionalId: string;
  date: string;
  serviceId: string;
}) {
  const professional = await prisma.professionalProfile.findUnique({
    where: { id: professionalId }
  });
  if (!professional) return [];

  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  });
  if (!service) return [];

  const localDate = parseLocalDate(date);
  const todayLocal = utcToZonedTime(new Date(), professional.timezone);
  const maxDateLocal = addDays(todayLocal, MAX_DAYS);

  const localDateInZone = utcToZonedTime(localDate, professional.timezone);
  if (isAfter(localDateInZone, maxDateLocal)) return [];

  const weekday = getWeekdayFromDate(date, professional.timezone);
  const rules = await prisma.availabilityRule.findMany({
    where: { professionalId, dayOfWeek: weekday, active: true }
  });
  if (!rules.length) return [];

  const dayStartUtc = zonedTimeToUtc(localDate, professional.timezone);
  const dayEndUtc = addMinutes(dayStartUtc, 24 * 60);

  const existingBookings = await prisma.booking.findMany({
    where: {
      professionalId,
      status: "CONFIRMED",
      startAt: { lt: dayEndUtc },
      endAt: { gt: dayStartUtc }
    }
  });

  const blocks = await prisma.block.findMany({
    where: {
      professionalId,
      startAt: { lt: dayEndUtc },
      endAt: { gt: dayStartUtc }
    }
  });

  const nowLocal = utcToZonedTime(new Date(), professional.timezone);
  const minNoticeTime = addMinutes(nowLocal, MIN_NOTICE_MINUTES);

  const slots: string[] = [];

  for (const rule of rules) {
    const startMinutes = parseTimeToMinutes(rule.startTime);
    const endMinutes = parseTimeToMinutes(rule.endTime);
    const breakStart = rule.breakStart ? parseTimeToMinutes(rule.breakStart) : null;
    const breakEnd = rule.breakEnd ? parseTimeToMinutes(rule.breakEnd) : null;

    for (
      let cursor = startMinutes;
      cursor + service.durationMinutes <= endMinutes;
      cursor += rule.intervalMinutes
    ) {
      if (
        breakStart !== null &&
        breakEnd !== null &&
        cursor < breakEnd &&
        cursor + service.durationMinutes > breakStart
      ) {
        continue;
      }

      const slotTime = minutesToTime(cursor);
      const [year, month, day] = date.split("-").map(Number);
      const localStart = new Date(Date.UTC(year, month - 1, day, 0, 0));
      localStart.setUTCMinutes(cursor);
      const startAt = zonedTimeToUtc(localStart, professional.timezone);
      const endAt = addMinutes(startAt, service.durationMinutes);

      if (isBefore(utcToZonedTime(startAt, professional.timezone), minNoticeTime)) {
        continue;
      }

      const hasBooking = existingBookings.some(
        (booking) => booking.startAt < endAt && booking.endAt > startAt
      );
      const hasBlock = blocks.some((block) => block.startAt < endAt && block.endAt > startAt);

      if (hasBooking || hasBlock) continue;

      slots.push(slotTime);
    }
  }

  return Array.from(new Set(slots)).sort();
}

export function localTimeToUtcISO({
  date,
  time,
  timezone
}: {
  date: string;
  time: string;
  timezone: string;
}) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const local = new Date(Date.UTC(year, month - 1, day, hour, minute));
  return zonedTimeToUtc(local, timezone).toISOString();
}
