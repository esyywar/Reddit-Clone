import { FieldError } from "../generated/graphql";

export function errorToMap(errArray: Array<FieldError>) {
    let errMap: Record<string, string> = {}

    errArray.forEach(({field, message}) => {
        errMap[field] = message
    })

    return errMap
}