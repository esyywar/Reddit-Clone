"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants = __importStar(require("./constants"));
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const redis_1 = __importDefault(require("redis"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    /* Initialize ORM for postgresql database */
    const orm = yield core_1.MikroORM.init(mikro_orm_config_1.default);
    yield orm.getMigrator().up();
    /* Connect to redis server */
    const redis_client = redis_1.default.createClient({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: String(process.env.REDIS_PASSWORD)
    });
    /* Create redis-connect session storage in server cache */
    const RedisStore = connect_redis_1.default(express_session_1.default);
    /* Initialize express app */
    const app = express_1.default();
    /* CORS validation middleware */
    app.use(cors_1.default({
        origin: "http://localhost:5000",
        credentials: true
    }));
    /* Create session middleware */
    app.use(express_session_1.default({
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
    }));
    console.log("Redis session db connected!");
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [hello_1.HelloResolver, post_1.PostResolver, user_1.UserResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res })
    });
    /* CORS validation used in express-cors middleware so not needed here */
    apolloServer.applyMiddleware({
        app,
        cors: false
    });
    app.get('/', (req, res) => {
        res.send("Welcome to home route!");
    });
    const PORT = constants.__prod ? process.env.PORT : 5000;
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}!`);
    });
});
main().catch(err => console.log(err));
