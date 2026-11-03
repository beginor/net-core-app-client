import { useEffect } from 'react';

import { useAppStore } from '../stores/app-store';
import type { Breadcrumb } from '../types';

/** Set the header breadcrumbs for the current page. */
export function useBreadcrumbs(items: Breadcrumb[]): void {
    const setBreadcrumbs = useAppStore(state => state.setBreadcrumbs);
    const key = JSON.stringify(items);
    useEffect(() => {
        setBreadcrumbs(JSON.parse(key) as Breadcrumb[]);
        return () => setBreadcrumbs([]);
    }, [key, setBreadcrumbs]);
}
