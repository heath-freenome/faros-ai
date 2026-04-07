/**
 * Attempts to extract a human-readable message from an HTTP error response body.
 * Checks for `error` and `message` fields in the JSON, falling back to the HTTP status.
 */
export async function parseApiError(res: Response): Promise<string> {
  try {
    const body = await res.json() as { error?: string; message?: string };
    const detail = body.error ?? body.message;
    return detail ? `${detail} (HTTP ${res.status})` : `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}
