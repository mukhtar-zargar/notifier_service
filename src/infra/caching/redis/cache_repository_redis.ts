import { injectable } from "inversify";
import { createClient, RedisClientType } from "redis";

import { ICacheRepository } from "../../../domain/ports/caching/cache_repository_interface";
import { IRedisConfiguration } from "./configuration";

@injectable()
export class CacheRedisRepository implements ICacheRepository {
  private readonly _redisClient: RedisClientType;

  constructor(config: IRedisConfiguration) {
    this._redisClient = createClient({
      url: config.url
    });
  }

  connect(): void {
    this._redisClient.connect();
  }
  disconnect(): void {
    this._redisClient.disconnect();
  }

  changeDb(dbNo: number): void {
    this._redisClient.select(dbNo);
  }

  async count(key: string): Promise<number> {
    const allKeys = await this._redisClient.keys(key);
    return allKeys.length;
  }

  async exists(key: string): Promise<boolean> {
    const r = await this.count(key);

    return r >= 1 ? true : false;
  }

  async getOne(key: string): Promise<string> {
    const r = await this._redisClient.get(key);

    console.log("getOne Redis Res", r);
    return r;
  }

  async setOne(key: string, value: any, ttl?: number): Promise<void> {
    const r = await this._redisClient.set(key, value, {
      EX: ttl,
      NX: true
    });
    console.log("setOne Redis Res", r);
  }

  async deleteOne(key: string): Promise<number> {
    const r = await this._redisClient.del(key);
    console.log("deleteOne Redis Res", r);
    return r;
  }

  async addToSet(key: string, value: any): Promise<number> {
    const r = await this._redisClient.sAdd(key, value);
    console.log("addToSet Redis Res", r);
    return r;
  }

  async existsInSet(key: string, value: any): Promise<boolean> {
    const r = await this._redisClient.sIsMember(key, value);
    console.log("existsInSet Redis Res", r);
    return r;
  }

  async getSetMembers(key: string): Promise<string[]> {
    const r = await this._redisClient.sMembers(key);
    console.log("getSetMembers Redis Res", r);
    return r;
  }

  async deleteSetMember(key: string, value: any): Promise<number> {
    const r = await this._redisClient.sRem(key, value);
    console.log("deleteSetMember Redis Res", r);
    return r;
  }
}
