import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from "./types";

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up(); // automatically runs on server restart

    const app = express();

    /* connect-redis API placed here in order for session 
    middleware to run before apollo middleware */
    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    app.use(
     session({
            name: "qid",
            // tell express-session we're using Redis
            store: new RedisStore({ 
                client: redisClient,
                disableTouch: true // results in less requests going out to Redis
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: "lax", // prevent CSRF attacks 
                secure: __prod__ // determine if cookie only works in https
            },
            saveUninitialized: false, // avoid creating empty sessions w/ no data
            secret: "qweklemfkwlsfmasfqwqokiouj",
            resave: false, // ensure that it's not continuing to ping Redis
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false
        }),
        // special object that is accessible by all our objects
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    });

    // allow Apollo to internally configure various middleware
    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("Express is listening on port 4000...")
    });
}

main().catch((err) => {
    console.error(err);
});