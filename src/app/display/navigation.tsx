import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Navigation(props: { onValueChange: any }) {
  const { onValueChange } = props;

  return (
    <div className="w-full flex justify-start">
      <Select
        defaultValue="all"
        onValueChange={(value: string) => onValueChange(value)}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="이슈를 선택해주세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">모든 이슈</SelectItem>
            <SelectItem value="issue_001">1. 프레임 속의 프레임</SelectItem>
            <SelectItem value="issue_002">2. 돌아오기 위한 여정</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
