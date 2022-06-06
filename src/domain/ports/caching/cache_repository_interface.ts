/**
 * Caching contract
 */
export interface ICacheRepository {
  connect(): void;
  disconnect(): void;
  changeDb(dbNo: number): void;
  count(key: string): Promise<number>;
  exists(key: string): Promise<boolean>;
  getOne(key: string): Promise<string>;
  setOne(key: string, value: any, ttl?: number, db?: number): Promise<void>;
  deleteOne(key: string, db?: number): Promise<number>;
  addToSet(key: string, value: any, db?: number): Promise<number>;
  existsInSet(key: string, value: any, db?: number): Promise<boolean>;
  getSetMembers(key: string, db?: number): Promise<string[]>;
  deleteSetMember(key: string, value: any, db?: number): Promise<number>;
}
