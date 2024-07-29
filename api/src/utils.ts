const SLEEP_TIME = 5000;

export const sleep = (sleepTimeMs: number = SLEEP_TIME) => new Promise((resolve) => setTimeout(resolve, sleepTimeMs));

export const blockingSleep = (sleepTimeMs: number = SLEEP_TIME) => {
  const start = Date.now();
  while (Date.now() < start + sleepTimeMs) {
    // Block the event loop
  }
};
