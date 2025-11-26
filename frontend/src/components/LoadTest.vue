<script setup lang="ts">
import { ref } from "vue";
import RegularTest from "./RegularTest.vue";
import WorkerLoadTest from "./WorkerLoadTest.vue";

const mode = ref<"regular" | "worker">("regular");
</script>

<template>
  <div class="container">
    <h1 class="title">Нагрузочное тестирование</h1>

    <div class="mode-switcher">
      <button @click="mode = 'regular'" :class="{ active: mode === 'regular' }">
        Обычный тест
      </button>

      <button @click="mode = 'worker'" :class="{ active: mode === 'worker' }">
        Web Worker Test
      </button>
    </div>

    <div class="test-body">
      <RegularTest v-if="mode === 'regular'" />
      <WorkerLoadTest v-if="mode === 'worker'" />
    </div>
  </div>
</template>

<style scoped>
.mode-switcher button.active {
  background: #42b883;
  color: white;
}
.mode-switcher button {
  margin-right: 10px;
  padding: 8px 14px;
}
</style>
