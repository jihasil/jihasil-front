import { createNavigationSelection } from "@/shared/enum/enum-util";

export const IssueKey = {
  "모든 이슈": "all",
  "이슈 없음": "none",
  "1. 프레임 속의 프레임": "issue_001",
  "2. 돌아오기 위한 여정": "issue_002",
} as const;

export type IssueUnion = (typeof IssueKey)[keyof typeof IssueKey];

export const issueSelection = createNavigationSelection(IssueKey);

export const issueTextColor = {
  none: "text-issue-none",
  issue_001: "text-issue-001",
  issue_002: "text-issue-002",
};

export const issueBackgroundColor = {
  none: "bg-issue-none",
  issue_001: "bg-issue-001",
  issue_002: "bg-issue-002",
};
