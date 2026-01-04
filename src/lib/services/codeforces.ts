import type { Contest } from "$lib/interfaces";

async function getContests(): Promise<Contest[]> {
  const url = 'https://codeforces.com/api/contest.list?gym=false';
  const response = await fetch(url);
  const jsonResponse = await response.json();
  const phaseFilter = new Set([ 'BEFORE', 'CODING' ]);

  return jsonResponse.result.filter((contest: any) => phaseFilter.has(contest.phase)).map((contest: any) => ({
    title: contest.name,
    url: `https://codeforces.com/contest/${contest.id}`,
    startTime: new Date(contest.startTimeSeconds * 1000)
  }));
}

export default { getContests };
