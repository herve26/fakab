// your-dialog.jsx
import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';

export const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>
(
  ({ children, ...props }, forwardedRef) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className='fixed inset-0 bg-slate-600 opacity-40'/>
      <DialogPrimitive.Content {...props} ref={forwardedRef} className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-4 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'>
        {children}
        <DialogPrimitive.Close aria-label="Close" className="text-violet11 border hover:bg-violet4 focus:shadow-violet7 hover:bg-red-700 hover:text-white px-2 py-2 absolute top-0 right-0 inline-flex h-[24px] w-[24px] appearance-none items-center justify-center focus:shadow-[0_0_0_2px] focus:outline-none">
          X
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
);

DialogContent.displayName = "DialogContent"

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;