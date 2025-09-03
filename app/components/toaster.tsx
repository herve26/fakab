import { useEffect } from 'react'
import { Toaster, toast as showToast } from 'sonner'
import { type Toast } from '#app/utils/toast.server.ts'

/**
 * A component that displays toast messages.
 * It uses the `sonner` library to show toasts.
 *
 * @param {object} props - The props for the component.
 * @param {Toast | null | undefined} props.toast - The toast message to display.
 * @returns {JSX.Element} The toaster component.
 */
export function EpicToaster({ toast }: { toast?: Toast | null }) {
	return (
		<>
			<Toaster closeButton position="top-center" />
			{toast ? <ShowToast toast={toast} /> : null}
		</>
	)
}

/**
 * A component that shows a toast message.
 * It is used by the `EpicToaster` component.
 *
 * @param {object} props - The props for the component.
 * @param {Toast} props.toast - The toast message to display.
 * @returns {null} This component does not render anything.
 */
function ShowToast({ toast }: { toast: Toast }) {
	const { id, type, title, description } = toast
	useEffect(() => {
		setTimeout(() => {
			showToast[type](title, { id, description })
		}, 0)
	}, [description, id, title, type])
	return null
}
