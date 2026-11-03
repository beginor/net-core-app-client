import { App as AntApp, ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { AppLayout } from './components/app-layout';
import { RequireAuth } from './components/require-auth';
import { BASE_PATH } from './config';
import { FeedbackBridge } from './utils/feedback';

/** Wrap a lazily loaded page in a suspense boundary. */
function page(loader: () => Promise<{ default: React.ComponentType }>): ReactNode {
    const Page = lazy(loader);
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center"><Spin /></div>}>
            <Page />
        </Suspense>
    );
}

/** Routes of the admin module, mounted under /admin. */
const ADMIN_ROUTES = [
    { path: 'dashboard', element: page(() => import('./pages/admin/dashboard/dashboard-page')) },
    { path: 'users', element: page(() => import('./pages/admin/users/users-page')) },
    { path: 'roles', element: page(() => import('./pages/admin/roles/roles-page')) },
    { path: 'privileges', element: page(() => import('./pages/admin/privileges/privileges-page')) },
    { path: 'nav-items', element: page(() => import('./pages/admin/nav-items/nav-items-page')) },
    { path: 'organize-units', element: page(() => import('./pages/admin/organize-units/organize-units-page')) },
    { path: 'storages', element: page(() => import('./pages/admin/storages/storages-page')) },
    { path: 'logs', element: page(() => import('./pages/admin/logs/logs-page')) },
    { path: 'audit-logs', element: page(() => import('./pages/admin/audit-logs/audit-logs-page')) },
];

export function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <AntApp className="h-full">
                <FeedbackBridge />
                <BrowserRouter basename={BASE_PATH}>
                    <Routes>
                        <Route path="/login" element={page(() => import('./pages/login/login-page'))} />
                        <Route
                            path="/"
                            element={
                                <RequireAuth>
                                    <AppLayout />
                                </RequireAuth>
                            }
                        >
                            <Route index element={<Navigate to="/home" replace />} />
                            <Route path="home" element={page(() => import('./pages/home/home-page'))} />
                            <Route path="about" element={page(() => import('./pages/about/about-page'))} />
                            <Route path="about/:src" element={page(() => import('./pages/about/iframe-page'))} />
                            <Route path="account">
                                <Route index element={<Navigate to="info" replace />} />
                                <Route path="info" element={page(() => import('./pages/account/user-info-page'))} />
                                <Route path="tokens" element={page(() => import('./pages/account/token-list-page'))} />
                            </Route>
                            <Route path="admin">
                                <Route index element={<Navigate to="dashboard" replace />} />
                                {ADMIN_ROUTES.map(route => (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        element={route.element}
                                    />
                                ))}
                            </Route>
                            <Route path="*" element={<Navigate to="/home" replace />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AntApp>
        </ConfigProvider>
    );
}
