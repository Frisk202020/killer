import { type ClientError, Severity, Unauthorized } from "../client-errors";

export default function client_error(status: number, page_code: string): ClientError {
    switch(status) {
        case 401: return Unauthorized;
        case 404: return { severity: Severity.Error, text: "Ce joueur n'existe pas" };
        case 409: return { severity: Severity.Warn, text: "Vous ou votre adversaire n'avez plus de jetons d'arène" };
        default: return { severity: Severity.Error, text: `[${page_code}] Une erreur interne est survenue` };
    }
}