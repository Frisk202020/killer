import { db } from "@/db";
import { accounts } from "@/db/schema";
import { parse, verifyPwd } from "./util";
import { hash } from "@/db/data";

async function main() {
    const args = parse(["name", "pwd", "discord"]);
    if (args === null) return;
    if (!verifyPwd(args.pwd)) return;

    await db.insert(accounts).values({
        name: args.name, 
        pwd: await hash(args.pwd),
        admin: true,
        discord_id: args.discord
    });

    console.log(`Admin ${args.name} created successfully !`);
}

await main();