import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const Step = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li"> & {
    isActive?: boolean;
    isCompleted?: boolean;
    isError?: boolean;
  }
>(({ className, isActive, isCompleted, isError, children, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </li>
  );
});
Step.displayName = "Step";

const StepButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    isActive?: boolean;
    isCompleted?: boolean;
    isError?: boolean;
  }
>(({ className, isActive, isCompleted, isError, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
        "border-muted bg-background text-muted-foreground",
        "hover:border-border hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive && "border-primary bg-primary text-primary-foreground",
        isCompleted && "border-primary bg-primary text-primary-foreground",
        isError &&
          "border-destructive bg-destructive text-destructive-foreground",
        className
      )}
      {...props}
    >
      {isCompleted ? <CheckIcon className="h-5 w-5" /> : children}
    </button>
  );
});
StepButton.displayName = "StepButton";

const StepLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span"> & {
    isActive?: boolean;
    isCompleted?: boolean;
    isError?: boolean;
  }
>(({ className, isActive, isCompleted, isError, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "text-sm font-medium text-muted-foreground",
        isActive && "text-foreground",
        isCompleted && "text-foreground",
        isError && "text-destructive",
        className
      )}
      {...props}
    />
  );
});
StepLabel.displayName = "StepLabel";

const StepDescription = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span"> & {
    isActive?: boolean;
    isCompleted?: boolean;
    isError?: boolean;
  }
>(({ className, isActive, isCompleted, isError, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "text-xs text-muted-foreground",
        isError && "text-destructive",
        className
      )}
      {...props}
    />
  );
});
StepDescription.displayName = "StepDescription";

const StepContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("mt-4", className)} {...props} />;
});
StepContent.displayName = "StepContent";

const StepSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    isActive?: boolean;
    isCompleted?: boolean;
  }
>(({ className, isCompleted, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "h-0.5 w-full bg-muted",
        isCompleted && "bg-primary",
        className
      )}
      {...props}
    />
  );
});
StepSeparator.displayName = "StepSeparator";

const Stepper = React.forwardRef<HTMLOListElement, React.ComponentProps<"ol">>(
  ({ className, ...props }, ref) => {
    return (
      <ol ref={ref} className={cn("flex items-center", className)} {...props} />
    );
  }
);
Stepper.displayName = "Stepper";

export {
  Step,
  StepButton,
  StepContent,
  StepDescription,
  StepLabel,
  StepSeparator,
  Stepper,
};
