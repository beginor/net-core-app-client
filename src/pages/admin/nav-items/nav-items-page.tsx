import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';

import { navItemsApi } from '../../../api/nav-items';
import type { NavItemModel } from '../../../api/nav-items';
import { DynamicIcon } from '../../../components/dynamic-icon';
import { useBreadcrumbs } from '../../../hooks/use-breadcrumbs';
import { useDataList } from '../../../hooks/use-data-list';
import type { SearchModel } from '../../../api/crud';
import { useAppStore } from '../../../stores/app-store';
import { confirmDialog, showMessage } from '../../../utils/feedback';
import { NavItemDetailDrawer } from './nav-item-detail-drawer';

interface DrawerState {
    item: NavItemModel;
    editable: boolean;
}

/** Navigation menu items, the icon can be picked from the icon storage. */
export function NavItemsPage() {
    useBreadcrumbs([{ label: '首页', url: '/' }, { label: '管理', url: '/admin/dashboard' }, { label: '导航菜单' }]);
    const privileges = useAppStore(state => state.account.privileges);
    const [drawer, setDrawer] = useState<DrawerState | null>(null);

    const list = useDataList<NavItemModel, SearchModel>({
        fetch: search => navItemsApi.search(search),
        errorText: '加载导航节点（菜单）数据出错！',
    });

    const remove = async (id: string): Promise<void> => {
        if (!(await confirmDialog('确认删除么？'))) {
            return;
        }
        try {
            await navItemsApi.remove(id);
            await list.reload();
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '删除导航节点（菜单）出错！');
        }
    };

    const columns: TableProps<NavItemModel>['columns'] = [
        {
            title: '#',
            width: 50,
            align: 'right',
            render: (_v, _r, index) => (list.pageIndex - 1) * list.pageSize + index + 1,
        },
        { title: '标题', dataIndex: 'title' },
        { title: '提示文字', dataIndex: 'tooltip' },
        {
            title: '图标',
            dataIndex: 'icon',
            render: value => (
                <span className="flex items-center gap-1">
                    {value && <DynamicIcon icon={value as string} />}
                    {value as string}
                </span>
            ),
        },
        { title: '导航地址', dataIndex: 'url' },
        { title: '顺序', dataIndex: 'sequence', align: 'right' },
        {
            title: '操作',
            align: 'center',
            width: 120,
            render: (_v, record) => (
                <Space.Compact size="small">
                    {privileges['app_nav_items.read_by_id'] && (
                        <Tooltip title="详情">
                            <Button
                                icon={<InfoCircleOutlined />}
                                onClick={() => setDrawer({ item: record, editable: false })}
                            />
                        </Tooltip>
                    )}
                    {privileges['app_nav_items.update'] && (
                        <Tooltip title="编辑">
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => setDrawer({ item: record, editable: true })}
                            />
                        </Tooltip>
                    )}
                    {privileges['app_nav_items.delete'] && (
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
                title="导航菜单"
                extra={
                    <Space.Compact>
                        {privileges['app_nav_items.create'] && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setDrawer({
                                    item: { id: '0', target: '', roles: [], sequence: 0 },
                                    editable: true,
                                })}
                            >
                                新建菜单项
                            </Button>
                        )}
                        <Button icon={<SyncOutlined />} onClick={() => void list.reload()}>
                            刷新
                        </Button>
                    </Space.Compact>
                }
            >
                <Table<NavItemModel>
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
                <NavItemDetailDrawer
                    item={drawer.item}
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

export default NavItemsPage;
