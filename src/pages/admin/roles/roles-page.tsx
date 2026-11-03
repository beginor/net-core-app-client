import {
    DeleteOutlined,
    EditOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    SafetyCertificateOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { Button, Card, Space, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router';

import { rolesApi } from '../../../api/roles';
import type { AppRoleModel } from '../../../api/roles';
import { useBreadcrumbs } from '../../../hooks/use-breadcrumbs';
import { useDataList } from '../../../hooks/use-data-list';
import type { SearchModel } from '../../../api/crud';
import { useAppStore } from '../../../stores/app-store';
import { confirmDialog, showMessage } from '../../../utils/feedback';
import { RoleDetailDrawer } from './role-detail-drawer';
import { RolePrivilegeDrawer } from './role-privilege-drawer';

interface DrawerState {
    kind: 'detail' | 'privilege';
    role: AppRoleModel;
    editable: boolean;
}

/** Role list with privilege assignment. */
export function RolesPage() {
    useBreadcrumbs([{ label: '首页', url: '/' }, { label: '管理', url: '/admin/dashboard' }, { label: '角色管理' }]);
    const privileges = useAppStore(state => state.account.privileges);
    const [drawer, setDrawer] = useState<DrawerState | null>(null);

    const list = useDataList<AppRoleModel, SearchModel>({
        fetch: search => rolesApi.search(search),
        errorText: '加载角色数据出错！',
    });

    const remove = async (id: string): Promise<void> => {
        if (!(await confirmDialog('确认删除么？'))) {
            return;
        }
        try {
            await rolesApi.remove(id);
            await list.reload();
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '删除角色出错！');
        }
    };

    const columns: TableProps<AppRoleModel>['columns'] = [
        {
            title: '#',
            width: 50,
            align: 'right',
            render: (_v, _r, index) => (list.pageIndex - 1) * list.pageSize + index + 1,
        },
        { title: '名称', dataIndex: 'name' },
        { title: '描述', dataIndex: 'description' },
        { title: '是否默认', dataIndex: 'isDefault', align: 'center', render: v => (v ? '是' : '否') },
        { title: '是否匿名', dataIndex: 'isAnonymous', align: 'center', render: v => (v ? '是' : '否') },
        {
            title: '用户数',
            dataIndex: 'userCount',
            align: 'right',
            render: (value, record) => (
                <Link to={`/admin/users?roleName=${encodeURIComponent(record.name)}`}>{value as number}</Link>
            ),
        },
        {
            title: '操作',
            align: 'center',
            width: 120,
            render: (_v, record) => (
                <Space.Compact size="small">
                    {privileges['app_roles.read_by_id'] && (
                        <Tooltip title="详情">
                            <Button
                                icon={<InfoCircleOutlined />}
                                onClick={() => setDrawer({ kind: 'detail', role: record, editable: false })}
                            />
                        </Tooltip>
                    )}
                    {privileges['app_roles.update'] && (
                        <Tooltip title="编辑">
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => setDrawer({ kind: 'detail', role: record, editable: true })}
                            />
                        </Tooltip>
                    )}
                    {privileges['app_roles.read_role_privileges'] && (
                        <Tooltip title="角色权限">
                            <Button
                                icon={<SafetyCertificateOutlined />}
                                onClick={() => setDrawer({ kind: 'privilege', role: record, editable: true })}
                            />
                        </Tooltip>
                    )}
                    {privileges['app_roles.delete'] && (
                        <Tooltip title="删除">
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                disabled={(record.userCount ?? 0) > 0}
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
                title="角色"
                extra={
                    <Space.Compact>
                        {privileges['app_roles.create'] && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setDrawer({ kind: 'detail', role: { id: '0', name: '' }, editable: true })}
                            >
                                新建角色
                            </Button>
                        )}
                        <Button icon={<SyncOutlined />} onClick={() => void list.reload()}>
                            刷新
                        </Button>
                    </Space.Compact>
                }
            >
                <Table<AppRoleModel>
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
            {drawer?.kind === 'detail' && (
                <RoleDetailDrawer
                    role={drawer.role}
                    editable={drawer.editable}
                    onClose={result => {
                        setDrawer(null);
                        if (result === 'ok') {
                            void list.reload();
                        }
                    }}
                />
            )}
            {drawer?.kind === 'privilege' && (
                <RolePrivilegeDrawer
                    role={drawer.role}
                    onClose={() => setDrawer(null)}
                />
            )}
        </>
    );
}

export default RolesPage;
