import { useCallback, useEffect, useRef, useState } from 'react';

import type { PaginatedResult } from '../types';
import { showMessage } from '../utils/feedback';

export const PAGE_SIZE_OPTIONS = [20, 40, 60, 80, 100, 200];

export interface DataListOptions<T, S extends Record<string, unknown>> {
    /** Fetch a page, receives the search model including skip and take. */
    fetch: (search: S & { skip: number; take: number }) => Promise<PaginatedResult<T>>;
    /** Initial search model, skip and take are managed by the hook. */
    initialSearch?: Partial<S>;
    /** Message shown when loading fails. */
    errorText?: string;
    /** Skip the automatic first load. */
    manual?: boolean;
}

export interface DataListState<T, S> {
    data: T[];
    total: number;
    loading: boolean;
    pageIndex: number;
    pageSize: number;
    search: S;
    setSearch: (patch: Partial<S>) => void;
    /** Load a page, defaults to the current page and size. */
    load: (page?: number, size?: number) => Promise<void>;
    /** Reset to the first page and reload, merging the patch into the search model. */
    research: (patch?: Partial<S>) => Promise<void>;
    /** Reload the current page. */
    reload: () => Promise<void>;
}

/** Shared search, pagination and loading state for list pages. */
export function useDataList<T, S extends Record<string, unknown>>(
    options: DataListOptions<T, S>,
): DataListState<T, S> {
    const { fetch, initialSearch, errorText = '加载数据出错！', manual = false } = options;
    const [data, setData] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
    const [search, setSearchState] = useState<S>(() => ({ ...(initialSearch ?? {}) }) as S);

    // Latest values for the stable callbacks, synced after each render.
    const fetchRef = useRef(fetch);
    const searchRef = useRef(search);
    const pageRef = useRef({ pageIndex, pageSize });
    useEffect(() => {
        fetchRef.current = fetch;
        searchRef.current = search;
        pageRef.current = { pageIndex, pageSize };
    });

    const loadPage = useCallback(
        async (page: number, size: number, model: S): Promise<void> => {
            setPageIndex(page);
            setPageSize(size);
            setLoading(true);
            try {
                const result = await fetchRef.current({
                    ...model,
                    skip: size * (page - 1),
                    take: size,
                } as S & { skip: number; take: number });
                setTotal(result.total ?? 0);
                setData(result.data ?? []);
            }
            catch (ex) {
                console.error(ex);
                setTotal(0);
                setData([]);
                showMessage('error', errorText);
            }
            finally {
                setLoading(false);
            }
        },
        [errorText],
    );

    const load = useCallback(
        (page?: number, size?: number): Promise<void> => loadPage(
            page ?? pageRef.current.pageIndex,
            size ?? pageRef.current.pageSize,
            searchRef.current,
        ),
        [loadPage],
    );

    const research = useCallback(
        (patch?: Partial<S>): Promise<void> => {
            const next = { ...searchRef.current, ...patch } as S;
            setSearchState(next);
            return loadPage(1, pageRef.current.pageSize, next);
        },
        [loadPage],
    );

    const reload = useCallback((): Promise<void> => load(), [load]);

    const setSearch = useCallback((patch: Partial<S>): void => {
        setSearchState(prev => ({ ...prev, ...patch }));
    }, []);

    useEffect(() => {
        if (!manual) {
            void load(1);
        }
        // Only run on mount, filters are applied by research().
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { data, total, loading, pageIndex, pageSize, search, setSearch, load, research, reload };
}
