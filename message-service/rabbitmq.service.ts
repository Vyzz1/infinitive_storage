import amqp, { type ConsumeMessage } from "amqplib";
import mailer from "./mailer";

export class RabbitMQService {
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;
  private queueName: string;
  private rabbitmqUrl: string;
  private exchangeName: string;

  constructor() {
    this.queueName = process.env.RABBITMQ_QUEUE_NAME || "welcome_emails";
    this.rabbitmqUrl = process.env.RABBIT_URI || "amqp://localhost:5672";
    this.exchangeName =
      process.env.RABBITMQ_EXCHANGE_NAME || "welcome_exchange";
  }

  async connect(): Promise<void> {
    try {
      console.log("Connecting to RabbitMQ...");

      this.connection = await amqp.connect(this.rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue(this.queueName, { durable: true });
      await this.channel.assertExchange(this.exchangeName, "direct", {
        durable: true,
      });
      await this.channel.bindQueue(
        this.queueName,
        this.exchangeName,
        "welcome"
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
      console.log(" Received message:", messageContent);

      const emailData = JSON.parse(messageContent);

      await mailer.sendMail(
        emailData.email,
        "Welcome to Our Service",
        "welcome-email",
        { name: emailData.name, appName: "Infinite Storage" }
      );

      this.channel.ack(msg);

      console.log(" Message processed successfully");
    } catch (error) {
      console.error(" Error processing message:", error);

      if (this.channel) {
        this.channel.nack(msg, false, true);
      }
    }
  }

  isConnected(): boolean {
    return this.connection !== null && this.channel !== null;
  }
}
