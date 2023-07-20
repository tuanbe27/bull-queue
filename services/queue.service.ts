import { Job, Queue, QueueOptions, Worker } from "bullmq";
import { JobType, Queues } from "../types";
import DefaultProcessor from "./processor.service";

export default class QueueService {
  private queues: Record<string, Queue> = {};
  private defaultQueue: Queue;
  private defaultQueueWorker: Worker;

  private static instance: QueueService;

  private static QUEUE_OPTIONS: QueueOptions = {
    defaultJobOptions: {
      removeOnComplete: false,
      removeOnFail: false,
    },
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  };

  constructor() {
    if (QueueService.instance instanceof QueueService) {
      return QueueService.instance;
    }

    this.queues = {};
    QueueService.instance = this;

    this.instantiateQueues();
    this.instantiateWorkers();
  }

  async instantiateQueues() {
    this.defaultQueue = new Queue(Queues.DEFAULT, QueueService.QUEUE_OPTIONS);
    this.queues[Queues.DEFAULT] = this.defaultQueue;
  }

  getQueue(name: Queues) {
    return this.queues[name];
  }

  async instantiateWorkers() {
    this.defaultQueueWorker = new Worker(
      Queues.DEFAULT,
      async (job: Job) => {
        switch (job.name) {
          case JobType.PROCESS_PAYMENT:
            await DefaultProcessor.processPayment(job);
            break;
        }
        console.log("[DEFAULT QUEUE] Worker for default queue");
      },
      { connection: QueueService.QUEUE_OPTIONS.connection }
    );

    this.defaultQueueWorker.on("completed", (job: Job, value) => {
      console.log(
        `[DEFAULT QUEUE] Completed job with data\n
              Data: ${job.asJSON().data}\n
              ID: ${job.id}\n
              Value: ${value}
            `
      );
    });

    this.defaultQueueWorker.on("failed", (job: Job | undefined, value) => {
      console.log("failed");
      if (job)
        console.log(
          `[DEFAULT QUEUE] Failed job with data\n
              Data: ${job.asJSON().data}\n
              ID: ${job.id}\n
              Value: ${value}
            `
        );
    });
  }
}
