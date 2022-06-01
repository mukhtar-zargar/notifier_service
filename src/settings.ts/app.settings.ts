import dotenv from "dotenv";

dotenv.config();

export class AppSettings {
  public static readonly PORT = process.env.PORT || 3000;
  
  public static readonly JWT_SECRET = process.env.JWT_SECRET;
}
