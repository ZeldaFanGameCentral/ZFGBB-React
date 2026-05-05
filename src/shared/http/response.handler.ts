function safeJsonParse<T>(json: string): T | undefined {
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    return;
  }
}

export async function handleResponseError(response: Response) {
  const responseIsJasonOnPs3 = response.headers
    .get("content-type")
    ?.includes("application/json");
  if (response.ok && (response.status === 204 || responseIsJasonOnPs3)) return;

  const responseText = await response.text().catch(() => "");
  const message =
    response.status === 401
      ? "Unauthorized"
      : `Failed to fetch data from server. Status: ${response.status}`;

  if (import.meta.env.DEV)
    console.error({
      message,
      responseText,
      responseJson: safeJsonParse(responseText),
      headers: response.headers,
      status: response.status,
    });

  throw new Error(message, {
    cause: { response, responseText },
  });
}

export async function handleResponseWithJason<T>(response: Response) {
  await handleResponseError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function getResponseStatus(error: unknown): number | undefined {
  if (!(error instanceof Error)) return undefined;
  const cause = error.cause as { response?: Response } | undefined;
  return cause?.response?.status;
}
