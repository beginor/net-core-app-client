import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';

import { useAppStore } from '../stores/app-store';

interface RequireAuthProps {
    children: React.ReactNode;
}

/** Resolve the account once before rendering protected routes. */
export function RequireAuth({ children }: RequireAuthProps) {
    const account = useAppStore(state => state.account);
    const refreshAccount = useAppStore(state => state.refreshAccount);
    const [checked, setChecked] = useState(account.id !== '');
    const location = useLocation();

    useEffect(() => {
        if (checked) {
            return;
        }
        let cancelled = false;
        refreshAccount()
            .catch((ex: unknown) => {
                console.error(ex);
            })
            .finally(() => {
                if (!cancelled) {
                    setChecked(true);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [checked, refreshAccount]);

    if (!checked) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spin />
            </div>
        );
    }

    const currentId = useAppStore.getState().account.id;
    if (!currentId) {
        const returnUrl = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
    }

    return <>{children}</>;
}
