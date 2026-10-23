/**
 * @brief Create an admin which have all rights over the application (can access all API routes, thus having total control over the database)
 * @params
 *     NAME : display name for the admin
 *     DISCORD_ID : discord user id, used for the bot to DM users
 *     PWD : the admin's password 
 */

import { db } from "@/db";
import { hash } from "@/db/data";
import { accounts } from "@/db/schema";

const NAME = "Frisk";
const DISCORD_ID = "frisk2824";
const PWD = "perdu";

await db.insert(accounts).values({
    name: NAME, 
    pwd: await hash(PWD),
    admin: true,
    discord_id: DISCORD_ID
});

console.log(`Admin ${NAME} created successfully !`);