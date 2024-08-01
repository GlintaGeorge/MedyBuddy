"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const configKeys = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
    MONGO_DB_URL: process.env.MONGO_URI,
    CLIENT_PORT: process.env.CLIENT_PORT,
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    APP_EMAIL: process.env.APP_EMAIL,
    APP_PASSWORD: process.env.APP_PASSWORD,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};
exports.default = configKeys;
