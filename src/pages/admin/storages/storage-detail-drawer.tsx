import { Checkbox, Form, Input, Spin } from 'antd';
import { useEffect, useState } from 'react';

import { rolesApi } from '../../../api/roles';
import type { AppRoleModel } from '../../../api/roles';
import { storagesApi } from '../../../api/storages';
import type { StorageModel } from '../../../api/storages';
import { DetailDrawer } from '../../../components/detail-drawer';
import { showMessage } from '../../../utils/feedback';

interface StorageDetailDrawerProps {
    storage: StorageModel;
    editable: boolean;
    onClose: (result: '' | 'ok') => void;
}

/** Create or edit an application storage. */
export function StorageDetailDrawer({ storage, editable, onClose }: StorageDetailDrawerProps) {
    const [form] = Form.useForm<StorageModel>();
    const [roles, setRoles] = useState<AppRoleModel[]>([]);
    const [loading, setLoading] = useState(storage.id !== '0');
    const [saving, setSaving] = useState(false);
    const isNew = storage.id === '0';

    useEffect(() => {
        Promise.all([
            rolesApi.search({ skip: 0, take: 999 }),
            isNew ? Promise.resolve(storage) : storagesApi.getById(storage.id),
        ])
            .then(([roleResult, model]) => {
                setRoles(roleResult.data ?? []);
                form.setFieldsValue({ roles: [], ...model });
            })
            .catch((ex: unknown) => {
                console.error(ex);
                showMessage('error', '获取应用存储出错！');
            })
            .finally(() => setLoading(false));
    }, [storage, isNew, form]);

    const save = async (): Promise<boolean> => {
        const values = await form.validateFields();
        const model: StorageModel = { ...values, id: storage.id };
        if (!model.roles || model.roles.length === 0) {
            delete model.roles;
        }
        setSaving(true);
        try {
            if (isNew) {
                await storagesApi.create(model);
            }
            else {
                await storagesApi.update(storage.id, model);
            }
            return true;
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', isNew ? '创建应用存储出错！' : '更新应用存储出错！');
            return false;
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <DetailDrawer
            open
            title={isNew ? '新建存储目录' : editable ? '编辑存储目录' : '查看存储目录'}
            saving={saving}
            onSave={editable ? save : undefined}
            onClose={onClose}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical" disabled={!editable}>
                    <Form.Item name="aliasName" label="别名" rules={[{ required: true }]}>
                        <Input placeholder="请输入存储目录别名 ..." />
                    </Form.Item>
                    <Form.Item name="rootFolder" label="目录" rules={[{ required: true }]}>
                        <Input placeholder="请输入存储目录路径 ..." />
                    </Form.Item>
                    <Form.Item name="readonly" valuePropName="checked">
                        <Checkbox>是否只读</Checkbox>
                    </Form.Item>
                    <Form.Item name="roles" label="允许的角色">
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
        </DetailDrawer>
    );
}
