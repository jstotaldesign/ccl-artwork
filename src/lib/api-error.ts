/**
 * Typed API errors. Throw inside route handlers; api-middleware catches and
 * renders a stable JSON shape: { error: { code, message, fields? } }
 *
 * Use the `code` (machine-readable) on the client — translate via i18n.
 * Never send hardcoded human language from server.
 */

export class ApiError extends Error {
  status: number;
  code: string;
  fields?: Record<string, string>;

  constructor(status: number, code: string, message?: string, fields?: Record<string, string>) {
    super(message ?? code);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const badRequest = (code: string, fields?: Record<string, string>) =>
  new ApiError(400, code, undefined, fields);

export const unauthorized = (code = "unauthorized") => new ApiError(401, code);

export const forbidden = (code = "forbidden") => new ApiError(403, code);

export const notFound = (code = "not_found") => new ApiError(404, code);

export const conflict = (code: string) => new ApiError(409, code);

export const tooManyRequests = (code = "rate_limited") => new ApiError(429, code);

export const serverError = (code = "internal_error") => new ApiError(500, code);
