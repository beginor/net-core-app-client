import { API_ROOT } from '../config';
import { createCrud } from './crud';
import { http } from './http';

export interface StorageModel {
    id: string;
    aliasName: string;
    rootFolder: string;
    readonly: boolean;
    roles?: string[];
}

export interface StorageContent {
    title: string;
    alias: string;
    path: string;
    filter?: string;
    folders?: string[];
    files?: string[];
}

export const storagesApi = {
    ...createCrud<StorageModel>(`${API_ROOT}/storages`),
    browse: (alias: string, path: string, filter?: string) =>
        http.get<StorageContent>(`${API_ROOT}/storages/${alias}/browse`, {
            params: { path, filter: filter ?? '' },
        }),
};
