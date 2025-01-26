export const IssueKey = {
  "이슈 없음": "none",
  "1. 프레임 속의 프레임": "issue_001",
  "2. 돌아오기 위한 여정": "issue_002",
} as const;

export type IssueUnion = (typeof IssueKey)[keyof typeof IssueKey];

let cachedIssueSelection;

// categorySelection을 동적으로 생성하는 함수
function createIssueSelection(issueKey: typeof IssueKey) {
  if (!cachedIssueSelection) {
    return Object.entries(issueKey).map(([display, value]) => ({
      value,
      display,
    }));
  }
  return cachedIssueSelection;
}

// categorySelection을 생성
export const issueSelection = createIssueSelection(IssueKey);

export const issueDisplay = [
  {
    value: "all",
    display: "모든 이슈",
  },
  ...issueSelection,
];

export const issueOnNewPost = [...issueSelection];
