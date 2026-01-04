import CodeChefService from '$lib/services/codechef';
import CodeforcesService from '$lib/services/codeforces';
import LeetCodeService from '$lib/services/leetcode';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const codechefContests = await CodeChefService.getContests();
  const codeforcesContests = await CodeforcesService.getContests();
  const leetCodeContests = await LeetCodeService.getContests();
  const contests = [ ...codechefContests, ...codeforcesContests, ...leetCodeContests ];

	return { contests: contests.toSorted((a, b) => a.startTime.getMilliseconds() - b.startTime.getMilliseconds()) };
};
