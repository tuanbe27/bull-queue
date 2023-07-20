import express, { Express, Request, Response } from "express";
import { queueAdapter, serverAdapter } from "./bull-board";
import QueueService from "./services/queue.service";
import { JobType, ProcessPaymentRequest, Queues } from "./types";

const app: Express = express();
const port = 3000;
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post(
  "/api/process-payment",
  (request: Request<any, any, ProcessPaymentRequest>, response: Response) => {
    const { cardNumber, cvv, cardExpiry } = request.body;
    const queue = new QueueService().getQueue(Queues.DEFAULT);

    // add job to queue
    queue.add(JobType.PROCESS_PAYMENT, { cardNumber, cvv, cardExpiry });

    return response
      .status(200)
      .json({
        message: "Card charge in progress, you will be notified once complete",
      })
      .end();
  }
);

app.use("/api/queues", serverAdapter.getRouter());

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
