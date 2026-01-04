import type { Contest } from "$lib/interfaces";

async function getContests(): Promise<Contest[]> {
  const url = 'https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all';
  const response = await fetch(url);
  const jsonResponse = await response.json();

  return jsonResponse.future_contests.map((contest: any) => ({
    title: contest.contest_name,
    url: `https://codechef.com/${contest.contest_code}`,
    startTime: new Date(contest.contest_start_date_iso)
  }));
}

export default { getContests };
