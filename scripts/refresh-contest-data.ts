import downloadedContests from "../src/lib/data/codeforces-contests.json";
import _ from 'lodash';
import { writeFile } from "fs/promises";

const OUTPUT_FILE = "./src/lib/data/codeforces-contests.json";
const MAX_CONTESTS = 100;

interface ContestListResponse {
  status: string;
  result: {
    id: number;
    name: string;
    phase: string;
    startTimeSeconds: number;
  }[];
}

interface ContestStandingsResponse {
  status: string;
  result: {
    contest: {
      id: number;
      name: string;
      startTimeSeconds: number;
      durationSeconds: number;
    };
    problems: {
      index: string;
      name: string;
      rating?: number;
    }[];
  };
}

async function fetchJson<T>(url: URL): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = (await response.json()) as { status: string; comment?: string };

  if (data.status !== "OK") {
    throw new Error(data.comment ?? "Unknown Codeforces API error");
  }

  return data as T;
}

async function fetchContestList(): Promise<number[]> {
  console.log("📥 Fetching latest contest list...");

  const url = new URL("https://codeforces.com/api/contest.list");
  url.searchParams.set("gym", "false");

  const data = await fetchJson<ContestListResponse>(url);

  const contests = data.result
    .filter((contest) => contest.phase === "FINISHED")
    .filter((contest) => !contest.name.toUpperCase().includes('UNRATED'))
    .filter((contest) => contest.name.toUpperCase().includes('DIV.'))
    .sort((a, b) => b.startTimeSeconds - a.startTimeSeconds)
    .slice(0, MAX_CONTESTS)
    .map((contest) => contest.id);

  console.log(`✓ Found ${contests.length} recent contests\n`);

  return contests;
}

async function fetchContest(contestId: number) {
  const url = new URL("https://codeforces.com/api/contest.standings");
  url.searchParams.set("contestId", contestId.toString());

  const data = await fetchJson<ContestStandingsResponse>(url);

  return {
    id: contestId,
    name: data.result.contest.name,
    startTimeSeconds: data.result.contest.startTimeSeconds,
    durationSeconds: data.result.contest.durationSeconds,
    problems: data.result.problems.map((problem) => ({
      index: problem.index,
      name: problem.name,
      rating: problem.rating,
    })),
  };
}

function padNumber(num: number, size = 0) {
  const numString = num.toString();

  if (numString.length >= size) {
    return numString;
  }

  return ' '.repeat(size - numString.length) + numString;
}

function cleanObject<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => cleanObject(item)) as T;
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, cleanObject(value)])
    ) as T;
  }

  return value;
}

async function downloadContestData() {
  const contestIds = (await fetchContestList()).map(id => id.toString() as keyof typeof downloadedContests);

  const contests = {
    ...downloadedContests,
  };

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  const updates: string[] = [];

  for (const [index, contestId] of contestIds.entries()) {
    const progress = `[${padNumber(index + 1, 3)}/${contestIds.length}]`;
    const existingContest = contests[contestId];
    const hasRatings = existingContest?.problems?.every((problem) => 'rating' in problem);

    if (hasRatings) {
      skipped++;
      console.log(`${progress} Skipping Contest ${contestId} - contest data complete`);
      continue;
    }

    if (existingContest === undefined) {
      console.log(`${progress} Fetching Contest ${contestId} - contest data not found`);
    } else {
      console.log(`${progress} Fetching Contest ${contestId} - problem ratings missing`);
    }

    try {
      const contest = await fetchContest(parseInt(contestId));
      let message = '    ✓ Placeholder Log Message';

      if (!(contestId in contests)) {
        message = `    ✓ Added: ${contest.name} (${contest.problems.length} problems)`;
        updates.push(message.trim());
        downloaded++;
      } else if (_.isEqual(contests[contestId], cleanObject(contest))) {
        message = `    ↷ Skipped: ${contest.name} (${contest.problems.length} problems)`;
        skipped++;
      } else {
        message = `    ↻ Updated: ${contest.name} (${contest.problems.length} problems)`;
        updates.push(message.trim());
        downloaded++;
      }

      contests[contestId] = contest as any;
      console.log(message);
    } catch (error) {
      failed++;
      console.error(`    ✗ Failed to fetch ${contestId}:`, error);
    }
  }

  if (failed > 0) {
    throw `Failed to fetch data for ${failed} contests`;
  }

  console.log("\n💾 Writing contest data to file...");
  await writeFile(OUTPUT_FILE, JSON.stringify(contests));

  console.log(`` +
    `──────────────────────────────` +
    `\nContest data refreshed` +
    `\n` +
    `\nDownloaded  : ${downloaded}` +
    `\nSkipped     : ${skipped}` +
    `\n\nSummary     : \n${updates.length === 0 ? '--' : updates.join('\n')}` +
    `\n──────────────────────────────`
  );
}

downloadContestData().catch((error) => {
  console.error("\n❌ Unexpected error:", error);
  process.exitCode = 1;
});