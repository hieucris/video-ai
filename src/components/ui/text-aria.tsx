import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    icon?: React.ReactNode;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex w-full min-h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
TextArea.displayName = "TextArea"

export { TextArea }

