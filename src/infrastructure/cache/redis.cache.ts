import { createClient } from 'redis';
import { ENV } from '../../config/env.config';

export class RedisCache {
  private client = createClient({
    socket: { host: ENV.REDIS_HOST, port: Number(ENV.REDIS_PORT) },
  });

  constructor() {
    this.client.connect();
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    await this.client.setEx(key, ttl, value);
  }
}
