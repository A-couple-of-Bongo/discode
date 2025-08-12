import { dailyCronJob } from './daily';

export interface CronJob {
  name: string;
  schedule: string;
  callback: () => void;
};

export const jobs: CronJob[] = [dailyCronJob];
