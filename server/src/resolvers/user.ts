import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql'

import { User } from '../entities/User'

import { MyContext } from '../types'

import argon2 from 'argon2'

@InputType()
class loginInfo {
    @Field(type => String)
    username!: string

    @Field(type => String)
    password!: string
}

@ObjectType()
class FieldError {
    @Field(type => String)
    field!: string

    @Field(type => String)
    message!: string
}

@ObjectType()
class UserResponse {
    @Field(type => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(type => User, { nullable: true })
    user?: User
}

@Resolver()
export class UserResolver {
    /* Check current cookie for valid user id */
    @Query(type => User, { nullable: true })
    async getMe(
        @Ctx() { em, req }: MyContext
    ): Promise<User | null> {
        if (!req.session.userId) {
            return null
        }

        const user = await em.findOne(User, { id: req.session.userId })

        return user
    }

    /* Return all users in database (w/o the encrypted passwords) */
    @Query(type => [User])
    getUsers(
        @Ctx() { em }: MyContext
    ): Promise<User[]> {
        const users = em.find(User, {})

        return users
    }

    /* Register user in the databse */
    @Mutation(type => UserResponse)
    async registerUser(
        @Arg('loginInfo') loginInfo: loginInfo,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {

        const hash = await argon2.hash(loginInfo.password) 

        /* Check that username is not already taken */
        const isTaken = await em.find(User, { username: loginInfo.username })

        /* If we do not get back em empty array -> ie. user already exists */
        if (isTaken.length) {
            return {
                errors: [{
                    field: "username",
                    message: "This username is already taken!"
                }]
            }
        }

        const user = em.create(User, { 
            username: loginInfo.username,
            password: hash
        })

        await em.persistAndFlush(user)

        req.session.userId = user.id

        return { user } 
    }

    /* Check user credentials, login, set cookie */
    @Query(type => UserResponse)
    async loginUser(
        @Arg('loginInfo') loginInfo: loginInfo,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        /* Check if username is of valid length */
        if (loginInfo.username.length < 3) {
            return {
                errors: [{
                    field: "username",
                    message: "Username length is invalid!"
                }]
            }
        }
        else if (loginInfo.password.length < 8) {
            return {
                errors: [{
                    field: "password",
                    message: "Password length is invalid!"
                }]
            }
        }

        const user = await em.findOne(User, {username: loginInfo.username})

        /* Check if user found in database */
        if (!user) {
            return {
                errors: [{
                    field: "username", 
                    message: "User not found!"
                }]
            }
        }

        /* Check password match */
        const valid = await argon2.verify(user.password, loginInfo.password)

        if (!valid) {
            return {
                errors: [{
                    field: "password",
                    message: "Invalid login credentials!"
                }]   
            }
        }

        req.session.userId = user.id

        return { user }
    }
}