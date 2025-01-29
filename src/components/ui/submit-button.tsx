import { cn } from "@/lib/utils";
import { className } from "postcss-selector-parser";
import { Button } from "@/components/ui/button";

export default function SubmitButton(props: {
  isUploading: boolean;
  text?: string;
}) {
  const { isUploading, text } = props;

  return (
    <Button disabled={isUploading} type="submit">
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
          className={cn("animate-spin", className)}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ) : (
        (text ?? "제출하기")
      )}
    </Button>
  );
}
