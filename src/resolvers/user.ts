import { User } from "../entities/User";
import { Resolver, Mutation, Arg, InputType, Field, Ctx, ObjectType } from "type-graphql";
import { MyContext } from "src/types";
import argon2 from "argon2";

// reusable inputs defined here
@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

// reusable field error object
@ObjectType()
class FieldError {
    @Field()
    field: string

    @Field()
    message: string
}

// return user if exists or return error
@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]; // creating the error type
    
    @Field(() => User, { nullable: true })
    user?: User; // the user type
}

@Resolver()
export class UserResolver {
    // register function (returns User)
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext 
    ): Promise <UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [{
                    field: "Username",
                    message: "Length must be greater than 2"
                }],
            };
        }
        if (options.password.length <= 3) {
            return {
                errors: [{
                    field: "Password",
                    message: "Length must be greater than 3"
                }],
            };
        }

        const hashedPassword = await argon2.hash(options.password); // hash the plain text password using argon2
        const user = em.create(User, {
            username: options.username, 
            password: hashedPassword 
        });

        try {
            await em.persistAndFlush(user);
        } catch(err) {
            // duplicate user error
            if (err.code === "23505" || err.detail.includes("already exists")) {
                return {
                    errors: [{
                        field: "Username",
                        message: "Username taken"
                    }],
                };
            }
            console.log("message: ", err.message);
        }

        return { user };
    }

    // login function (returns UserResponse object above)
    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext 
    ): Promise <UserResponse> {
        const user = await em.findOne(User, { username: options.username })
        // if user is not found
        if (!user) {
            return {
                errors: [{
                    field: "Username",
                    message: "Username doesn't exist"
                }],
            };
        }
        const valid = await argon2.verify(user.password, options.password);
        // if password cannot be validated
        if (!valid){
            return {
                errors: [{
                    field: "Password",
                    message: "Incorrect password"
                }],
            };
        }
        return { user };
    }
}