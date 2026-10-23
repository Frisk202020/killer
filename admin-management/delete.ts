import { db } from "@/db";
import { accounts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { parse } from "./util";

async function main() {
    const args = parse(["name"]);
    if (args === null) return;

    await db.delete(accounts).where(and(eq(accounts.name, args.name), eq(accounts.admin, true)));
}

await main();