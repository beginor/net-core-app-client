import { SyncOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';

import type { SearchModel } from '../../../api/crud';
import { auditLogsApi, durationColor, methodColor, statusColor } from '../../../api/logs';
import type { AuditLogModel } from '../../../api/logs';
import { useBreadcrumbs } from '../../../hooks/use-breadcrumbs';
import { useDataList } from '../../../hooks/use-data-list';
import { formatDateTime } from '../../../utils/date';

interface AuditSearch extends SearchModel {
    userName?: string;
    startDate?: string;
    endDate?: string;
}

/** Audit log list, filtered by date range and user name. */
export function AuditLogsPage() {
    useBreadcrumbs([{ label: '首页', url: '/' }, { label: '管理', url: '/admin/dashboard' }, { label: '审计日志' }]);
    const list = useDataList<AuditLogModel, AuditSearch>({
        fetch: search => auditLogsApi.search(search),
        initialSearch: {
            userName: '',
            startDate: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD'),
        },
        errorText: '加载审计日志数据出错！',
    });

    const research = (patch: Partial<AuditSearch>): void => {
        void list.research(patch);
    };

    const columns: TableProps<AuditLogModel>['columns'] = [
        {
            title: '#',
            width: 50,
            align: 'right',
            render: (_v, _r, index) => (list.pageIndex - 1) * list.pageSize + index + 1,
        },
        { title: 'IP地址', dataIndex: 'ip' },
        { title: '主机名', dataIndex: 'hostName' },
        { title: '请求地址', dataIndex: 'requestPath', ellipsis: true, width: 320 },
        {
            title: '请求方法',
            dataIndex: 'requestMethod',
            align: 'center',
            render: value => (
                <span className={methodColor(value as string)}>{value as string}</span>
            ),
        },
        { title: '用户名', dataIndex: 'userName', align: 'center' },
        {
            title: '开始时间',
            dataIndex: 'startAt',
            align: 'center',
            render: value => formatDateTime(value as string),
        },
        {
            title: '耗时',
            dataIndex: 'duration',
            align: 'right',
            render: value => (
                <span className={durationColor(value as number)}>{value as number}</span>
            ),
        },
        {
            title: '响应代码',
            dataIndex: 'responseCode',
            align: 'right',
            render: value => (
                <span className={statusColor(value as number)}>{value as number}</span>
            ),
        },
        { title: '控制器', dataIndex: 'controllerName' },
        { title: '动作名称', dataIndex: 'actionName' },
        { title: '说明', dataIndex: 'description' },
    ];

    return (
        <Card
            className="ant-card-data-list"
            title="审计日志"
            extra={
                <Space wrap>
                    <DatePicker.RangePicker
                        allowClear={false}
                        value={[dayjs(list.search.startDate), dayjs(list.search.endDate)]}
                        disabledDate={current => current.isAfter(dayjs(), 'day')}
                        onChange={(value) => {
                            if (value?.[0] && value[1]) {
                                research({
                                    startDate: value[0].format('YYYY-MM-DD'),
                                    endDate: value[1].format('YYYY-MM-DD'),
                                });
                            }
                        }}
                    />
                    <Input.Search
                        allowClear
                        placeholder="按用户名搜索"
                        value={list.search.userName}
                        onChange={e => list.setSearch({ userName: e.target.value })}
                        onSearch={() => research({})}
                    />
                    <Button icon={<SyncOutlined />} onClick={() => void list.reload()}>刷新</Button>
                </Space>
            }
        >
            <Table<AuditLogModel>
                size="small"
                rowKey="id"
                columns={columns}
                dataSource={list.data}
                loading={list.loading}
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: list.pageIndex,
                    pageSize: list.pageSize,
                    total: list.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (count, r) =>
                        `当前显示 ${count} 条记录中的第 ${r[0]} 至 ${r[1]} 条`,
                    onChange: (page, size) => void list.load(page, size),
                }}
            />
        </Card>
    );
}

export default AuditLogsPage;
