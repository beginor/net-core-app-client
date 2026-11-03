import { SearchOutlined } from '@ant-design/icons';
import { Checkbox, Form, Input, InputNumber, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';

import { getMenuOptions, navItemsApi } from '../../../api/nav-items';
import type { MenuOption, NavItemModel } from '../../../api/nav-items';
import { rolesApi } from '../../../api/roles';
import type { AppRoleModel } from '../../../api/roles';
import { DetailDrawer } from '../../../components/detail-drawer';
import { StorageBrowser } from '../../../components/storage-browser';
import { useAppStore } from '../../../stores/app-store';
import { showMessage } from '../../../utils/feedback';

interface NavItemDetailDrawerProps {
    item: NavItemModel;
    editable: boolean;
    onClose: (result: '' | 'ok') => void;
}

const TARGETS = [
    { value: '', label: '当前窗口' },
    { value: '_iframe', label: '内嵌窗口' },
];

/** Create or edit a navigation node, the icon can be picked from storage. */
export function NavItemDetailDrawer({ item, editable, onClose }: NavItemDetailDrawerProps) {
    const [form] = Form.useForm<NavItemModel>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [parents, setParents] = useState<MenuOption[]>([]);
    const [roles, setRoles] = useState<AppRoleModel[]>([]);
    const [browserOpen, setBrowserOpen] = useState(false);
    const target = Form.useWatch('target', form);
    const canBrowse = useAppStore(state => state.account.privileges['app_storages.read_folder_content']);
    const isNew = item.id === '0';

    useEffect(() => {
        Promise.all([
            getMenuOptions(),
            rolesApi.search({ skip: 0, take: 999 }),
            isNew ? Promise.resolve(item) : navItemsApi.getById(item.id),
        ])
            .then(([options, roleResult, model]) => {
                setParents(options);
                setRoles(roleResult.data ?? []);
                form.setFieldsValue({ roles: [], sequence: 0, target: '', ...model });
            })
            .catch((ex: unknown) => {
                console.error(ex);
                showMessage('error', '获取导航节点（菜单）出错！');
            })
            .finally(() => setLoading(false));
    }, [item, isNew, form]);

    const save = async (): Promise<boolean> => {
        const values = await form.validateFields();
        setSaving(true);
        try {
            if (isNew) {
                await navItemsApi.create({ ...values, id: '0' });
            }
            else {
                await navItemsApi.update(item.id, { ...values, id: item.id });
            }
            return true;
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', isNew ? '创建导航节点（菜单）出错！' : '更新导航节点（菜单）出错！');
            return false;
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <DetailDrawer
            open
            title={isNew ? '新建菜单项' : editable ? '编辑菜单项' : '查看菜单项'}
            saving={saving}
            onSave={editable ? save : undefined}
            onClose={onClose}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical" disabled={!editable}>
                    <div className="flex gap-3">
                        <Form.Item className="flex-1" name="parentId" label="父节点" rules={[{ required: true }]}>
                            <Select
                                options={parents.map(option => ({
                                    value: option.id,
                                    label: option.title,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item className="flex-1" name="title" label="标题" rules={[{ required: true }]}>
                            <Input placeholder="请输入标题 ..." />
                        </Form.Item>
                        <Form.Item className="flex-1" name="sequence" label="顺序" rules={[{ required: true }]}>
                            <InputNumber className="w-full" placeholder="请输入顺序 ..." />
                        </Form.Item>
                    </div>
                    <div className="flex gap-3">
                        <Form.Item className="flex-1" name="target" label="导航窗口" rules={[{ required: true }]}>
                            <Select options={TARGETS} />
                        </Form.Item>
                        <Form.Item className="flex-[2]" name="url" label="导航地址" rules={[{ required: true }]}>
                            <Input placeholder="请输入导航地址 ..." />
                        </Form.Item>
                    </div>
                    {target === '_iframe' && (
                        <Form.Item name="frameUrl" label="内嵌窗口地址" rules={[{ required: true }]}>
                            <Input placeholder="请输入内嵌窗口地址 ..." />
                        </Form.Item>
                    )}
                    <div className="flex gap-3">
                        <Form.Item className="flex-1" name="icon" label="图标">
                            <Input
                                placeholder="请输入图标 ..."
                                suffix={
                                    editable && canBrowse
                                        ? <SearchOutlined className="cursor-pointer" onClick={() => setBrowserOpen(true)} />
                                        : undefined
                                }
                            />
                        </Form.Item>
                        <Form.Item className="flex-[2]" name="tooltip" label="提示文字">
                            <Input placeholder="请输入提示文字 ..." />
                        </Form.Item>
                    </div>
                    <Form.Item name="isHidden" valuePropName="checked">
                        <Checkbox>隐藏菜单项</Checkbox>
                    </Form.Item>
                    <Form.Item name="roles" label="菜单角色">
                        <Checkbox.Group
                            className="flex flex-col gap-1"
                            options={roles.map(role => ({
                                value: role.name,
                                label: role.description ?? role.name,
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Spin>
            <StorageBrowser
                open={browserOpen}
                title="选择图标"
                alias="icons"
                filter="*.svg"
                onClose={(result) => {
                    setBrowserOpen(false);
                    if (result) {
                        form.setFieldValue('icon', result.replace(/\.svg$/, ''));
                    }
                }}
            />
        </DetailDrawer>
    );
}
