const issueList = [
  {
    value: "issue_001",
    display: "1. 프레임 속의 프레임",
  },
  {
    value: "issue_002",
    display: "2. 돌아오기 위한 여정",
  },
];

export const issueDisplay = [
  {
    value: "all",
    display: "모든 이슈",
  },
  ...issueList,
];

export const issueOnNewPost = [
  {
    value: "none",
    display: "이슈 없음",
  },
  ...issueList,
];
