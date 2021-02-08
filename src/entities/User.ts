import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
    @Field(type => ID)
    @PrimaryKey({ type: 'number' })
    id!: number

    @Field(type => String)
    @Property({ type: 'date' })
    createdAt = new Date()

    @Field(type => String)
    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date()

    @Field(type => String)
    @Property({ type: 'string', unique: true })
    username!: string

    @Property({ type: 'string' })
    password!: string
}