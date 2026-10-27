import { redirect } from "next/navigation";
import { authenticate } from "./api/authenticate";

export default async function Page() {
    const user = await authenticate();

    switch(user?.admin) {
        case true: redirect("/admin");
        case false: redirect("/home");
        default: redirect("/login");
    }
}