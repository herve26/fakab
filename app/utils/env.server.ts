/**
 * @file This file is responsible for validating and exposing environment variables to the application.
 * It uses Zod to define a schema for the environment variables and validates them on server startup.
 * It also exposes a subset of environment variables to the client-side.
 */

import { z } from 'zod'

const schema = z.object({
	NODE_ENV: z.enum(['production', 'development', 'test'] as const),
	SESSION_SECRET: z.string(),
	SUPABASE_URL: z.string(),
	SUPABASE_ANON_KEY: z.string(),
	GOOGLE_CLOUD_BUCKET: z.string().optional()
})

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	module NodeJS {
		interface ProcessEnv extends z.infer<typeof schema> {}
	}
}

/**
 * Initializes and validates the environment variables on the server.
 * This function should be called at the start of the application to ensure
 * that all required environment variables are present and valid.
 * @throws {Error} If the environment variables are invalid.
 */
export function init() {
	const parsed = schema.safeParse(process.env)

	if (parsed.success === false) {
		console.error(
			'❌ Invalid environment variables:',
			parsed.error.flatten().fieldErrors,
		)

		throw new Error('Invalid environment variables')
	}
}

/**
 * Returns a subset of environment variables that are safe to be exposed to the client.
 * This function is used in both `entry.server.ts` and `root.tsx` to ensure that
 * the environment variables are set and globally available before the app is started.
 *
 * NOTE: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 * @returns {object} An object containing the public environment variables.
 */
export function getEnv() {
	return {
		MODE: process.env.NODE_ENV
	}
}

type ENV = ReturnType<typeof getEnv>

declare global {
	// eslint-disable-next-line no-var
	var ENV: ENV
	interface Window {
		ENV: ENV
	}
}
