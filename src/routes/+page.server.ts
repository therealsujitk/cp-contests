import type { Contest } from '$lib/interfaces';
import { getAtCoderContests, getCodeChefContests, getCodeforcesContests, getLeetCodeContests } from '$lib/services/contest';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
  const contests: Contest[] = [];
  const erroredSites: string[] = [];

  // Fetch contests from all sites in parallel and handle errors for each site individually
  await Promise.all([
    getAtCoderContests().then(c => contests.push(...c)).catch(() => erroredSites.push('AtCoder')),
    getCodeChefContests().then(c => contests.push(...c)).catch(() => erroredSites.push('CodeChef')),
    getCodeforcesContests().then(c => contests.push(...c)).catch(() => erroredSites.push('Codeforces')),
    getLeetCodeContests().then(c => contests.push(...c)).catch(() => erroredSites.push('LeetCode')),
  ]);

  // Get the user's timezone from the request headers (set by Vercel) and send it to the client.
  // This is done to prevent rendering mismatches between server and client due to timezone differences.
  const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const clientTimezone = request.headers.get('x-vercel-ip-timezone') ?? serverTimezone;

  return {
    contests: contests.toSorted((a, b) => a.startTime.getTime() - b.startTime.getTime()),
    errors: [
      ...(erroredSites.length > 0 ? [{
        title: 'Failed to fetch contests from one or more sites',
        message: `We were unable to fetch contests from the following sites: ${erroredSites.join(', ')}.`,
      }] : [])
    ],
    timezone: clientTimezone,
  };
};
