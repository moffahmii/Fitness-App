import { useState, forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "cn";

// Define component styles and variants
const inputVariants = cva(
  "flex w-full items-center gap-3 rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors focus-within:ring-1 focus-within:ring-ring focus-within:border-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        error:
          "border-destructive focus-within:border-destructive focus-within:ring-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Extend native input props with custom properties
export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onEndIconClick?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, variant, type, startIcon, endIcon, onEndIconClick, ...props },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isPasswordType = type === "password";
    const currentInputType = isPasswordType
      ? isPasswordVisible
        ? "text"
        : "password"
      : type;

    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    // Extract right-side content logic to keep the main render clean
    const renderRightSideContent = () => {
      if (isPasswordType) {
        return (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            className="flex shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
          >
            {isPasswordVisible ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        );
      }

      if (endIcon) {
        return (
          <button
            type="button"
            onClick={onEndIconClick}
            disabled={!onEndIconClick}
            className={cn(
              "flex shrink-0 items-center justify-center text-muted-foreground transition-colors",
              onEndIconClick && "hover:text-foreground focus:outline-none",
            )}
          >
            {endIcon}
          </button>
        );
      }

      return null;
    };

    return (
      <div className={cn(inputVariants({ variant, className }))}>
        {/* Left-side Icon */}
        {startIcon && (
          <div className="flex shrink-0 items-center justify-center text-muted-foreground">
            {startIcon}
          </div>
        )}

        {/* Core Input Element */}
        <input
          ref={ref}
          type={currentInputType}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          {...props}
        />

        {/* Right-side Icon or Action */}
        {renderRightSideContent()}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
