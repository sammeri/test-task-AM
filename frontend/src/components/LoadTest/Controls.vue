<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps<{
  requestsCount: number;
  delayMs: number;
  stressConcurrency: number;
  isRunning: boolean;
}>();

const emit = defineEmits<{
  (e: "update:requestsCount", value: number): void;
  (e: "update:delayMs", value: number): void;
  (e: "update:stressConcurrency", value: number): void;
  (e: "start"): void;
}>();

const localRequestsCount = ref(props.requestsCount);
const localDelayMs = ref(props.delayMs);
const localStressConcurrency = ref(props.stressConcurrency);

watch(localRequestsCount, (val) => emit("update:requestsCount", val));
watch(localDelayMs, (val) => emit("update:delayMs", val));
watch(localStressConcurrency, (val) => emit("update:stressConcurrency", val));
</script>

<template>
  <div class="controls">
    <div class="form">
      <label>
        Кол-во запросов:
        <input type="number" v-model.number="localRequestsCount" min="1" />
      </label>
      <label>
        Задержка (мс):
        <input type="number" v-model.number="localDelayMs" min="0" />
      </label>
      <label>
        Конкуренция (стресс-тест):
        <input type="number" v-model.number="localStressConcurrency" min="1" />
      </label>
    </div>
  </div>
</template>
