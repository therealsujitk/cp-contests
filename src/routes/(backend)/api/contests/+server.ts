import codeforcesContestsJson from '$lib/data/codeforces-contests.json';
import type { CodeforcesContest } from '$lib/interfaces/contest';
import { json } from '@sveltejs/kit';

const codeforcesContests: Record<number, CodeforcesContest> = codeforcesContestsJson as Record<number, CodeforcesContest>;

export async function GET({ url }) {
  const platform = url.searchParams.get('platform');
  const ids = url.searchParams.getAll('id').map(id => parseInt(id, 10));

  if (!platform) {
    return json({ error: 'Missing required parameter `platform`.' }, { status: 400 });
  }

  if (ids.some(id => isNaN(id))) {
    return json({ error: 'Invalid parameter `id`.' }, { status: 400 });
  }

	const contests: Record<number, CodeforcesContest> = {};
  const missingContests: number[] = [];

  if (platform === 'codeforces') {
    for (const id of ids) {
      if (!(id in codeforcesContests)) {
        missingContests.push(id);
      } else {
        contests[id] = codeforcesContests[id];
      }
    }
  }

  return json({ contests, missingContests });
}
