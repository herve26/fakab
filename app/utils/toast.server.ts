/**
 * @file This file contains the server-side logic for creating and handling toast messages.
 * It uses a cookie-based session storage to store toast messages and provides utility functions
 * for redirecting with a toast message and for retrieving the toast message from a request.
 */
import { createId as cuid } from '@paralleldrive/cuid2'
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { z } from 'zod'
import { combineHeaders } from './misc.tsx'

/**
 * The key used to store the toast message in the session.
 * @type {string}
 */
export const toastKey = 'toast'

const TypeSchema = z.enum(['message', 'success', 'error'])
/**
 * The Zod schema for a toast message.
 */
const ToastSchema = z.object({
	description: z.string(),
	id: z.string().default(() => cuid()),
	title: z.string().optional(),
	type: TypeSchema.default('message'),
})

export type Toast = z.infer<typeof ToastSchema>
export type OptionalToast = Omit<Toast, 'id' | 'type'> & {
	id?: string
	type?: z.infer<typeof TypeSchema>
}

/**
 * The session storage for toast messages.
 */
export const toastSessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'en_toast',
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secrets: process.env.SESSION_SECRET.split(','),
		secure: process.env.NODE_ENV === 'production',
	},
})

/**
 * Redirects to a URL with a toast message.
 *
 * @param {string} url - The URL to redirect to.
 * @param {OptionalToast} toast - The toast message to show.
 * @param {ResponseInit} [init] - The response init object.
 * @returns {Promise<Response>} A promise that resolves with the redirect response.
 */
export async function redirectWithToast(
	url: string,
	toast: OptionalToast,
	init?: ResponseInit,
) {
	return redirect(url, {
		...init,
		headers: combineHeaders(init?.headers, await createToastHeaders(toast)),
	})
}

/**
 * Creates the headers for a toast message.
 *
 * @param {OptionalToast} optionalToast - The toast message to show.
 * @returns {Promise<Headers>} A promise that resolves with the headers for the toast message.
 */
export async function createToastHeaders(optionalToast: OptionalToast) {
	const session = await toastSessionStorage.getSession()
	const toast = ToastSchema.parse(optionalToast)
	session.flash(toastKey, toast)
	const cookie = await toastSessionStorage.commitSession(session)
	return new Headers({ 'set-cookie': cookie })
}

/**
 * Gets the toast message from a request.
 *
 * @param {Request} request - The request object.
 * @returns {Promise<{toast: Toast | null, headers: Headers | null}>} A promise that resolves with the toast message and headers to clear the toast from the session.
 */
export async function getToast(request: Request) {
	const session = await toastSessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const result = ToastSchema.safeParse(session.get(toastKey))
	const toast = result.success ? result.data : null
	return {
		toast,
		headers: toast
			? new Headers({
					'set-cookie': await toastSessionStorage.destroySession(session),
				})
			: null,
	}
}
