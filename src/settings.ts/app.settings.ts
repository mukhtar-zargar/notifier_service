import dotenv from "dotenv";

dotenv.config();

export class AppSettings {
  public static readonly PORT = process.env.PORT || 3000;

  public static readonly JWT_SECRET = process.env.JWT_SECRET;

  public static readonly KAFKA_BROKER = process.env.KAFKA_BROKER;
  public static readonly KAFKA_SASL_USERNAME = process.env.KAFKA_SASL_USERNAME;
  public static readonly KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD;
}
