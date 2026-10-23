import { db } from "@/db";
import { parse, verifyPwd } from "./util";
import { accounts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { hash } from "@/db/data";

async function main() {
    const args = parse(["name"], ["pwd", "discord"]);
    if (args === null) return;

    const admin = (await db.select().from(accounts).where(and(
        eq(accounts.admin, true),
        eq(accounts.name, args.name)
    )))[0];

    if (admin === undefined) {
        console.log(`Admin ${admin} not found !`);
        return;
    }

    if (args.pwd !== undefined && verifyPwd(args.pwd)) admin.pwd = await hash(args.pwd);
    if (args.discord !== undefined) admin.discord_id = args.discord;

    await db.update(accounts).set(admin).where(eq(accounts.id, admin.id));
    console.log("Finished update");
}

await main();