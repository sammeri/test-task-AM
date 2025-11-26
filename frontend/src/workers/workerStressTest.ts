interface TaskMessage {
  requestsCount: number;
  concurrency: number;
  totalItems: number;
  apiBase: string;
}

self.onmessage = async (e: MessageEvent<TaskMessage>) => {
  const { requestsCount, concurrency, totalItems, apiBase } = e.data;

  let index = 0;

  async function runWorker() {
    while (true) {
      const current = index++;
      if (current >= requestsCount) break;

      const randomId = Math.floor(Math.random() * totalItems) + 1;

      try {
        const res = await fetch(`${apiBase}/items/${randomId}`);
        const item = await res.json();
        postMessage({
          type: "success",
          id: item?.id ?? "N/A",
          time: performance.now(),
        });
      } catch {
        postMessage({
          type: "error",
          id: randomId,
          time: performance.now(),
        });
      }
    }
  }

  const workers: Promise<void>[] = [];
  for (let i = 0; i < Math.min(concurrency, requestsCount); i++) {
    workers.push(runWorker());
  }

  await Promise.all(workers);

  postMessage({ type: "done" });
};
