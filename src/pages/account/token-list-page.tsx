import { DeleteOutlined, EditOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Input, Space, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

import { deleteUserToken, searchUserTokens } from '../../api/account';
import type { UserTokenModel } from '../../api/account';
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';
import { useDataList } from '../../hooks/use-data-list';
import { confirmDialog, showMessage } from '../../utils/feedback';
import { TokenDetailDrawer } from './token-detail-drawer';

interface TokenSearch {
    keywords?: string;
    [key: string]: string | number | undefined;
}

interface DrawerState {
    id: string;
    editable: boolean;
}

/** List of the current user's API tokens. */
export function TokenListPage() {
    useBreadcrumbs([{ label: '首页', url: '/' }, { label: '我的凭证' }]);
    const [drawer, setDrawer] = useState<DrawerState | null>(null);

    const list = useDataList<UserTokenModel, TokenSearch>({
        fetch: search => searchUserTokens(search),
        initialSearch: { keywords: '' },
        errorText: '加载凭证列表出错！',
    });

    const remove = async (id: string): Promise<void> => {
        if (!(await confirmDialog('确定要删除该凭证吗？'))) {
            return;
        }
        try {
            await deleteUserToken(id);
            showMessage('success', '删除凭证成功！');
            await list.reload();
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '删除凭证出错！');
        }
    };

    const columns: TableProps<UserTokenModel>['columns'] = [
        {
            title: '#',
            width: 50,
            align: 'right',
            render: (_v, _r, index) => (list.pageIndex - 1) * list.pageSize + index + 1,
        },
        { title: '名称', dataIndex: 'name' },
        { title: '凭证值', dataIndex: 'value', align: 'center' },
        { title: '权限', align: 'right', render: (_v, r) => r.privileges?.length ?? 0 },
        { title: '代表的角色', align: 'right', render: (_v, r) => r.roles?.length ?? 0 },
        { title: '允许的地址', align: 'right', render: (_v, r) => r.urls?.length ?? 0 },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            align: 'center',
            render: value => (value ? dayjs(value as string).format('YYYY-MM-DD') : ''),
        },
        {
            title: '过期时间',
            dataIndex: 'expiresAt',
            align: 'center',
            render: (value) => {
                if (!value) {
                    return '';
                }
                const expired = dayjs(value as string).isBefore(dayjs());
                return (
                    <span className={expired ? 'text-red-500' : ''}>
                        {dayjs(value as string).format('YYYY-MM-DD')}
                    </span>
                );
            },
        },
        {
            title: '操作',
            align: 'center',
            width: 90,
            render: (_v, record) => (
                <Space.Compact size="small">
                    <Tooltip title="编辑">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => setDrawer({ id: record.id ?? '0', editable: true })}
                        />
                    </Tooltip>
                    <Tooltip title="删除">
                        <Button danger icon={<DeleteOutlined />} onClick={() => void remove(record.id ?? '')} />
                    </Tooltip>
                </Space.Compact>
            ),
        },
    ];

    return (
        <>
            <Card
                className="ant-card-data-list"
                title="我的凭证"
                extra={
                    <Space wrap>
                        <Input.Search
                            allowClear
                            placeholder="输入关键字进行搜索"
                            value={list.search.keywords}
                            onChange={e => list.setSearch({ keywords: e.target.value })}
                            onSearch={() => void list.research()}
                        />
                        <Space.Compact>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setDrawer({ id: '0', editable: true })}
                            >
                                新建凭证
                            </Button>
                            <Button icon={<SyncOutlined />} onClick={() => void list.reload()}>
                                刷新
                            </Button>
                        </Space.Compact>
                    </Space>
                }
            >
                <Table<UserTokenModel>
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
                        showTotal: (count, range) =>
                            `当前显示 ${count} 条记录中的第 ${range[0]} 至 ${range[1]} 条`,
                        onChange: (page, size) => void list.load(page, size),
                    }}
                />
            </Card>
            {drawer && (
                <TokenDetailDrawer
                    id={drawer.id}
                    editable={drawer.editable}
                    onClose={result => {
                        setDrawer(null);
                        if (result === 'ok') {
                            void list.reload();
                        }
                    }}
                />
            )}
        </>
    );
}

export default TokenListPage;
