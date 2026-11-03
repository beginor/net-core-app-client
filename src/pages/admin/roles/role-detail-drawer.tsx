import { Checkbox, Form, Input, Spin } from 'antd';
import { useEffect, useState } from 'react';

import { rolesApi } from '../../../api/roles';
import type { AppRoleModel } from '../../../api/roles';
import { DetailDrawer } from '../../../components/detail-drawer';
import { showMessage } from '../../../utils/feedback';

interface RoleDetailDrawerProps {
    role: AppRoleModel;
    editable: boolean;
    onClose: (result: '' | 'ok') => void;
}

/** Create or edit a role, the name is immutable once created. */
export function RoleDetailDrawer({ role, editable, onClose }: RoleDetailDrawerProps) {
    const [form] = Form.useForm<AppRoleModel>();
    const [loading, setLoading] = useState(role.id !== '0');
    const [saving, setSaving] = useState(false);
    const isNew = role.id === '0';

    useEffect(() => {
        if (isNew) {
            form.setFieldsValue({ name: '', description: '' });
            return;
        }
        rolesApi.getById(role.id)
            .then(model => form.setFieldsValue(model))
            .catch((ex: unknown) => {
                console.error(ex);
                showMessage('error', '获取指定的角色出错！');
            })
            .finally(() => setLoading(false));
    }, [role.id, isNew, form]);

    const save = async (): Promise<boolean> => {
        const values = await form.validateFields();
        setSaving(true);
        try {
            if (isNew) {
                await rolesApi.create({ ...values, id: '0' });
            }
            else {
                await rolesApi.update(role.id, { ...values, id: role.id });
            }
            return true;
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', isNew ? '创建角色出错！' : '更新角色出错！');
            return false;
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <DetailDrawer
            open
            title={isNew ? '新建角色' : editable ? '编辑角色' : '查看角色'}
            saving={saving}
            onSave={editable ? save : undefined}
            onClose={onClose}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical" disabled={!editable}>
                    <Form.Item name="name" label="角色名称" rules={[{ required: true }]}>
                        <Input placeholder="请输入角色名称 ..." disabled={!isNew} />
                    </Form.Item>
                    <Form.Item name="description" label="角色描述" rules={[{ required: true }]}>
                        <Input placeholder="请输入角色描述 ..." />
                    </Form.Item>
                    <div className="flex gap-3">
                        <Form.Item className="flex-1" name="isDefault" valuePropName="checked">
                            <Checkbox>是否默认</Checkbox>
                        </Form.Item>
                        <Form.Item className="flex-1" name="isAnonymous" valuePropName="checked">
                            <Checkbox>是否匿名</Checkbox>
                        </Form.Item>
                    </div>
                </Form>
            </Spin>
        </DetailDrawer>
    );
}
