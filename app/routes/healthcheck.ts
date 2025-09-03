// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import { supabaseClient } from "#app/utils/supa.server.ts";
import type { LoaderFunctionArgs } from "@remix-run/node";

/**
 * The loader function for the healthcheck route.
 * It checks the health of the application by connecting to the database and making a request to itself.
 *
 * @param {LoaderFunctionArgs} args - The loader function arguments.
 * @returns {Promise<Response>} A promise that resolves with a response.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    const url = new URL("/", `http://${host}`);
    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([
      supabaseClient.from("user").select("count(*)"),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok) return Promise.reject(r);
      }),
    ]);
    return new Response("OK");
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
};