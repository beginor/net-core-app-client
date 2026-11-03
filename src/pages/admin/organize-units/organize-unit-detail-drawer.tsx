import { Form, Input, InputNumber, Spin, TreeSelect } from 'antd';
import { useEffect, useState } from 'react';

import { organizeUnitsApi } from '../../../api/organize-units';
import type { OrganizeUnitModel } from '../../../api/organize-units';
import { DetailDrawer } from '../../../components/detail-drawer';
import { useOrganizeUnits } from '../../../hooks/use-organize-units';
import { showMessage } from '../../../utils/feedback';

interface OrganizeUnitDetailDrawerProps {
    id: string;
    editable: boolean;
    onClose: (result: '' | 'ok') => void;
}

/** Create or edit an organize unit, the unit itself is disabled as parent. */
export function OrganizeUnitDetailDrawer({ id, editable, onClose }: OrganizeUnitDetailDrawerProps) {
    const [form] = Form.useForm<OrganizeUnitModel>();
    const [loading, setLoading] = useState(id !== '0');
    const [saving, setSaving] = useState(false);
    const { treeData } = useOrganizeUnits(id === '0' ? undefined : id);
    const isNew = id === '0';

    useEffect(() => {
        if (isNew) {
            form.setFieldsValue({ name: '', sequence: 0 });
            return;
        }
        organizeUnitsApi.getById(id)
            .then(model => form.setFieldsValue(model))
            .catch((ex: unknown) => {
                console.error(ex);
                showMessage('error', '获取指定的组织单元出错！');
            })
            .finally(() => setLoading(false));
    }, [id, isNew, form]);

    const save = async (): Promise<boolean> => {
        const values = await form.validateFields();
        setSaving(true);
        try {
            if (isNew) {
                await organizeUnitsApi.create({ ...values, id: '0' });
            }
            else {
                await organizeUnitsApi.update(id, { ...values, id });
            }
            return true;
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', isNew ? '创建组织单元出错！' : '更新组织单元出错！');
            return false;
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <DetailDrawer
            open
            title={isNew ? '新建组织单元' : editable ? '编辑组织单元' : '查看组织单元'}
            saving={saving}
            onSave={editable ? save : undefined}
            onClose={onClose}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical" disabled={!editable}>
                    <Form.Item name="parentId" label="上级组织单元">
                        <TreeSelect
                            className="w-full"
                            allowClear
                            showSearch
                            treeData={treeData}
                            treeDefaultExpandAll
                            placeholder="请选择上级组织单元"
                        />
                    </Form.Item>
                    <div className="flex gap-3">
                        <Form.Item className="flex-1" name="name" label="名称" rules={[{ required: true }]}>
                            <Input placeholder="请输入组织单元名称 ..." />
                        </Form.Item>
                        <Form.Item name="sequence" label="排序" rules={[{ required: true }]}>
                            <InputNumber className="w-full" placeholder="请输入排序..." />
                        </Form.Item>
                    </div>
                    <Form.Item name="description" label="组织单元说明">
                        <Input.TextArea rows={4} placeholder="请输入组织单元说明 ..." />
                    </Form.Item>
                </Form>
            </Spin>
        </DetailDrawer>
    );
}
