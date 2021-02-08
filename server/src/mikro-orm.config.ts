import { MikroORM } from '@mikro-orm/core'
import { __prod } from './constants'
import path from "path"
import { Post } from './entities/Post'
import { User } from './entities/User'

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    },
    entities: [Post, User],
    dbName: process.env.DB_NAME,
    type: 'postgresql',
    clientUrl: process.env.POSTGRE_SQL_URL,
    password: process.env.DB_PASSWORD,
    debug: !__prod,
} as Parameters<typeof MikroORM.init>[0]