// src/composables/useChatTime.ts
import { ref, computed, onMounted, onBeforeUnmount, isRef, type Ref } from 'vue';

type Input = Date | string | number | Ref<Date | string | number>;
export interface ChatTimeOptions {
  locale?: string;
  timeZone?: string; // e.g. 'Europe/Amsterdam'
  autoUpdate?: boolean; // default true
}

export function useChatTime(input: Input, opts: ChatTimeOptions = {}) {
  const locale = opts.locale ?? (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  const timeZone = opts.timeZone;
  const autoUpdate = opts.autoUpdate ?? true;

  const source = isRef(input) ? input : ref(input);
  const targetDate = computed<Date>(() => toDate(source.value));

  const now = ref(new Date());
  let timer: number | undefined;

  function schedule() {
    const delay = nextDelay(now.value, targetDate.value);
    timer = window.setTimeout(() => {
      now.value = new Date();
      schedule();
    }, delay);
  }

  onMounted(() => {
    if (autoUpdate) schedule();
  });
  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
  });

  const label = computed(() => formatChatTimestamp(targetDate.value, now.value, locale, timeZone));
  const daySeparator = computed(() =>
    formatDaySeparator(targetDate.value, now.value, locale, timeZone),
  );

  function refresh() {
    now.value = new Date();
  }

  return { label, daySeparator, refresh, now };
}

/* ---------- helpers ---------- */

function toDate(v: Date | string | number): Date {
  return v instanceof Date ? v : new Date(v);
}

function nextDelay(now: Date, date: Date): number {
  const ms = now.getTime() - date.getTime();
  if (ms < 30_000) return 1_000; // keep “just now” snappy
  if (ms < 60 * 60_000) return 15_000; // bump minutes quickly
  if (ms < 24 * 60 * 60_000) return 60_000; // update each minute
  if (ms < 7 * 24 * 60_60_000) return 5 * 60_000;
  return 60 * 60_000;
}

function formatChatTimestamp(date: Date, now: Date, locale: string, timeZone?: string): string {
  const ms = now.getTime() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;

  if (ms < 30 * 1000) return 'just now';
  if (ms < hour) return `${Math.floor(ms / minute)}m`;

  if (isSameLocalDay(date, now, timeZone)) return timeHM(date, locale, timeZone);
  if (isYesterdayLocal(date, now, timeZone)) return `Yesterday ${timeHM(date, locale, timeZone)}`;

  const sevenDays = 7 * 24 * hour;
  if (ms < sevenDays)
    return `${weekdayShort(date, locale, timeZone)} ${timeHM(date, locale, timeZone)}`;

  if (date.getFullYear() === now.getFullYear())
    return `${monthDay(date, locale, timeZone)} ${timeHM(date, locale, timeZone)}`;
  return `${monthDayYear(date, locale, timeZone)} ${timeHM(date, locale, timeZone)}`;
}

function formatDaySeparator(date: Date, now: Date, locale: string, timeZone?: string): string {
  if (isSameLocalDay(date, now, timeZone)) return 'Today';
  if (isYesterdayLocal(date, now, timeZone)) return 'Yesterday';
  if (localKey(date, timeZone).slice(0, 4) === localKey(now, timeZone).slice(0, 4))
    return monthDay(date, locale, timeZone);
  return monthDayYear(date, locale, timeZone);
}

/* ---------- “local day” utils (respects timeZone) ---------- */

function localKey(d: Date, timeZone?: string): string {
  // Stable YYYY-MM-DD string in the desired time zone
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}
function isSameLocalDay(a: Date, b: Date, tz?: string) {
  return localKey(a, tz) === localKey(b, tz);
}
function isYesterdayLocal(d: Date, now: Date, tz?: string) {
  const y = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return localKey(d, tz) === localKey(y, tz);
}

/* ---------- Intl wrappers ---------- */

function timeHM(d: Date, locale: string, timeZone?: string) {
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', timeZone }).format(
    d,
  );
}
function weekdayShort(d: Date, locale: string, timeZone?: string) {
  return new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone }).format(d);
}
function monthDay(d: Date, locale: string, timeZone?: string) {
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', timeZone }).format(d);
}
function monthDayYear(d: Date, locale: string, timeZone?: string) {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  }).format(d);
}

export { formatChatTimestamp, formatDaySeparator }; // optional: direct helpers
