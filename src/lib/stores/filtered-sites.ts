import { writable } from 'svelte/store';

export const filteredSites = writable<Record<string, boolean>>({ 
  atcoder: true,
  codechef: true,
  codeforces: true,
  leetcode: true
});
