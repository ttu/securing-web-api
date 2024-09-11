// For tests use shorter sleep time
const SLEEP_TIME = process.env.NODE_ENV === 'test' ? 1 : 50;

// Sleep is used to simulate a delay in the code execution
// E.g. DB query execution time, network latency, etc.
export const sleep = (sleepTimeMs: number = SLEEP_TIME) => new Promise((resolve) => setTimeout(resolve, sleepTimeMs));

export const blockingSleep = (sleepTimeMs: number = SLEEP_TIME) => {
  const start = Date.now();
  while (Date.now() < start + sleepTimeMs) {
    // Block the event loop
  }
};
