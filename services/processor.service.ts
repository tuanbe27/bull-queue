import { Job } from "bullmq";
import { Queues } from "../types";
import QueueService from "./queue.service";

export default class DefaultProcessor {
  static async processPayment(job: Job) {
    const queue = new QueueService().getQueue(Queues.DEFAULT);
    if (!queue) return;
    console.log(
      `Process job with id ${job.id} from the ${Queues.DEFAULT} queue`
    );
  }
}
