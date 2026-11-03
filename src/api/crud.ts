import type { PaginatedResult } from '../types';
import { http } from './http';

/** Search model shared by all list endpoints. */
export interface SearchModel {
    skip: number;
    take: number;
    [key: string]: string | number | undefined;
}

export interface CrudApi<T> {
    search: (model: SearchModel) => Promise<PaginatedResult<T>>;
    getById: (id: string) => Promise<T>;
    create: (model: T) => Promise<T>;
    update: (id: string, model: T) => Promise<T>;
    remove: (id: string) => Promise<void>;
}

/** Build a client for a resource exposing the standard CRUD routes. */
export function createCrud<T extends { id?: string }>(base: string): CrudApi<T> {
    return {
        search: model => http.get<PaginatedResult<T>>(base, { params: model }),
        getById: id => http.get<T>(`${base}/${id}`),
        create: model => http.post<T>(base, model),
        update: (id, model) => http.put<T>(`${base}/${id}`, model),
        remove: id => http.delete(`${base}/${id}`),
    };
}
