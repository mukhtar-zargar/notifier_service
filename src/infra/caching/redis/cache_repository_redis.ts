import { injectable } from "inversify";
import { createClient, RedisClientType } from "redis";

import { ICacheRepository, ICacheRepositoryOptions } from "../../../domain/ports/caching/cache_repository_interface";
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

  /**
   * Note: It handles only set and string redis data types for now
   * @param type Type of data
   * @returns All values of that data type
   */
  async getTypedValues(type: string, options: ICacheRepositoryOptions): Promise<string[]> {
    let result = [];
    let cursor = 0;

    do {
      const res = await this._redisClient.scan(cursor, { TYPE: type });
      cursor = res.cursor;

      result = result.concat(res.keys);
    } while (cursor !== 0);

    let values = [];

    if (result.length === 0) {
      return values;
    }

    result = result.filter((el) => !options?.exclude?.includes(el));

    if (type === "set") {
      for (let item of result) {
        const tempValues = await this.getSetMembers(item);
        values = values.concat(tempValues);
      }
    } else {
      const tempValues = await this._redisClient.mGet(result);
      values = values.concat(tempValues);
    }

    return values;
  }

  async exists(key: string): Promise<boolean> {
    const r = await this.count(key);

    return r >= 1 ? true : false;
  }

  getOne(key: string): Promise<string> {
    return this._redisClient.get(key);
  }

  setOne(key: string, value: any, ttl?: number): void {
    this._redisClient.set(key, value, {
      EX: ttl,
      NX: true
    });
  }

  deleteOne(key: string): Promise<number> {
    return this._redisClient.del(key);
  }

  addToSet(key: string, value: any): Promise<number> {
    return this._redisClient.sAdd(key, value);
  }

  existsInSet(key: string, value: any): Promise<boolean> {
    return this._redisClient.sIsMember(key, value);
  }

  getSetMembers(key: string): Promise<string[]> {
    return this._redisClient.sMembers(key);
  }

  deleteSetMember(key: string, value: any): Promise<number> {
    return this._redisClient.sRem(key, value);
  }
}
