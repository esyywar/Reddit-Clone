import dotenv from 'dotenv'

/* Read config values from .env file */
const config = dotenv.config()

if (config.error) {
    throw config.error
}

export const __prod = process.env.NODE_ENV === "production"