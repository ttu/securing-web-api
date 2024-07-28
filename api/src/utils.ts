const SLEEP_TIME = 5000;

export const sleep = (sleepTimeMs: number = SLEEP_TIME) => new Promise((resolve) => setTimeout(resolve, sleepTimeMs));
