// your-select.jsx
import * as SelectPrimitive from '@radix-ui/react-select';
import React from 'react';
import { Icon } from './icon.tsx';

export const Select = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> & {
        placeholder?: string,
        id?: string
    }
>(({ children, placeholder, id, ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger className="flex items-center justify-between h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-input-invalid" ref={forwardedRef}>
          <SelectPrimitive.Value placeholder={placeholder}/>
          <SelectPrimitive.Icon>
            <Icon size="font" name="chevron-down" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content id={id} className='RadixSelectContent overflow-hidden bg-white shadow-lg rounded-md'>
            <SelectPrimitive.ScrollUpButton>
            <Icon size="font" name="chevron-up" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton>
              <Icon size="font" name="chevron-down" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  }
);

Select.displayName = "Select"

export const SelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ children, ...props }, forwardedRef) => {
    return (
        <SelectPrimitive.Item {...props} className="hover:bg-primary hover:text-white px-6 flex space-x-4" ref={forwardedRef}>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator>
                <Icon name="check"/>
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    );
  }
);

SelectItem.displayName = "SelectItem"