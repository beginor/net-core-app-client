import { Layout } from 'antd';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';

import { useAppStore } from '../stores/app-store';
import { AppHeader } from './app-header';
import { NavSidebar } from './nav-sidebar';

const { Sider, Header, Content } = Layout;

const KEEP_ONLINE_DELAY = 1000 * 60 * 5;

/** Shell layout: collapsible sider, header and routed content. */
export function AppLayout() {
    const collapsed = useAppStore(state => state.siderCollapsed);
    const toggleSider = useAppStore(state => state.toggleSider);
    const refreshAccount = useAppStore(state => state.refreshAccount);
    const loadMenu = useAppStore(state => state.loadMenu);
    const accountId = useAppStore(state => state.account.id);
    const { pathname } = useLocation();

    useEffect(() => {
        if (!accountId) {
            return;
        }
        void loadMenu().catch((ex: unknown) => {
            console.error(ex);
        });
    }, [accountId, loadMenu]);

    // Keep the session alive by refreshing the account every five minutes.
    useEffect(() => {
        let timer = 0;
        const tick = (): void => {
            void refreshAccount()
                .catch((ex: unknown) => {
                    console.error(ex);
                })
                .finally(() => {
                    timer = window.setTimeout(tick, KEEP_ONLINE_DELAY);
                });
        };
        timer = window.setTimeout(tick, KEEP_ONLINE_DELAY);
        return () => window.clearTimeout(timer);
    }, [refreshAccount]);

    return (
        <Layout className="h-full overflow-hidden">
            <Sider
                theme="dark"
                width={220}
                collapsible
                collapsed={collapsed}
                trigger={null}
                breakpoint="xxl"
                onBreakpoint={broken => {
                    if (broken !== collapsed) {
                        toggleSider();
                    }
                }}
            >
                <NavSidebar collapsed={collapsed} />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0, height: 48, lineHeight: '48px' }}>
                    <AppHeader />
                </Header>
                <Content className="grow overflow-hidden px-3" key={pathname}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
