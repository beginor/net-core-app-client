import { Checkbox, Form, Input, Spin } from 'antd';
import { useEffect, useState } from 'react';

import { privilegesApi } from '../../../api/privileges';
import type { AppPrivilegeModel } from '../../../api/privileges';
import { DetailDrawer } from '../../../components/detail-drawer';
import { showMessage } from '../../../utils/feedback';

interface PrivilegeDetailDrawerProps {
    privilege: AppPrivilegeModel;
    editable: boolean;
    onClose: (result: '' | 'ok') => void;
}

/** Create or edit a system privilege. */
export function PrivilegeDetailDrawer(
    { privilege, editable, onClose }: PrivilegeDetailDrawerProps,
) {
    const [form] = Form.useForm<AppPrivilegeModel>();
    const [loading, setLoading] = useState(privilege.id !== '0');
    const [saving, setSaving] = useState(false);
    const isNew = privilege.id === '0';

    useEffect(() => {
        if (isNew) {
            form.setFieldsValue({ module: '', name: '', description: '' });
            return;
        }
        privilegesApi.getById(privilege.id)
            .then(model => form.setFieldsValue(model))
            .catch((ex: unknown) => {
                console.error(ex);
                showMessage('error', '加载系统权限数据出错！');
            })
            .finally(() => setLoading(false));
    }, [privilege.id, isNew, form]);

    const save = async (): Promise<boolean> => {
        const values = await form.validateFields();
        setSaving(true);
        try {
            if (isNew) {
                await privilegesApi.create({ ...values, id: '0' });
            }
            else {
                await privilegesApi.update(privilege.id, { ...values, id: privilege.id });
            }
            return true;
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', isNew ? '创建系统权限出错！' : '更新系统权限出错！');
            return false;
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <DetailDrawer
            open
            title={isNew ? '新建系统权限' : editable ? '编辑系统权限' : '查看系统权限'}
            saving={saving}
            onSave={editable ? save : undefined}
            onClose={onClose}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical" disabled={!editable}>
                    <Form.Item name="module" label="权限模块" rules={[{ required: true }]}>
                        <Input placeholder="请输入权限模块 ..." />
                    </Form.Item>
                    <Form.Item name="name" label="权限名称" rules={[{ required: true }]}>
                        <Input placeholder="请输入权限名称 ..." />
                    </Form.Item>
                    <Form.Item name="description" label="权限描述" rules={[{ required: true }]}>
                        <Input placeholder="请输入权限描述 ..." />
                    </Form.Item>
                    <Form.Item name="isRequired" valuePropName="checked">
                        <Checkbox>必须的权限</Checkbox>
                    </Form.Item>
                </Form>
            </Spin>
        </DetailDrawer>
    );
}
