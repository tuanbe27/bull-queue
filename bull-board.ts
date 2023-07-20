import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import QueueService from "./services/queue.service";
import { createBullBoard } from "@bull-board/api";
import { Queues } from "./types";

const defaultQueue = new QueueService().getQueue(Queues.DEFAULT);

export const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/api/queues");

export const queueAdapter = new BullMQAdapter(defaultQueue, {
  allowRetries: true,
  readOnlyMode: true,
});

queueAdapter.setFormatter("name", (job) => `#Queue1 - ${job.name}`);

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [queueAdapter],
  serverAdapter: serverAdapter,
});
