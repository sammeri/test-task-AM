<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  sent: number;
  success: number;
  error: number;
  completed: number;
  elapsedTime: number;
  isRunning: boolean;
}>();
</script>

<template>
  <div class="stats" v-if="isRunning || completed > 0">
    <p>Отправлено: {{ sent }}</p>
    <p>Успешно: {{ success }}</p>
    <p>Ошибки: {{ error }}</p>
    <p>Время выполнения: {{ elapsedTime }} с</p>
  </div>
</template>
