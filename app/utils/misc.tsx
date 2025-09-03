import { useFormAction, useNavigation } from '@remix-run/react'
import { clsx, type ClassValue } from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSpinDelay } from 'spin-delay'
import { extendTailwindMerge } from 'tailwind-merge'
import { extendedTheme } from './extended-theme.ts'

/**
 * Returns the source URL for a user's image.
 * @param {string | null | undefined} imageId - The ID of the user's image.
 * @returns {string} The source URL for the user's image, or a default image if no ID is provided.
 */
export function getUserImgSrc(imageId?: string | null) {
	return imageId ? `/resources/user-images/${imageId}` : '/img/user.png'
}

/**
 * Returns the source URL for a note's image.
 * @param {string} imageId - The ID of the note's image.
 * @returns {string} The source URL for the note's image.
 */
export function getNoteImgSrc(imageId: string) {
	return `/resources/note-images/${imageId}`
}

/**
 * Extracts the error message from an unknown error type.
 * @param {unknown} error - The error to extract the message from.
 * @returns {string} The error message.
 */
export function getErrorMessage(error: unknown) {
	if (typeof error === 'string') return error
	if (
		error &&
		typeof error === 'object' &&
		'message' in error &&
		typeof error.message === 'string'
	) {
		return error.message
	}
	console.error('Unable to get error message for error', error)
	return 'Unknown Error'
}

/**
 * Formats the colors from the extended theme into a structure that can be used by tailwind-merge.
 * @returns {Array<string | object>} An array of color names and color groups.
 */
function formatColors() {
	const colors = []
	for (const [key, color] of Object.entries(extendedTheme.colors)) {
		if (typeof color === 'string') {
			colors.push(key)
		} else {
			const colorGroup = Object.keys(color).map(subKey =>
				subKey === 'DEFAULT' ? '' : subKey,
			)
			colors.push({ [key]: colorGroup })
		}
	}
	return colors
}

const customTwMerge = extendTailwindMerge<string, string>({
	extend: {
		theme: {
			colors: formatColors(),
			borderRadius: Object.keys(extendedTheme.borderRadius),
		},
		classGroups: {
			'font-size': [
				{
					text: Object.keys(extendedTheme.fontSize),
				},
			],
			animate: [
				{
					animate: Object.keys(extendedTheme.animation),
				},
			],
		},
	},
})

/**
 * A utility function to merge Tailwind CSS classes.
 * It uses `clsx` to conditionally apply classes and `tailwind-merge` to resolve conflicts.
 *
 * @param {...ClassValue[]} inputs - The class values to merge.
 * @returns {string} The merged class string.
 */
export function cn(...inputs: ClassValue[]) {
	return customTwMerge(clsx(inputs))
}

/**
 * Returns the domain URL from a Request object.
 * @param {Request} request - The request object.
 * @returns {string} The domain URL.
 */
export function getDomainUrl(request: Request) {
	const host =
		request.headers.get('X-Forwarded-Host') ??
		request.headers.get('host') ??
		new URL(request.url).host
	const protocol = host.includes('localhost') ? 'http' : 'https'
	return `${protocol}://${host}`
}

/**
 * Returns the referrer route from a Request object.
 * It handles inconsistencies in the 'referer' header.
 *
 * @param {Request} request - The request object.
 * @returns {string} The referrer route.
 */
export function getReferrerRoute(request: Request) {
	// spelling errors and whatever makes this annoyingly inconsistent
	// in my own testing, `referer` returned the right value, but 🤷‍♂️
	const referrer =
		request.headers.get('referer') ??
		request.headers.get('referrer') ??
		request.referrer
	const domain = getDomainUrl(request)
	if (referrer?.startsWith(domain)) {
		return referrer.slice(domain.length)
	} else {
		return '/'
	}
}

/**
 * Merges multiple headers objects into one.
 * It uses `set` to override headers with the same name.
 *
 * @param {...(ResponseInit['headers'] | null | undefined)} headers - The headers objects to merge.
 * @returns {Headers} The merged headers object.
 */
export function mergeHeaders(
	...headers: Array<ResponseInit['headers'] | null | undefined>
) {
	const merged = new Headers()
	for (const header of headers) {
		if (!header) continue
		for (const [key, value] of new Headers(header).entries()) {
			merged.set(key, value)
		}
	}
	return merged
}

/**
 * Combines multiple header objects into one.
 * It uses `append` so headers with the same name are not overridden.
 *
 * @param {...(ResponseInit['headers'] | null | undefined)} headers - The headers objects to combine.
 * @returns {Headers} The combined headers object.
 */
export function combineHeaders(
	...headers: Array<ResponseInit['headers'] | null | undefined>
) {
	const combined = new Headers()
	for (const header of headers) {
		if (!header) continue
		for (const [key, value] of new Headers(header).entries()) {
			combined.append(key, value)
		}
	}
	return combined
}

/**
 * Combines multiple response init objects into one.
 * It uses `combineHeaders` to combine the headers.
 *
 * @param {...(ResponseInit | null | undefined)} responseInits - The response init objects to combine.
 * @returns {ResponseInit} The combined response init object.
 */
export function combineResponseInits(
	...responseInits: Array<ResponseInit | null | undefined>
) {
	let combined: ResponseInit = {}
	for (const responseInit of responseInits) {
		combined = {
			...responseInit,
			headers: combineHeaders(combined.headers, responseInit?.headers),
		}
	}
	return combined
}

/**
 * A hook that returns true if the current navigation is submitting the current route's form.
 *
 * @param {object} [options] - The options for the hook.
 * @param {string} [options.formAction] - The action of the form to check. Defaults to the current route's form action.
 * @param {'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'} [options.formMethod='POST'] - The method of the form to check.
 * @param {'submitting' | 'loading' | 'non-idle'} [options.state='non-idle'] - The navigation state to check for.
 * @returns {boolean} True if the form is pending, false otherwise.
 */
