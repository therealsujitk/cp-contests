import type { Contest } from '$lib/interfaces';
import { getCodeChefContests, getCodeforcesContests, getLeetCodeContests } from '$lib/services/contest';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const contests: Contest[] = [];
  await Promise.all([
    getCodeChefContests().then(c => contests.push(...c)),
    getCodeforcesContests().then(c => contests.push(...c)),
    getLeetCodeContests().then(c => contests.push(...c)),
  ]);

	return { contests: contests.toSorted((a, b) => a.startTime.getTime() - b.startTime.getTime()) };
};
