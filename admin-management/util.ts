const REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export function verifyPwd(pwd: string): boolean {
    if (!REGEX.test(pwd)) {
        console.log("Password refused. Admins require a secure password, which has at least 8 characters with one lowercase and one uppercase, one number and one special character");
        return false;
    }

    return true;
}

export function parse(required: string[], optional: string[] = []): any|null {
    const req = new Set(required);
    const opt = new Set(optional);
    const res: any = {};

    for (const arg of process.argv) {
        const [k, v] = arg.split("=");
        if (v === undefined) continue;

        if (req.has(k)) {
            req.delete(k);
            res[k] = v;
        } else if (opt.has(k)) {
            res[k] = v;
        } 
    }

    if (req.size > 0) {
        console.log(`Missing arguments : ${required.join(", ")}`);
        return null;
    }

    return res;
}