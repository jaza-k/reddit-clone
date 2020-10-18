import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {

  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: 'date'})
  createdAt = new Date(); 

  @Field(() => String)
  @Property({ type:'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: 'text', unique: true })
  username!: string;

  // no field property as this is not exposed
  @Property({ type: 'text' }) // will be stored as a hash
  password!: string;

}