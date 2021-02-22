import * as constants from "./constants"

import { MikroORM } from "@mikro-orm/core"
import microConfig from "./mikro-orm.config"

import redis from "redis"

import express from "express"

import cors from "cors"

import session from "express-session"
import connectRedis from "connect-redis"

import { ApolloServer } from "apollo-server-express"

import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"

import { MyContext } from "./types"

const main = async () => {
    /* Initialize ORM for postgresql database */
    const orm = await MikroORM.init(microConfig)

    await orm.getMigrator().up()

    /* Connect to redis server */
    const redis_client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: String(process.env.REDIS_PASSWORD)
    })

    /* Create redis-connect session storage in server cache */
    const RedisStore = connectRedis(session)

    /* Initialize express app */
    const app = express()

    /* CORS validation middleware */
    app.use(cors({
        origin: "http://localhost:5000",
        credentials: true
    }))

    /* Create session middleware */
    app.use(session({
        name: "sid",
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 12,
            sameSite: "lax",
            secure: constants.__prod
        },
        store: new RedisStore({ 
            client: redis_client,
            disableTouch: false
        }),
        secret: String(process.env.SESSION_SECRET),
        resave: false,
        saveUninitialized: false
    })) 

    console.log("Redis session db connected!")

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    })

    /* CORS validation used in express-cors middleware so not needed here */
    apolloServer.applyMiddleware({ 
        app, 
        cors: false 
    })

    app.get('/', (req, res) => {
        res.send("Welcome to home route!")
    })

    const PORT = constants.__prod ? process.env.PORT : 5000

    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}!`)
    })
}

main().catch(err => console.log(err))