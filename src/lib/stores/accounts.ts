import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

export interface Account {
  platform: 'codeforces' | 'codechef' | 'atcoder' | 'leetcode';
  handle: string;
};

let accounts: Account[] = [];
export const selectedAccount = writable<Account | null>(null);

if (browser) {
  const savedAccounts = localStorage.getItem('accounts');

  if (savedAccounts) {
    accounts = JSON.parse(savedAccounts);
  }

  if (accounts.length > 0) {
    selectedAccount.set(accounts[0]);
  }
}

const refreshLocalStorage = () => {
  localStorage.setItem('accounts', JSON.stringify(accounts));
};

export const getAccounts = () => accounts;

export const addAccount = (account: Account) => {
  accounts.push(account);
  selectedAccount.set(account);
  refreshLocalStorage();
};

export const removeAccount = (account: Account) => {
  accounts = accounts.filter(a => a !== account);
  selectedAccount.set(accounts.length > 0 ? accounts[0] : null);
  refreshLocalStorage();
};
