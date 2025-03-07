import { Button } from "@/app/(front)/components/ui/button";
import { cn } from "@/app/(front)/shared/lib/utils";

export default function SubmitButton(props: {
  isUploading: boolean;
  text?: string;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  onClick?: () => void;
}) {
  const { isUploading, text, variant, type, onClick } = props;

  return (
    <Button
      disabled={isUploading}
      type={type ?? "submit"}
      variant={variant}
      className={cn(props.className)}
      onClick={onClick}
    >
      {text ?? "제출하기"}
      {isUploading ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("animate-spin", props.className)}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ) : null}
    </Button>
  );
}
