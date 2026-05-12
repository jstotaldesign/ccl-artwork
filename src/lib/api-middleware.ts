/**
 * Standard API response + error envelope.
 *
 * Use withApi() to wrap a route handler — it catches ApiError and renders
 * the standard JSON shape: { error: { code, message, fields? } }
 *
 * Use apiResponse() to return success with optional pagination headers.
 */

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./api-error";

type ApiHandler<TParams> = (
  req: NextRequest,
  ctx: { params: Promise<TParams> },
) => Promise<NextResponse> | NextResponse;

export function withApi<TParams = Record<string, string>>(handler: ApiHandler<TParams>): ApiHandler<TParams> {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(
          { error: { code: err.code, message: err.message, fields: err.fields } },
          { status: err.status },
        );
      }
      if (err instanceof ZodError) {
        const fields: Record<string, string> = {};
        for (const issue of err.issues) {
          fields[issue.path.join(".")] = issue.message;
        }
        return NextResponse.json({ error: { code: "validation_failed", fields } }, { status: 400 });
      }
      console.error("[api] unhandled:", err);
      return NextResponse.json({ error: { code: "internal_error" } }, { status: 500 });
    }
  };
}

interface ResponseOpts {
  status?: number;
  page?: number;
  pageSize?: number;
  total?: number;
}

export function apiResponse<T>(data: T, opts: ResponseOpts = {}): NextResponse {
  const { status = 200, page, pageSize, total } = opts;
  const body =
    page !== undefined
      ? {
          data,
          pagination: {
            page,
            pageSize: pageSize ?? 20,
            total: total ?? 0,
            totalPages: Math.ceil((total ?? 0) / (pageSize ?? 20)),
          },
        }
      : { data };

  const headers: Record<string, string> = {};
  if (page !== undefined) {
    headers["X-Page"] = String(page);
    headers["X-Page-Size"] = String(pageSize ?? 20);
    headers["X-Total-Count"] = String(total ?? 0);
  }
  return NextResponse.json(body, { status, headers });
}
