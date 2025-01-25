import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Navigation(props: {
  onValueChange: any;
  selects: { value: string; display: string }[];
}) {
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
      defaultValue={props.selects?.[0].value}
      onValueChange={(value: string) => props.onValueChange(value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="선택하세요" />
      </SelectTrigger>
      <SelectContent>{selectGroup}</SelectContent>
    </Select>
  );
}
