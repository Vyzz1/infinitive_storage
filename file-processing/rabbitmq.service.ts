import amqp, { type ConsumeMessage } from "amqplib";
import { FileProcessor } from "./file.process";

export class RabbitMQService {
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;
  private queueName: string;
  private rabbitmqUrl: string;
  private exchangeName: string;

  constructor() {
    this.queueName = process.env.RABBITMQ_QUEUE_NAME as string;
    this.rabbitmqUrl = process.env.RABBIT_URI as string;
    this.exchangeName = process.env.RABBITMQ_EXCHANGE_NAME as string;
  }

  async connect(): Promise<void> {
    try {
      console.log("Connecting to RabbitMQ...");

      this.connection = await amqp.connect(this.rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue(this.queueName, { durable: true });
      await this.channel.assertExchange(this.exchangeName, "topic", {
        durable: true,
      });
      await this.channel.bindQueue(
        this.queueName,
        this.exchangeName,
        "thumbnail.generate"
      );

      await this.channel.assertQueue(this.queueName, {
        durable: true,
      });

      console.log("Connected to RabbitMQ successfully");
      console.log(` Queue "${this.queueName}" is ready`);
    } catch (error) {
      console.error(" Failed to connect to RabbitMQ:", error);
      throw error;
    }
  }

  async startConsuming(): Promise<void> {
    if (!this.channel) {
      throw new Error(
        "RabbitMQ channel is not initialized. Call connect() first."
      );
    }

    try {
      await this.channel.prefetch(1);

      await this.channel.consume(
        this.queueName,
        this.handleMessage.bind(this),
        {
          noAck: false,
        }
      );

      console.log(`Listening for messages on queue: ${this.queueName}`);
    } catch (error) {
      console.error(" Failed to start consuming messages:", error);
      throw error;
    }
  }

  private async handleMessage(msg: ConsumeMessage | null): Promise<void> {
    if (!msg) {
      console.log("Received null message");
      return;
    }

    if (!this.channel) {
      console.error(" Channel is not available");
      return;
    }

    try {
      const messageContent = msg.content.toString();

      const fileProcessor = new FileProcessor();

      const fileData = JSON.parse(messageContent);

      const thumbnailUrl = await fileProcessor.processThumbnailTask(fileData);

      console.log(" Generated thumbnail URL:", thumbnailUrl);
      const resultPayload = {
        id: fileData.id,

        thumbnailUrl,
      };

      const published = this.channel.publish(
        this.exchangeName,

        "docs.thumbnail.created",

        Buffer.from(JSON.stringify(resultPayload)),

        { persistent: true }
      );

      console.log(
        `[🐇 Publish Debug] Exchange=${this.exchangeName} | RoutingKey=docs.thumbnail.created | Success=${published}`
      );

      this.channel.ack(msg);

      console.log(" Message processed successfully");
    } catch (error) {
      this.channel.ack(msg);
      console.error(" Error processing message:", error);
    }
  }

  isConnected(): boolean {
    return this.connection !== null && this.channel !== null;
  }
}
