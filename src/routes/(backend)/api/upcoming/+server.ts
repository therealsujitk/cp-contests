import type { ContestMetadata } from '$lib/interfaces';
import { getAtCoderContests, getCodeChefContests, getCodeforcesContests, getLeetCodeContests } from '$lib/services/contest';
import { json } from '@sveltejs/kit';

export async function GET() {
  const contests: ContestMetadata[] = [];
  const erroredSites: string[] = [];

  // Fetch contests from all sites in parallel and handle errors for each site individually
  await Promise.all([
    getAtCoderContests().then(c => contests.push(...c)).catch(() => erroredSites.push('AtCoder')),
    getCodeChefContests().then(c => contests.push(...c)).catch(() => erroredSites.push('CodeChef')),
    getCodeforcesContests().then(c => contests.push(...c)).catch(() => erroredSites.push('Codeforces')),
    getLeetCodeContests().then(c => contests.push(...c)).catch(() => erroredSites.push('LeetCode')),
  ]);

  return json({
    contests: contests.toSorted((a, b) => a.startTime.getTime() - b.startTime.getTime()),
    errors: [
      ...(erroredSites.length > 0 ? [{
        title: 'Failed to fetch contests from one or more sites',
        message: `We were unable to fetch contests from the following sites: ${erroredSites.join(', ')}.`,
      }] : [])
    ],
  });
}
