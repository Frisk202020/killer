import { db } from "@/db";
import { accounts, sessions } from "@/db/schema";
import { eq, lt } from "drizzle-orm";
import { cookies } from "next/headers";

export interface User {
    account_id: number,
    player_id: number|null,
    admin: boolean
}

export async function authenticate(): Promise<User|null> {
    await db.delete(sessions).where(lt(sessions.expires, new Date(Date.now())));

    const store = await cookies();
    const token = store.get("session")?.value;
    if (token === undefined) return null;

    const data = (await db.select().from(sessions).where(eq(sessions.token, token)).innerJoin(accounts, eq(accounts.id, sessions.account)))[0];
    if (data === undefined) return null;

    return {
        account_id: data.accounts.id,
        player_id: data.accounts.player_id,
        admin: data.accounts.admin === true
    };
}
 
export const assertAuthorized = (user: User, ...authorizedPlayers: number[]) => 
    user.admin || 
    user.player_id !== null && authorizedPlayers.indexOf(user.player_id) !== -1;