import { Checkbox, DatePicker, Form, Input, Radio, Spin, TreeSelect } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { usersApi } from '../../../api/users';
import type { UserModel } from '../../../api/users';
import { DetailDrawer } from '../../../components/detail-drawer';
import { useOrganizeUnits } from '../../../hooks/use-organize-units';
import { showMessage } from '../../../utils/feedback';

interface UserDetailDrawerProps {
    id: string;
    editable: boolean;
    onClose: (result: '' | 'ok') => void;
}

interface FormValues extends Omit<UserModel, 'dateOfBirth' | 'organizeUnit'> {
    dateOfBirth?: Dayjs;
    organizeUnitId?: string;
}

const GENDER_OPTIONS = ['保密', '男', '女'].map(value => ({ value, label: value }));

/** Create or edit a user. */
export function UserDetailDrawer({ id, editable, onClose }: UserDetailDrawerProps) {
    const [form] = Form.useForm<FormValues>();
    const [loading, setLoading] = useState(id !== '0');
    const [saving, setSaving] = useState(false);
    const { treeData } = useOrganizeUnits();

    useEffect(() => {
        if (id === '0') {
            form.setFieldsValue({ lockoutEnabled: true, gender: '保密' });
            return;
        }
        usersApi.getById(id)
            .then((user) => {
                form.setFieldsValue({
                    ...user,
                    dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : undefined,
                    organizeUnitId: user.organizeUnit?.id,
                });
            })
            .catch((ex: unknown) => {
                console.error(ex);
                showMessage('error', '获取指定的用户出错！');
            })
            .finally(() => setLoading(false));
    }, [id, form]);

    const save = async (): Promise<boolean> => {
        const values = await form.validateFields();
        const model: UserModel = {
            ...values,
            id,
            dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
            organizeUnit: values.organizeUnitId
                ? { id: values.organizeUnitId, name: '' }
                : undefined,
        };
        setSaving(true);
        try {
            if (id === '0') {
                await usersApi.create(model);
            }
            else {
                await usersApi.update(id, model);
            }
            return true;
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', id === '0' ? '创建用户出错！' : '更新用户出错！');
            return false;
        }
        finally {
            setSaving(false);
        }
    };

    const title = id === '0' ? '新建用户' : editable ? '编辑用户' : '查看用户';

    return (
        <DetailDrawer
            open
            title={title}
            saving={saving}
            onSave={editable ? save : undefined}
            onClose={onClose}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical" disabled={!editable}>
                    <div className="flex gap-3">
                        <Form.Item className="flex-1" name="surname" label="姓氏" rules={[{ required: true }]}>
                            <Input placeholder="请输入用户姓氏 ..." />
                        </Form.Item>
                        <Form.Item className="flex-1" name="givenName" label="名称" rules={[{ required: true }]}>
                            <Input placeholder="请输入用户名称 ..." />
                        </Form.Item>
                    </div>
                    <div className="flex gap-3">
                        <Form.Item className="flex-1" name="userName" label="用户名" rules={[{ required: true }]}>
                            <Input placeholder="请输入用户名 ..." />
                        </Form.Item>
                        <Form.Item className="flex-1" name="organizeUnitId" label="组织单元" rules={[{ required: true }]}>
                            <TreeSelect
                                allowClear
                                showSearch
                                treeData={treeData}
                                placeholder="请选择组织单元"
                                treeDefaultExpandAll
                            />
                        </Form.Item>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <Form.Item name="email" label="电子邮箱" rules={[{ required: true }]}>
                                <Input placeholder="请输入用户电子邮箱 ..." />
                            </Form.Item>
                            <Form.Item name="emailConfirmed" valuePropName="checked">
                                <Checkbox>电子邮箱已确认</Checkbox>
                            </Form.Item>
                        </div>
                        <div className="flex-1">
                            <Form.Item name="phoneNumber" label="电话号码" rules={[{ required: true }]}>
                                <Input placeholder="请输入用户电话号码 ..." />
                            </Form.Item>
                            <Form.Item name="phoneNumberConfirmed" valuePropName="checked">
                                <Checkbox>电话号码已确认</Checkbox>
                            </Form.Item>
                        </div>
                    </div>
                    <hr />
                    <div className="flex gap-3">
                        <Form.Item className="flex-1" name="dateOfBirth" label="出生日期">
                            <DatePicker className="w-full" inputReadOnly />
                        </Form.Item>
                        <Form.Item className="flex-1" name="gender" label="性别">
                            <Radio.Group options={GENDER_OPTIONS} />
                        </Form.Item>
                    </div>
                    <Form.Item name="streetAddress" label="地址">
                        <Input placeholder="请输入用户地址 ..." />
                    </Form.Item>
                    <hr />
                    <Form.Item name="lockoutEnabled" valuePropName="checked">
                        <Checkbox>连续输错密码时，允许锁定该用户</Checkbox>
                    </Form.Item>
                </Form>
            </Spin>
        </DetailDrawer>
    );
}