export function useIsPending({
	formAction,
	formMethod = 'POST',
	state = 'non-idle',
}: {
	formAction?: string
	formMethod?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'
	state?: 'submitting' | 'loading' | 'non-idle'
} = {}) {
	const contextualFormAction = useFormAction()
	const navigation = useNavigation()
	const isPendingState =
		state === 'non-idle'
			? navigation.state !== 'idle'
			: navigation.state === state
	return (
		isPendingState &&
		navigation.formAction === (formAction ?? contextualFormAction) &&
		navigation.formMethod === formMethod
	)
}

/**
 * A hook that combines `useIsPending` and `useSpinDelay` to show a loading spinner for a minimum amount of time.
 * This avoids a flash of loading state regardless of how fast or slow the request is.
 *
 * @param {object} [options] - The options for the hook.
 * @param {string} [options.formAction] - The action of the form to check. Defaults to the current route's form action.
 * @param {'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'} [options.formMethod] - The method of the form to check.
 * @param {number} [options.delay=400] - The delay in milliseconds before showing the spinner.
 * @param {number} [options.minDuration=300] - The minimum duration in milliseconds to show the spinner.
 * @returns {boolean} True if the form is pending and the delay has passed, false otherwise.
 */
export function useDelayedIsPending({
	formAction,
	formMethod,
	delay = 400,
	minDuration = 300,
}: Parameters<typeof useIsPending>[0] &
	Parameters<typeof useSpinDelay>[1] = {}) {
	const isPending = useIsPending({ formAction, formMethod })
	const delayedIsPending = useSpinDelay(isPending, {
		delay,
		minDuration,
	})
	return delayedIsPending
}

/**
 * Calls all functions passed as arguments with the same arguments.
 *
 * @param {...((...args: Args) => unknown) | undefined} fns - The functions to call.
 * @returns {(...args: Args) => void} A function that calls all the passed functions.
 * @template Args - The arguments of the functions.
 */
function callAll<Args extends Array<unknown>>(
	...fns: Array<((...args: Args) => unknown) | undefined>
) {
	return (...args: Args) => fns.forEach(fn => fn?.(...args))
}

/**
 * A hook that provides a double-check functionality for buttons.
 * The first click sets a `doubleCheck` state to true, and the second click triggers the `onClick` handler.
 * This is useful for creating "are you sure?" experiences for destructive operations.
 *
 * @returns {{
 *   doubleCheck: boolean,
 *   getButtonProps: (props?: React.ButtonHTMLAttributes<HTMLButtonElement>) => object
 * }} An object containing the `doubleCheck` state and a `getButtonProps` function.
 */
export function useDoubleCheck() {
	const [doubleCheck, setDoubleCheck] = useState(false)

	function getButtonProps(
		props?: React.ButtonHTMLAttributes<HTMLButtonElement>,
	) {
		const onBlur: React.ButtonHTMLAttributes<HTMLButtonElement>['onBlur'] =
			() => setDoubleCheck(false)

		const onClick: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'] =
			doubleCheck
				? undefined
				: e => {
						e.preventDefault()
						setDoubleCheck(true)
					}

		const onKeyUp: React.ButtonHTMLAttributes<HTMLButtonElement>['onKeyUp'] =
			e => {
				if (e.key === 'Escape') {
					setDoubleCheck(false)
				}
			}

		return {
			...props,
			onBlur: callAll(onBlur, props?.onBlur),
			onClick: callAll(onClick, props?.onClick),
			onKeyUp: callAll(onKeyUp, props?.onKeyUp),
		}
	}

	return { doubleCheck, getButtonProps }
}

/**
 * A simple debounce implementation.
 *
 * @param {Callback} fn - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {(...args: Parameters<Callback>) => void} The debounced function.
 * @template Callback - The type of the function to debounce.
 */
function debounce<Callback extends (...args: Parameters<Callback>) => void>(
	fn: Callback,
	delay: number,
) {
	let timer: ReturnType<typeof setTimeout> | null = null
	return (...args: Parameters<Callback>) => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn(...args)
		}, delay)
	}
}

/**
 * A hook that debounces a callback function.
 *
 * @param {Callback} callback - The callback function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {(...args: Parameters<Callback>) => void} The debounced callback function.
 * @template Callback - The type of the callback function to debounce.
 */
export function useDebounce<
	Callback extends (...args: Parameters<Callback>) => ReturnType<Callback>,
>(callback: Callback, delay: number) {
	const callbackRef = useRef(callback)
	useEffect(() => {
		callbackRef.current = callback
	})
	return useMemo(
		() =>
			debounce(
				(...args: Parameters<Callback>) => callbackRef.current(...args),
				delay,
			),
		[delay],
	)
}

/**
 * Downloads a file from a URL.
 * It will retry up to 3 times if the fetch fails.
 *
 * @param {string} url - The URL of the file to download.
 * @param {number} [retries=0] - The number of retries attempted.
 * @returns {Promise<{content_type: string, blob: Buffer}>} A promise that resolves with the content type and a Buffer of the file.
 * @throws {Error} If the fetch fails after the maximum number of retries.
 */
export async function downloadFile(url: string, retries: number = 0) {
	const MAX_RETRIES = 3
	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to fetch image with status ${response.status}`)
		}
		const content_type = response.headers.get('content-type') ?? 'image/jpg'
		const blob = Buffer.from(await response.arrayBuffer())
		return { content_type, blob }
	} catch (e) {
		if (retries > MAX_RETRIES) throw e
		return downloadFile(url, retries + 1)
	}
}
