import type { Contest } from '$lib/interfaces';
import CodeChefService from '$lib/services/codechef';
import CodeforcesService from '$lib/services/codeforces';
import LeetCodeService from '$lib/services/leetcode';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const contests: Contest[] = [];
  await Promise.all([
    CodeChefService.getContests().then(c => contests.push(...c)),
    CodeforcesService.getContests().then(c => contests.push(...c)),
    LeetCodeService.getContests().then(c => contests.push(...c)),
  ]);

	return { contests: contests.toSorted((a, b) => a.startTime.getTime() - b.startTime.getTime()) };
};
