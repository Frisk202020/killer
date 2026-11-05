export enum Severity {
    Warn,
    Error,
    Unauthorized
}

export interface ClientError {
    text: string,
    severity: Severity
}

export const Unauthorized: ClientError = { severity: Severity.Unauthorized, text: "" };