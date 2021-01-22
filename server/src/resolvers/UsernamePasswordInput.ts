import { InputType, Field } from "type-graphql";

// reusable inputs defined here
@InputType()
export class UsernamePasswordInput {
    @Field()
    email: string;
    @Field()
    username: string;
    @Field()
    password: string;
}
