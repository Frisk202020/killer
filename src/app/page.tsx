import { redirect } from "next/navigation";
import { authenticate } from "./api/authenticate";
import { connection } from "next/server";

export const instant = false;

export default async function Page() {
    await connection();
    const user = await authenticate();

    switch(user?.admin) {
        case true: redirect("/admin");
        case false: redirect("/home");
        default: redirect("/login");
    }
}