import dotenv from "dotenv";
dotenv.config();
import { RabbitMQService } from "./rabbitmq.service";

class MessageWorker {
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.rabbitMQService = new RabbitMQService();
  }

  async start(): Promise<void> {
    try {
      console.log("Starting Message Service Worker...");

      await this.rabbitMQService.connect();

      await this.rabbitMQService.startConsuming();

      console.log(" Message Service Worker is running");
    } catch (error) {
      process.exit(1);
    }
  }
}

const worker = new MessageWorker();
worker.start().catch((error) => {
  console.error("Fatal error starting worker:", error);
  process.exit(1);
});
