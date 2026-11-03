import { API_ROOT } from '../config';
import type { PaginatedResult } from '../types';
import { http } from './http';

export interface AppLogModel {
    id: string;
    createdAt?: string;
    thread?: string;
    level?: string;
    logger?: string;
    message?: string;
    exception?: string;
}

export interface AuditLogModel {
    id?: string;
    ip?: string;
    hostName?: string;
    requestPath?: string;
    requestMethod: string;
    userName?: string;
    startAt?: string;
    duration: number;
    responseCode: number;
    controllerName?: string;
    actionName?: string;
    description?: string;
}

export interface LogSearchModel {
    skip: number;
    take: number;
    startDate?: string;
    endDate?: string;
    level?: string;
    userName?: string;
    [key: string]: string | number | undefined;
}

export const logsApi = {
    search: (model: LogSearchModel) =>
        http.get<PaginatedResult<AppLogModel>>(`${API_ROOT}/logs`, { params: model }),
    getById: (id: string) => http.get<AppLogModel>(`${API_ROOT}/logs/${id}`),
};

export const auditLogsApi = {
    search: (model: LogSearchModel) =>
        http.get<PaginatedResult<AuditLogModel>>(`${API_ROOT}/audit-logs`, { params: model }),
};

/** Tailwind text color for a log level. */
export function levelColor(level?: string): string {
    switch (level) {
        case 'INFO': return 'text-blue-500';
        case 'WARN': return 'text-yellow-500';
        case 'ERROR':
        case 'FATAL': return 'text-red-500';
        default: return '';
    }
}

/** Tailwind text color for an HTTP method. */
export function methodColor(method: string): string {
    switch (method.toLowerCase()) {
        case 'get': return 'text-blue-500';
        case 'post': return 'text-green-500';
        case 'put': return 'text-yellow-500';
        case 'delete': return 'text-red-500';
        default: return '';
    }
}

/** Tailwind text color for a duration in milliseconds. */
export function durationColor(duration: number): string {
    if (duration < 1000) {
        return 'text-green-500';
    }
    return duration < 2000 ? 'text-yellow-500' : 'text-red-500';
}

/** Tailwind text color for an HTTP status code. */
export function statusColor(code: number): string {
    if (code < 300) {
        return 'text-green-500';
    }
    return code < 500 ? 'text-yellow-500' : 'text-red-500';
}
