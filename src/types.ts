export interface Team {
  id: string;
  name: string;
}

export interface Account {
  type: string;
  source: string;
  uid: string;
}

export interface Employee {
  id: string;
  uid: string;
  name: string;
  email: string;
  photoUrl: string;
  inactive: boolean;
  trackingStatus: string;
  trackingCategory: string;
  teams: Team[];
  accounts: Account[];
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface FilterOptionsTeam {
  uid: string;
  name: string;
}

export interface FilterOptionsAccountType {
  type: string;
  source: string;
}

export interface FilterOptions {
  teams: FilterOptionsTeam[];
  trackingStatuses: string[];
  trackingCategories: string[];
  accountTypes: FilterOptionsAccountType[];
}

export interface FilterItem {
  value: string;
  label: string;
}

export type FilterKey = 'teams' | 'trackingStatuses' | 'accountTypes';

export type FilterValues = Record<FilterKey, string[]>;

export type ApiFilter = Record<string, string[]> | null;
