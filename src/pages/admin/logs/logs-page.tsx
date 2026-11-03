import { InfoCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Descriptions, Select, Space, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

import type { SearchModel } from '../../../api/crud';
import { levelColor, logsApi } from '../../../api/logs';
import type { AppLogModel } from '../../../api/logs';
import { DetailDrawer } from '../../../components/detail-drawer';
import { useBreadcrumbs } from '../../../hooks/use-breadcrumbs';
import { useDataList } from '../../../hooks/use-data-list';
import { useAppStore } from '../../../stores/app-store';
import { formatDateTime } from '../../../utils/date';
import { showMessage } from '../../../utils/feedback';

const LEVELS = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];

interface LogSearch extends SearchModel {
    level?: string;
    startDate?: string;
    endDate?: string;
}

/** Application log list, filtered by level and date range. */
export function LogsPage() {
    useBreadcrumbs([{ label: '首页', url: '/' }, { label: '管理', url: '/admin/dashboard' }, { label: '运行日志' }]);
    const privileges = useAppStore(state => state.account.privileges);
    const [detail, setDetail] = useState<AppLogModel | null>(null);

    const list = useDataList<AppLogModel, LogSearch>({
        fetch: search => logsApi.search(search),
        initialSearch: {
            level: '',
            startDate: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD'),
        },
        errorText: '加载运行日志数据出错！',
    });

    const research = (patch: Partial<LogSearch>): void => {
        void list.research(patch);
    };

    const showDetail = async (id: string): Promise<void> => {
        try {
            setDetail(await logsApi.getById(id));
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '获取指定的应用程序日志出错！');
        }
    };

    const columns: TableProps<AppLogModel>['columns'] = [
        {
            title: '#',
            width: 50,
            align: 'right',
            render: (_v, _r, index) => (list.pageIndex - 1) * list.pageSize + index + 1,
        },
        {
            title: '产生时间',
            dataIndex: 'createdAt',
            render: value => formatDateTime(value as string),
        },
        {
            title: '日志级别',
            dataIndex: 'level',
            render: value => <span className={levelColor(value as string)}>{value as string}</span>,
        },
        { title: '记录者', dataIndex: 'logger' },
        {
            title: '日志消息',
            dataIndex: 'message',
            ellipsis: true,
            width: 480,
        },
        {
            title: '操作',
            align: 'center',
            width: 60,
            render: (_v, record) => privileges['app_logs.read_by_id'] && (
                <Tooltip title="详情">
                    <Button
                        icon={<InfoCircleOutlined />}
                        onClick={() => void showDetail(record.id)}
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <>
            <Card
                className="ant-card-data-list"
                title="运行日志"
                extra={
                    <Space wrap>
                        <Select
                            style={{ width: 130 }}
                            value={list.search.level}
                            onChange={value => research({ level: value })}
                            options={[
                                { value: '', label: '全部日志级别' },
                                ...LEVELS.map(item => ({ value: item, label: item })),
                            ]}
                        />
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
                        <Button icon={<SyncOutlined />} onClick={() => void list.reload()}>
                            刷新
                        </Button>
                    </Space>
                }
            >
                <Table<AppLogModel>
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
            {detail && (
                <DetailDrawer open title="查看应用程序日志" onClose={() => setDetail(null)}>
                    <Descriptions column={2} bordered size="small">
                        <Descriptions.Item label="日志ID">{detail.id}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{formatDateTime(detail.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="线程">{detail.thread}</Descriptions.Item>
                        <Descriptions.Item label="日志级别">{detail.level}</Descriptions.Item>
                        <Descriptions.Item label="记录者" span={2}>{detail.logger}</Descriptions.Item>
                        <Descriptions.Item label="日志消息" span={2}>{detail.message || '无日志消息'}</Descriptions.Item>
                        <Descriptions.Item label="异常信息" span={2}>
                            <pre className="whitespace-pre-wrap">{detail.exception || '无日志信息'}</pre>
                        </Descriptions.Item>
                    </Descriptions>
                </DetailDrawer>
            )}
        </>
    );
}

export default LogsPage;
