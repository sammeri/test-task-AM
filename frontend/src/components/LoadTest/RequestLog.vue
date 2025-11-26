<script setup lang="ts">
import { computed } from "vue";
import { useVirtualList } from "@vueuse/core";

interface LogItem {
  id: number | string;
  status: "success" | "error";
}

const props = defineProps<{
  requestLog: LogItem[];
}>();

const itemHeight = 24;

const {
  list: virtualList,
  containerProps,
  wrapperProps,
} = useVirtualList(
  computed(() => props.requestLog),
  { itemHeight }
);
</script>

<template>
  <div v-bind="containerProps" class="log-box" style="height: 300px; overflow-y: auto">
    <div v-bind="wrapperProps">
      <div
        v-for="item in virtualList"
        :key="item.index"
        class="virtual-item"
        :style="{ height: `${itemHeight}px` }"
      >
        id: {{ item.data.id }} —
        <span v-if="item.data.status === 'success'">✅</span>
        <span v-else>❌</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
