import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver],
            validate: false
        }),
        // special object that is accessible by all our objects
        context: () => ({ em: orm.em }) // pass in em object
    });

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("Express is listening on port 4000...")
    });
}

main().catch((err) => {
    console.error(err);
});