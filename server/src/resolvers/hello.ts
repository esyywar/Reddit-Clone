import { Query, Resolver } from 'type-graphql'

@Resolver()

export class HelloResolver {
    @Query(type => String)
    hello() {
        return 'boom got em'
    }
}