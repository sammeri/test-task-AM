<script setup lang="ts">
import { ref } from "vue";
import Stats from "./LoadTest/Stats.vue";
import RequestLog from "./LoadTest/RequestLog.vue";
import * as api from "../services/api";

interface LogItem {
  id: number | string;
  status: "success" | "error";
  timeMs: number;
}

const apiBase = import.meta.env.VITE_API_URL || "/api";

const requestsCount = ref(1000);
const concurrency = ref(50);

const sent = ref(0);
const success = ref(0);
const error = ref(0);
const completed = ref(0);
const isRunning = ref(false);
const elapsedTime = ref(0);
const requestLog = ref<LogItem[]>([]);

let startTime = 0;
let worker: Worker | null = null;
let timer: number;

// обновление времени выполнения
function updateElapsed() {
  elapsedTime.value = Number(((Date.now() - startTime) / 1000).toFixed(1));
  if (isRunning.value) {
    timer = window.setTimeout(updateElapsed, 100);
  }
}

// остановка воркера
function stopWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
  isRunning.value = false;
  clearTimeout(timer);
}

// отмена
function cancelWorkerTest() {
  stopWorker();
}

// старт
async function startWorkerTest() {
  const totalItems = await api.getItemCount();

  requestLog.value = [];
  sent.value = 0;
  success.value = 0;
  error.value = 0;
  completed.value = 0;
  isRunning.value = true;
  startTime = Date.now();

  // воркер
  worker = new Worker(new URL("../workers/workerStressTest.ts", import.meta.url), {
    type: "module",
  });

  worker.onmessage = (e: MessageEvent<{ type: string; id: number | string; time: number }>) => {
    const msg = e.data;

    if (msg.type === "success") {
      success.value++;
      completed.value++;
      sent.value++;
      requestLog.value.push({ id: msg.id, status: "success", timeMs: msg.time - startTime });
    }

    if (msg.type === "error") {
      error.value++;
      completed.value++;
      sent.value++;
      requestLog.value.push({ id: msg.id, status: "error", timeMs: msg.time - startTime });
    }

    if (msg.type === "done") {
      stopWorker();
    }
  };

  worker.postMessage({
    requestsCount: requestsCount.value,
    concurrency: concurrency.value,
    totalItems,
    apiBase,
  });

  updateElapsed();
}
</script>

<template>
  <div class="container">
    <h1 class="title-test">Worker Load Test</h1>

    <div class="main-content">
      <div class="sidebar">
        <label>
          Кол-во запросов:
          <input type="number" v-model.number="requestsCount" min="1" />
        </label>
        <label>
          Конкуренция:
          <input type="number" v-model.number="concurrency" min="1" />
        </label>

        <div class="buttons">
          <button @click="startWorkerTest" :disabled="isRunning">Старт</button>
          <button @click="cancelWorkerTest" :disabled="!isRunning">Отмена</button>
        </div>

        <div class="stats-summary">
          <p>Отправлено: {{ sent }}</p>
          <p>Успешно: {{ success }}</p>
          <p>Ошибки: {{ error }}</p>
          <p>Выполнено: {{ completed }}</p>
          <p>Время: {{ elapsedTime }} с</p>
        </div>
      </div>

      <div class="logs">
        <Stats
          :sent="sent"
          :success="success"
          :error="error"
          :completed="completed"
          :elapsedTime="elapsedTime"
          :isRunning="isRunning"
        />
        <RequestLog :requestLog="requestLog" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
