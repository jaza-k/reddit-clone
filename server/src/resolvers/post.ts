import { Post } from "../entities/Post";
import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    // return type is explicitly stated (Promise <Post[]>) to add type checking
    posts(@Ctx() { em }: MyContext): Promise <Post[]> {
        return em.find(Post, {});
    }

    @Query( () => Post, { nullable: true } )
    // return type is explicitly stated (Promise <Post[]>) to add type checking
    post(
        @Arg("id") id: number, 
        @Ctx() { em }: MyContext
    ): Promise <Post | null> {
        return em.findOne(Post, { id });
    }

    @Mutation( () => Post)
    async createPost(
        @Arg("title") title: string, 
        @Ctx() { em }: MyContext
    ): Promise <Post> {
        const post = em.create(Post, {title})
        await em.persistAndFlush(post)
        return post;
    }
}