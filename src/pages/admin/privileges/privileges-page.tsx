import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Select, Space, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from 'react';

import { privilegesApi } from '../../../api/privileges';
import type { AppPrivilegeModel } from '../../../api/privileges';
import { useBreadcrumbs } from '../../../hooks/use-breadcrumbs';
import { useDataList } from '../../../hooks/use-data-list';
import type { SearchModel } from '../../../api/crud';
import { useAppStore } from '../../../stores/app-store';
import { confirmDialog, showMessage } from '../../../utils/feedback';
import { PrivilegeDetailDrawer } from './privilege-detail-drawer';

interface DrawerState {
    privilege: AppPrivilegeModel;
    editable: boolean;
}

/** System privilege list, filterable by module. */
export function PrivilegesPage() {
    useBreadcrumbs([{ label: '首页', url: '/' }, { label: '管理', url: '/admin/dashboard' }, { label: '权限管理' }]);
    const privileges = useAppStore(state => state.account.privileges);
    const [modules, setModules] = useState<string[]>([]);
    const [drawer, setDrawer] = useState<DrawerState | null>(null);

    const list = useDataList<AppPrivilegeModel, SearchModel>({
        fetch: search => privilegesApi.search(search),
        initialSearch: { module: '' },
        errorText: '加载系统权限数据出错！',
    });

    useEffect(() => {
        privilegesApi.getModules()
            .then(setModules)
            .catch((ex: unknown) => {
                console.error(ex);
                showMessage('error', '加载模块列表出错！');
            });
    }, []);

    const remove = async (id: string): Promise<void> => {
        if (!(await confirmDialog('确认删除么？'))) {
            return;
        }
        try {
            await privilegesApi.remove(id);
            await list.reload();
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '删除系统权限出错！');
        }
    };

    const columns: TableProps<AppPrivilegeModel>['columns'] = [
        {
            title: '#',
            width: 50,
            align: 'right',
            render: (_v, _r, index) => (list.pageIndex - 1) * list.pageSize + index + 1,
        },
        { title: '权限模块', dataIndex: 'module' },
        { title: '权限名称', dataIndex: 'name' },
        { title: '权限描述', dataIndex: 'description' },
        {
            title: '是否必须',
            dataIndex: 'isRequired',
            align: 'center',
            render: value => <span className={value ? 'text-red-500' : ''}>{value ? '是' : '否'}</span>,
        },
        {
            title: '操作',
            align: 'center',
            width: 120,
            render: (_v, record) => (
                <Space.Compact size="small">
                    {privileges['app_privileges.read_by_id'] && (
                        <Tooltip title="详情">
                            <Button
                                icon={<InfoCircleOutlined />}
                                onClick={() => setDrawer({ privilege: record, editable: false })}
                            />
                        </Tooltip>
                    )}
                    {privileges['app_privileges.update'] && (
                        <Tooltip title="编辑">
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => setDrawer({ privilege: record, editable: true })}
                            />
                        </Tooltip>
                    )}
                    {privileges['app_privileges.delete'] && (
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
                title="权限管理"
                extra={
                    <Space>
                        <Select
                            style={{ width: 200 }}
                            value={list.search.module}
                            onChange={value => void list.research({ module: value })}
                            options={[
                                { value: '', label: '全部模块' },
                                ...modules.map(item => ({ value: item, label: item })),
                            ]}
                        />
                        <Space.Compact>
                            {privileges['app_privileges.create'] && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setDrawer({
                                        privilege: { id: '0', name: '' },
                                        editable: true,
                                    })}
                                >
                                    新建系统权限
                                </Button>
                            )}
                            <Button icon={<SyncOutlined />} onClick={() => void list.reload()}>
                                刷新
                            </Button>
                        </Space.Compact>
                    </Space>
                }
            >
                <Table<AppPrivilegeModel>
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
                <PrivilegeDetailDrawer
                    privilege={drawer.privilege}
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

export default PrivilegesPage;
