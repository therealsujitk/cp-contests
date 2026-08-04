import { writable } from 'svelte/store';

export interface Account {
  platform: 'codeforces' | 'codechef' | 'atcoder' | 'leetcode';
  handle: string;
};

export const selectedAccount = writable<Account | null>(null);
