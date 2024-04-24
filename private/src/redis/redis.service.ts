import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { REDIS_CLIENT, RedisClient } from './redis.client.type';
import { SetRedisValueDto } from './dto/set-redis.dto';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {}

  onModuleDestroy() {
    this.redisClient.quit();
  }

  public async getClient(): Promise<RedisClient> {
    return this.redisClient;
  }

  ping() {
    return this.redisClient.ping();
  }

  async set(setRedisValueDto: SetRedisValueDto) {
    const { key, value } = setRedisValueDto;
    await this.redisClient.set(key, value, { EX: 10 });
    return 'Success';
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.redisClient.exists(key)) === 1;
  }

  async del(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }
}
