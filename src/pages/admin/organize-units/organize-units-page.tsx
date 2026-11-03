import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { organizeUnitsApi, toTree } from '../../../api/organize-units';
import type { OrganizeUnitModel } from '../../../api/organize-units';
import { useBreadcrumbs } from '../../../hooks/use-breadcrumbs';
import { useAppStore } from '../../../stores/app-store';
import { confirmDialog, showMessage } from '../../../utils/feedback';
import { OrganizeUnitDetailDrawer } from './organize-unit-detail-drawer';

interface TreeNode extends OrganizeUnitModel {
    parent?: TreeNode;
}

interface DrawerState {
    id: string;
    editable: boolean;
}

/** Flatten the unit tree into table rows, keeping the parent reference. */
function flatten(nodes: OrganizeUnitModel[], parent?: TreeNode): TreeNode[] {
    const rows: TreeNode[] = [];
    for (const node of nodes) {
        const row = node as TreeNode;
        row.parent = parent;
        rows.push(row);
        if (node.children) {
            rows.push(...flatten(node.children, row));
        }
    }
    return rows;
}

/** Organize unit tree rendered as an expandable table. */
export function OrganizeUnitsPage() {
    useBreadcrumbs([{ label: '首页', url: '/' }, { label: '管理', url: '/admin/dashboard' }, { label: '组织单元' }]);
    const privileges = useAppStore(state => state.account.privileges);
    const [rows, setRows] = useState<TreeNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [drawer, setDrawer] = useState<DrawerState | null>(null);

    const load = useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
            const result = await organizeUnitsApi.search({ skip: 0, take: 9999 });
            setRows(flatten(toTree(result.data ?? [])));
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '加载组织单元数据出错！');
            setRows([]);
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void (async () => {
            await load();
        })();
    }, [load]);

    const remove = async (id: string): Promise<void> => {
        if (!(await confirmDialog('确认删除么？'))) {
            return;
        }
        try {
            await organizeUnitsApi.remove(id);
            await load();
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '删除组织单元出错！');
        }
    };

    const columns: TableProps<TreeNode>['columns'] = [
        { title: '名称', dataIndex: 'name' },
        { title: '说明', dataIndex: 'description' },
        { title: '顺序', dataIndex: 'sequence', align: 'right' },
        {
            title: '操作',
            align: 'center',
            width: 120,
            render: (_v, record) => (
                <Space.Compact size="small">
                    {privileges['app_organize_units.read_by_id'] && (
                        <Tooltip title="详情">
                            <Button
                                icon={<InfoCircleOutlined />}
                                onClick={() => setDrawer({ id: record.id, editable: false })}
                            />
                        </Tooltip>
                    )}
                    {privileges['app_organize_units.update'] && (
                        <Tooltip title="编辑">
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => setDrawer({ id: record.id, editable: true })}
                            />
                        </Tooltip>
                    )}
                    {privileges['app_organize_units.delete'] && (
                        <Tooltip title="删除">
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                disabled={(record.children?.length ?? 0) > 0}
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
                title="组织单元"
                extra={
                    <Space.Compact>
                        {privileges['app_organize_units.create'] && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setDrawer({ id: '0', editable: true })}
                            >
                                新建组织单元
                            </Button>
                        )}
                        <Button icon={<SyncOutlined />} onClick={() => void load()}>刷新</Button>
                    </Space.Compact>
                }
            >
                <Table<TreeNode>
                    size="small"
                    rowKey="id"
                    columns={columns}
                    dataSource={rows}
                    loading={loading}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    expandable={{ defaultExpandAllRows: true, indentSize: 16 }}
                />
            </Card>
            {drawer && (
                <OrganizeUnitDetailDrawer
                    id={drawer.id}
                    editable={drawer.editable}
                    onClose={result => {
                        setDrawer(null);
                        if (result === 'ok') {
                            void load();
                        }
                    }}
                />
            )}
        </>
    );
}

export default OrganizeUnitsPage;
