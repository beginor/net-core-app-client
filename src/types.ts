/** Account information returned by GET /api/account. */
export interface AccountInfo {
    id: string;
    userName?: string;
    givenName?: string;
    surname?: string;
    roles: Record<string, boolean>;
    privileges: Record<string, boolean>;
    token?: string;
}

/** Navigation node returned by GET /api/account/menu. */
export interface NavigationNode {
    id?: string;
    title?: string;
    url?: string;
    tooltip?: string;
    isHidden?: boolean;
    icon?: string;
    target?: string;
    frameUrl?: string;
    children?: NavigationNode[];
}

/** Paginated response shape shared by all list endpoints. */
export interface PaginatedResult<T> {
    skip?: number;
    take?: number;
    total?: number;
    data?: T[];
}

/** Lightweight id + name pair used by selects and trees. */
export interface IdName {
    id: string;
    name: string;
}

/** Breadcrumb item rendered in the header. */
export interface Breadcrumb {
    label: string;
    url?: string;
}
