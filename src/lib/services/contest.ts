import type { Contest } from "$lib/interfaces";
import * as AtCoder from '@qatadaazzeh/atcoder-api';

export async function getAtCoderContests(): Promise<Contest[]> {
  const upcomingContests = await AtCoder.fetchUpcomingContests();
  
  return upcomingContests.map((contest) => {
    const startTime = new Date(contest.contestTime);
    const duration = contest.contestDuration.split(':');
    const endTime = new Date(startTime.getTime() + (parseInt(duration[0]) * 60 + parseInt(duration[1])) * 60 * 1000);

    return {
      title: contest.contestName,
      url: contest.contestUrl,
      startTime: startTime,
      endTime: endTime,
    }
  });
}

export async function getCodeChefContests(): Promise<Contest[]> {
  const url = 'https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all';
  const response = await fetch(url);
  const jsonResponse = await response.json();

  const toContest = (contest: any) => ({
    title: contest.contest_name,
    url: `https://codechef.com/${contest.contest_code}`,
    startTime: new Date(contest.contest_start_date_iso),
    endTime: new Date(contest.contest_end_date_iso),
  });

  return [...jsonResponse.present_contests.map(toContest), ...jsonResponse.future_contests.map(toContest)];
}

export async function getCodeforcesContests(): Promise<Contest[]> {
  const url = 'https://codeforces.com/api/contest.list?gym=false';
  const response = await fetch(url);
  const jsonResponse = await response.json();
  const phaseFilter = new Set([ 'BEFORE', 'CODING' ]);

  return jsonResponse.result.filter((contest: any) => phaseFilter.has(contest.phase)).map((contest: any) => {
    const startTime = new Date(contest.startTimeSeconds * 1000);
    const endTime = new Date(startTime.getTime() + contest.durationSeconds * 1000);

    return {
      title: contest.name,
      url: `https://codeforces.com/contest/${contest.id}`,
      startTime: startTime,
      endTime: endTime,
    }
  });
}

export async function getLeetCodeContests(): Promise<Contest[]> {
  const url = 'https://leetcode.com/graphql';
  const query = `query contestV2UpcomingContests {
    contestV2UpcomingContests {
      titleSlug
      title
      startTime
      duration
      cardImg
    }
  }`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query,
      variables: {},
      operationName: "contestV2UpcomingContests"
    })
  });
  const jsonResponse = await response.json();

  return jsonResponse.data.contestV2UpcomingContests.map((contest: any) => {
    const startTime = new Date(contest.startTime * 1000);
    const endTime = new Date(startTime.getTime() + contest.duration * 1000);
    
    return {
      title: contest.title,
      url: `https://leetcode.com/contest/${contest.titleSlug}`,
      startTime: startTime,
      endTime: endTime,
      coverImage: contest.cardImg,
    }
  });
}
