import { Card } from 'antd';
import { Link, useLocation } from 'react-router';

import { EChart } from '../../../components/e-chart';
import { useBreadcrumbs } from '../../../hooks/use-breadcrumbs';
import { selectSidebarNodes, useAppStore } from '../../../stores/app-store';

const CHARTS = [
    { title: '最近30天访问量统计', config: 'assets/echarts/audit-logs/traffic.json' },
    { title: '最近30天服务状态码统计', config: 'assets/echarts/audit-logs/status.json' },
    { title: '最近30天服务响应时间统计', config: 'assets/echarts/audit-logs/duration.json' },
    { title: '最近30天用户访问统计', config: 'assets/echarts/audit-logs/user.json' },
];

/** Admin dashboard: shortcut cards plus four audit log charts. */
export function DashboardPage() {
    useBreadcrumbs([{ label: '首页', url: '/' }, { label: '管理' }]);
    const menuRoot = useAppStore(state => state.menuRoot);
    const { pathname } = useLocation();
    const nodes = selectSidebarNodes(menuRoot, pathname);

    return (
        <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                {nodes
                    .filter(node => node.url && node.url !== pathname)
                    .map(node => (
                        <Card key={node.id ?? node.url} size="small">
                            <h5 className="text-lg font-bold">
                                <Link to={node.url!} className="transition-colors hover:text-blue-600">
                                    {node.title}
                                </Link>
                            </h5>
                        </Card>
                    ))}
            </div>
            <div className="mt-3">
                <Card title={CHARTS[0].title}>
                    <EChart config={CHARTS[0].config} style={{ height: 200 }} />
                </Card>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
                {CHARTS.slice(1).map(chart => (
                    <Card key={chart.config} title={chart.title}>
                        <EChart config={chart.config} style={{ height: 200 }} />
                    </Card>
                ))}
            </div>
        </>
    );
}

export default DashboardPage;
