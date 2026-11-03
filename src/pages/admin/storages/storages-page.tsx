import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';

import type { SearchModel } from '../../../api/crud';
import { storagesApi } from '../../../api/storages';
import type { StorageModel } from '../../../api/storages';
import { useBreadcrumbs } from '../../../hooks/use-breadcrumbs';
import { useDataList } from '../../../hooks/use-data-list';
import { useAppStore } from '../../../stores/app-store';
import { confirmDialog, showMessage } from '../../../utils/feedback';
import { StorageDetailDrawer } from './storage-detail-drawer';

interface DrawerState {
    storage: StorageModel;
    editable: boolean;
}

/** Application storage list. */
export function StoragesPage() {
    useBreadcrumbs([{ label: '首页', url: '/' }, { label: '管理', url: '/admin/dashboard' }, { label: '存储管理' }]);
    const privileges = useAppStore(state => state.account.privileges);
    const [drawer, setDrawer] = useState<DrawerState | null>(null);

    const list = useDataList<StorageModel, SearchModel>({
        fetch: search => storagesApi.search(search),
        errorText: '加载应用存储数据出错！',
    });

    const remove = async (id: string): Promise<void> => {
        if (!(await confirmDialog('确认删除么？'))) {
            return;
        }
        try {
            await storagesApi.remove(id);
            await list.reload();
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '删除应用存储出错！');
        }
    };

    const columns: TableProps<StorageModel>['columns'] = [
        {
            title: '#',
            width: 50,
            align: 'right',
            render: (_v, _r, index) => (list.pageIndex - 1) * list.pageSize + index + 1,
        },
        { title: '别名', dataIndex: 'aliasName' },
        { title: '目录', dataIndex: 'rootFolder' },
        { title: '是否只读', dataIndex: 'readonly', align: 'center', render: v => (v ? '是' : '否') },
        { title: '允许的角色', dataIndex: 'roles', render: value => (value as string[] | undefined)?.join(', ') },
        {
            title: '操作',
            align: 'center',
            width: 120,
            render: (_v, record) => (
                <Space.Compact size="small">
                    {privileges['app_storages.read_by_id'] && (
                        <Tooltip title="详情">
                            <Button
                                icon={<InfoCircleOutlined />}
                                onClick={() => setDrawer({ storage: record, editable: false })}
                            />
                        </Tooltip>
                    )}
                    {privileges['app_storages.update'] && (
                        <Tooltip title="编辑">
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => setDrawer({ storage: record, editable: true })}
                            />
                        </Tooltip>
                    )}
                    {privileges['app_storages.delete'] && (
                        <Tooltip title="删除">
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => void remove(record.id)}
                            />
                        </Tooltip>
                    )}
                </Space.Compact>
            ),
        },
    ];

    return (
        <>
            <Card
                className="ant-card-data-list"
                title="存储管理"
                extra={
                    <Space.Compact>
                        {privileges['app_storages.create'] && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setDrawer({
                                    storage: { id: '0', aliasName: '', rootFolder: '', readonly: true, roles: [] },
                                    editable: true,
                                })}
                            >
                                新建存储目录
                            </Button>
                        )}
                        <Button icon={<SyncOutlined />} onClick={() => void list.reload()}>
                            刷新
                        </Button>
                    </Space.Compact>
                }
            >
                <Table<StorageModel>
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
                <StorageDetailDrawer
                    storage={drawer.storage}
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

export default StoragesPage;
