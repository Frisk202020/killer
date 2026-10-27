import { db } from "@/db";
import { accounts, invitations } from "@/db/schema";
import { eq } from "drizzle-orm";
import Invalid from "./invalid";
import Content from "./content";

export const instant = false;

export default async function Welcome({ params } : { 
    params: Promise<{ token: string }>
}) {
    const { token } = await params;
    const invite = (await db.select().from(invitations).where(eq(invitations.token, token)))[0];
    if (invite === undefined) {
        return <Invalid></Invalid>
    }

    const account = (await db.select().from(accounts).where(eq(accounts.id, invite.id)))[0];
    if (account === undefined) {
        return <Invalid></Invalid>
    }

    return <Content name={account.name} token={token}></Content>
}