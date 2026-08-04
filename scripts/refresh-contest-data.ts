import downloadedContests from "../src/lib/data/codeforces-contests.json";
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

async function downloadContestData() {
  const contestIds = await fetchContestList();

  const contests = {
    ...downloadedContests,
  };

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const [index, contestId] of contestIds.entries()) {
    const progress = `[${index + 1}/${contestIds.length}]`;

    const existingContest = contests[contestId];

    const hasRatings =
      existingContest?.problems?.every((problem) => problem.rating !== undefined);

    if (hasRatings) {
      skipped++;
      console.log(`${progress} Skipping Contest ${contestId}`);
      continue;
    }

    console.log(`${progress} Fetching Contest ${contestId}...`);

    try {
      const contest = await fetchContest(contestId);
      contests[contestId] = contest;

      downloaded++;
      console.log(
        `    ✓ ${contest.name} (${contest.problems.length} problems)`
      );
    } catch (error) {
      failed++;
      console.error(`    ✗ Failed to fetch ${contestId}:`, error);
    }
  }

  console.log("\n💾 Writing contest data...");
  await writeFile(OUTPUT_FILE, JSON.stringify(contests));

  console.log(`` +
    `──────────────────────────────` +
    `\nContest data refreshed` +
    `\n` +
    `\nDownloaded  : ${downloaded}` +
    `\nSkipped     : ${skipped}` +
    `\nFailed      : ${failed}` +
    `\n──────────────────────────────`
  );
}

downloadContestData().catch((error) => {
  console.error("\n❌ Unexpected error:", error);
});