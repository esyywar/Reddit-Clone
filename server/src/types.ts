import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

import { Request, Response } from "express"

import session from "express-session";

export interface sessionData {
    userId?: number
} 

export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>,
    req: Request & {session: session.Session & Partial<session.SessionData & sessionData>},
    res: Response
}