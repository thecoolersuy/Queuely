import { Sequelize } from "sequelize";
import dotenv from "dotenv";


dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

export const db = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database connected successfully");
  } catch (e) {
    console.log("Database connection failed", e);
  }
};
