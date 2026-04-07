/** A team an employee belongs to. */
export interface Team {
  /** Internal database ID. */
  id: string;
  /** Human-readable team name. */
  name: string;
}

/** A connected third-party account (e.g. GitHub, Jira) for an employee. */
export interface Account {
  /** Account category key, e.g. `"vcs"`, `"tms"`, `"ims"`, `"cal"`. */
  type: string;
  /** Integration source name, e.g. `"GitHub"`. */
  source: string;
  /** Account identifier within that source. */
  uid: string;
}

/** Full employee record returned by the GraphQL API. */
export interface Employee {
  /** Internal database ID. */
  id: string;
  /** Human-readable unique identifier. */
  uid: string;
  /** Full display name of the employee. */
  name: string;
  /** Work email address. */
  email: string;
  /** URL to the employee's profile photo, or empty string. */
  photoUrl: string;
  /** Whether the employee is currently inactive in the system. */
  inactive: boolean;
  /** Tracking inclusion status, e.g. `"Included"` or `"Ignored"`. */
  trackingStatus: string;
  /** Tracking activity category, e.g. `"Active"` or `"Inactive"`. */
  trackingCategory: string;
  /** Teams this employee belongs to. */
  teams: Team[];
  /** Third-party integration accounts linked to this employee. */
  accounts: Account[];
}

/** Relay-style pagination metadata returned alongside a connection. */
export interface PageInfo {
  /** Whether there is a page after the current one. */
  hasNextPage: boolean;
  /** Whether there is a page before the current one. */
  hasPreviousPage: boolean;
  /** Cursor of the first edge in the current page. */
  startCursor: string;
  /** Cursor of the last edge in the current page; pass as `after` to fetch the next page. */
  endCursor: string;
}

/** Team shape returned inside `FilterOptions`. */
export interface FilterOptionsTeam {
  /** Unique identifier used as the filter value. */
  uid: string;
  /** Human-readable team name used as the display label. */
  name: string;
}

/** Account type shape returned inside `FilterOptions`. */
export interface FilterOptionsAccountType {
  /** Account category key, e.g. `"vcs"`, `"tms"`. */
  type: string;
  /** Integration source name, e.g. `"GitHub"`. */
  source: string;
}

/** All available filter values returned by the `filterOptions` GraphQL query. */
export interface FilterOptions {
  /** Available team options. */
  teams: FilterOptionsTeam[];
  /** Available tracking status values, e.g. `["Included", "Ignored"]`. */
  trackingStatuses: string[];
  /** Available tracking category values, e.g. `["Active", "Inactive"]`. */
  trackingCategories: string[];
  /** Available account type options. */
  accountTypes: FilterOptionsAccountType[];
}

/** A single selectable item in a filter popover. */
export interface FilterItem {
  /** The raw value sent to the API. */
  value: string;
  /** The human-readable label shown in the UI. */
  label: string;
}

/** Union of supported filter dimension keys. */
export type FilterKey = 'teams' | 'trackingStatuses' | 'accountTypes';

/** Maps each filter dimension to its currently selected values. */
export type FilterValues = Record<FilterKey, string[]>;

/** Filter payload sent to the GraphQL API, or `null` when no filters are active. */
export type ApiFilter = Record<string, string[]> | null;
