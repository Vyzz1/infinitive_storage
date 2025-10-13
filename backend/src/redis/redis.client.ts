import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';

const connectRedis = async () => {
  try {
    const redis = createClient({
      url: process.env.REDIS_URL,
      password: 'secret',
    });
    await redis.connect();
    console.log('Connected to Redis');
    const store = new RedisStore({ client: redis });
    return store;
  } catch (err) {
    console.error('Could not connect to Redis', err);
    return undefined;
  }
};

export default connectRedis;
