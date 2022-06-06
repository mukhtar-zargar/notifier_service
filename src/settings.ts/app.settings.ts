import dotenv from "dotenv";

dotenv.config();

export class AppSettings {
  public static readonly PORT = process.env.PORT || 3000;

  public static readonly JWT_SECRET = process.env.JWT_SECRET;

  public static readonly KAFKA_BROKER = process.env.KAFKA_BROKER;
  public static readonly KAFKA_SASL_USERNAME = process.env.KAFKA_SASL_USERNAME;
  public static readonly KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD;

  public static readonly REDIS_HOST = process.env.REDIS_HOST;
  public static readonly REDIS_PORT = process.env.REDIS_PORT;
  public static readonly REDIS_USERNAME = process.env.REDIS_USERNAME;
  public static readonly REDIS_PASSWORD = process.env.REDIS_PASSWORD;
  public static readonly REDIS_DEFAULT_DB = process.env.REDIS_DEFAULT_DB;
}
