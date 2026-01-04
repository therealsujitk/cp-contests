import type { Contest } from "$lib/interfaces";

async function getContests(): Promise<Contest[]> {
  const url = 'https://leetcode.com/graphql';
  const query = `query contestV2UpcomingContests {
    contestV2UpcomingContests {
      titleSlug
      title
      titleCn
      startTime
      duration
      cardImg
      cardImgApp
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

  return jsonResponse.data.contestV2UpcomingContests.map((contest: any) => ({
    title: contest.title,
    url: `https://leetcode.com/contest/${contest.titleSlug}`,
    startTime: new Date(contest.startTime * 1000),
    coverImage: contest.cardImg
  }));
}

export default { getContests };
