export interface IRedisConfiguration {
  url?: string;
  username?: string;
  password?: string;
  name?: string;
  database?: number;
  legacyMode?: boolean;
}
