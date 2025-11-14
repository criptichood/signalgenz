import * as React from "react"

import { cn } from "@/lib/utils"

interface RichTextEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  toolbar?: boolean;
}

const RichTextEditor = React.forwardRef<HTMLTextAreaElement, RichTextEditorProps>(
  ({ className, toolbar = true, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {toolbar && (
          <div className="flex items-center space-x-2">
            <button type="button" className="p-1 rounded hover:bg-accent">
              B
            </button>
            <button type="button" className="p-1 rounded hover:bg-accent">
              I
            </button>
            <button type="button" className="p-1 rounded hover:bg-accent">
              U
            </button>
          </div>
        )}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
RichTextEditor.displayName = "RichTextEditor"

export { RichTextEditor }