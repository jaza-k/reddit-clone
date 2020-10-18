import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType, Int } from "type-graphql";

// class is both an ObjectType and Entity (decorators can be stacked)
@ObjectType()
@Entity()
export class Post  {

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
  @Property({ type: 'text' })
  title!: string;

}