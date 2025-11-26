<script setup lang="ts">
import { ref } from "vue";

import Controls from "./LoadTest/Controls.vue";
import Stats from "./LoadTest/Stats.vue";
import RequestLog from "./LoadTest/RequestLog.vue";
import * as loadTest from "../utils/loadTestUtils";

const requestsCount = ref(100);
const delayMs = ref(100);
const stressConcurrency = ref(50);

const sent = loadTest.sent;
const success = loadTest.success;
const error = loadTest.error;
const completed = loadTest.completed;
const isRunning = loadTest.isRunning;
const elapsedTime = loadTest.elapsedTime;
const requestLog = loadTest.requestLog;

function handleStart() {
  loadTest.startTest(requestsCount.value, delayMs.value);
}

function handleStressStart() {
  loadTest.startStressTest(requestsCount.value, stressConcurrency.value);
}

function handleCancel() {
  loadTest.cancelTest();
}

function handleExport() {
  loadTest.exportLog();
}
</script>

<template>
  <div class="container">
    <h1 class="title-test">Нагрузочный тест (обычный режим)</h1>

    <div class="main-content">
      <div class="sidebar">
        <Controls
          v-model:requestsCount="requestsCount"
          v-model:delayMs="delayMs"
          v-model:stressConcurrency="stressConcurrency"
          :isRunning="isRunning"
          @start="handleStart"
        />

        <div class="buttons">
          <button @click="handleStart" :disabled="isRunning">Старт</button>
          <button @click="handleStressStart" :disabled="isRunning">Стресс-тест</button>
          <button @click="handleCancel" :disabled="!isRunning">Отмена</button>
          <button @click="handleExport">Экспорт логов</button>
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
