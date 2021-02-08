import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { Post } from '../entities/Post'

import { MyContext } from '../types'

@Resolver()
export class PostResolver {
    @Query(type => [Post])
    allPosts(
        @Ctx() { em }: MyContext
    ): Promise<Post[]> {
        return em.find(Post, {})
    }

    @Query(type => Post, { nullable: true })
    postById(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        return em.findOne(Post, { id: id })
    }

    @Mutation(type => Post)
    async createPost(
        @Arg('title') title: string ,
        @Ctx() { em }: MyContext
    ): Promise<Post> {
        const post = em.create(Post, {title})
        await em.persistAndFlush(post)
        return post
    }

    @Mutation(type => Post, { nullable: true })
    async updatePost(
        @Arg('id') id: number,
        @Arg('title') newTitle: string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, {id})

        if (!post) {
            return null
        }

        post.title = newTitle
        await em.persistAndFlush(post)
        return post
    }

    @Mutation(type => Post, { nullable: true})
    async deletePost(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, {id})

        if (!post) {
            return null
        }

        await em.removeAndFlush(post)
        return post
    }
}