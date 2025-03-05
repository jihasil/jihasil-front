import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(front)/components/ui/select";
import { cn } from "@/app/(front)/shared/lib/utils";

export const Navigation = (props: {
  onValueChange: any;
  selects: { value: string; display: string }[];
  default?: string;
  className?: string;
}) => {
  const selectGroup = (
    <SelectGroup>
      {props.selects.map((item, index) => (
        <SelectItem key={index} value={item.value}>
          {item.display}
        </SelectItem>
      ))}
    </SelectGroup>
  );

  return (
    <Select
      defaultValue={props.default ?? props.selects[0].value}
      onValueChange={props.onValueChange}
    >
      <SelectTrigger className={cn("w-full", props.className)}>
        <SelectValue placeholder="선택하세요" />
      </SelectTrigger>
      <SelectContent>{selectGroup}</SelectContent>
    </Select>
  );
};
