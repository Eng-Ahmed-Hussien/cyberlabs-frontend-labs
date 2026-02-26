import type { LabSessionResponse } from '../types';

export const mockLabSession: LabSessionResponse = {
  id: 'inst_12345abcde',
  status: 'ACTIVE',
  baseScore: 100,
  currentScore: 100,
  startedAt: new Date().toISOString(),
  // For the sake of mocking, we can load a safe example site or a local HTML file
  // In reality, this would be the dynamically generated sandbox URL
  iframeUrl: '/mock-vulnerable-app.html',
  template: {
    id: 'tpl_sqli_01',
    title: 'SQL Injection: Authentication Bypass',
    description:
      'In this lab, you need to bypass the login screen by exploiting a SQL injection vulnerability in the authentication query.',
    goal: 'Access the administrator dashboard without knowing the password.',
    skills: ['SQLi', 'Authentication Bypass', 'Payload Crafting'],
    difficulty: 'BEGINNER',
    executionMode: 'SHARED_BACKEND',
  },
  hintsMeta: [
    {
      id: 'hint_1',
      order: 1,
      penaltyPercent: 5,
      isUsed: false,
    },
    {
      id: 'hint_2',
      order: 2,
      penaltyPercent: 10,
      isUsed: false,
    },
    {
      id: 'hint_3',
      order: 3,
      penaltyPercent: 15,
      isUsed: false,
    },
    {
      id: 'hint_4', // The Solution
      order: 4,
      penaltyPercent: 20,
      isUsed: false,
    },
  ],
};

export const mockHintTexts: Record<string, string> = {
  hint_1:
    "Think about how the backend constructs the SQL query. It probably looks something like:\n`SELECT * FROM users WHERE username = '$username' AND password = '$password'`",
  hint_2:
    "What happens if you inject a single quote (') into the username field? It might break the query syntax.",
  hint_3:
    'Try to make the WHERE clause always evaluate to true. The OR operator is your friend here.',
  hint_4:
    "Solution: Enter `admin' OR '1'='1` in the username field and leave the password blank. This changes the query to:\n`... WHERE username = 'admin' OR '1'='1' AND password = ''`\nSince '1'='1' is true, the login succeeds.",
};
