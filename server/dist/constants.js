"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.__prod = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
/* Read config values from .env file */
const config = dotenv_1.default.config();
if (config.error) {
    throw config.error;
}
exports.__prod = process.env.NODE_ENV === "production";
