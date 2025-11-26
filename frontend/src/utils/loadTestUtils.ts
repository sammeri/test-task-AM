import { ref } from "vue";
import * as api from "../services/api";

export interface LogItem {
  id: number | string;
  status: "success" | "error";
  timeMs: number;
}

export const sent = ref(0);
export const success = ref(0);
export const error = ref(0);
export const completed = ref(0);
export const isRunning = ref(false);
export const elapsedTime = ref(0);
export const requestLog = ref<LogItem[]>([]);

let timer: number;
let startTime = 0;

// активные setTimeout
let timeouts: number[] = [];

// Сбрасываем счётчики
function resetState() {
  sent.value = 0;
  success.value = 0;
  error.value = 0;
  completed.value = 0;
  elapsedTime.value = 0;
  requestLog.value = [];
  timeouts = [];
}

// Таймер обновления времени
function updateElapsed() {
  elapsedTime.value = Number(((Date.now() - startTime) / 1000).toFixed(1));
  timer = window.setTimeout(updateElapsed, 100);
}

// Обычный тест
export async function startTest(requestsCount: number, delayMs: number) {
  cancelTest();
  resetState();

  isRunning.value = true;
  startTime = Date.now();
  updateElapsed();

  const totalItems = await api.getItemCount();

  for (let i = 0; i < requestsCount; i++) {
    const t = window.setTimeout(async () => {
      if (!isRunning.value) return;

      sent.value++;

      const randomId = Math.floor(Math.random() * totalItems) + 1;

      const started = performance.now();
      try {
        const item = await api.getItemBySinceId(randomId);
        success.value++;
        requestLog.value.push({
          id: item?.id ?? "N/A",
          status: "success",
          timeMs: performance.now() - started,
        });
      } catch {
        error.value++;
        requestLog.value.push({
          id: randomId,
          status: "error",
          timeMs: performance.now() - started,
        });
      } finally {
        completed.value++;

        if (completed.value === requestsCount) {
          isRunning.value = false;
          clearTimeout(timer);
        }
      }
    }, i * delayMs);

    timeouts.push(t);
  }
}

// Стресс-тест
interface PromiseWithSettled extends Promise<void> {
  settled?: boolean;
}

export async function startStressTest(requestsCount: number, concurrency = 50) {
  cancelTest();
  resetState();

  isRunning.value = true;
  startTime = Date.now();
  updateElapsed();

  const totalItems = await api.getItemCount();
  let active: PromiseWithSettled[] = [];

  async function runRequest(holder: PromiseWithSettled, randomId: number) {
    const started = performance.now();
    try {
      const item = await api.getItemBySinceId(randomId);
      success.value++;
      requestLog.value.push({
        id: item?.id ?? "N/A",
        status: "success",
        timeMs: performance.now() - started,
      });
    } catch {
      error.value++;
      requestLog.value.push({
        id: randomId,
        status: "error",
        timeMs: performance.now() - started,
      });
    } finally {
      completed.value++;
      holder.settled = true;

      if (completed.value === requestsCount) {
        isRunning.value = false;
        clearTimeout(timer);
      }
    }
  }

  for (let i = 0; i < requestsCount; i++) {
    sent.value++;
    const randomId = Math.floor(Math.random() * totalItems) + 1;

    let resolver!: () => void;
    const holder = new Promise<void>((resolve) => {
      resolver = resolve;
    }) as PromiseWithSettled;

    runRequest(holder, randomId).finally(() => resolver());

    active.push(holder);

    if (active.length >= concurrency) {
      await Promise.race(active);
      active = active.filter((p) => !p.settled);
    }
  }

  await Promise.all(active);
}

// Отмена теста
export function cancelTest() {
  isRunning.value = false;
  clearTimeout(timer);

  timeouts.forEach((t) => clearTimeout(t));
  timeouts = [];
}

// Экспорт в JSON
export function exportLog() {
  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(requestLog.value));

  const dl = document.createElement("a");
  dl.setAttribute("href", dataStr);
  dl.setAttribute("download", "loadtest_log.json");
  dl.click();
}
