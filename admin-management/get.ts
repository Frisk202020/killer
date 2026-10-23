import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";

const admins = await db.select({name: accounts.name, discord_id: accounts.discord_id}).from(accounts).where(eq(accounts.admin, true));
if (admins.length === 0) {
    console.log("No admins");
} else {
    const display = admins.map((x) => `${x.name} (${x.discord_id})`).join("\n");
    console.log(`Admins :\n${display}`);
}