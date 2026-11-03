import { CheckOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Input, Radio, Spin } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { changePassword, getUser, updateUser } from '../../api/account';
import type { ChangePasswordModel, UserInfo } from '../../api/account';
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';
import { showMessage } from '../../utils/feedback';
import { confirmTo } from '../../utils/validators';

interface UserForm extends Omit<UserInfo, 'dateOfBirth'> {
    dateOfBirth?: Dayjs;
}

const GENDER_OPTIONS = ['保密', '男', '女'].map(value => ({ value, label: value }));

/** Current user profile and password change form. */
export function UserInfoPage() {
    useBreadcrumbs([{ label: '首页', url: '/' }, { label: '用户信息' }]);
    const [form] = Form.useForm<UserForm>();
    const [pwdForm] = Form.useForm<ChangePasswordModel>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changing, setChanging] = useState(false);

    useEffect(() => {
        getUser()
            .then((user) => {
                form.setFieldsValue({
                    ...user,
                    dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : undefined,
                });
            })
            .catch((ex: unknown) => {
                console.error(ex);
                showMessage('error', '无法获取用户信息！');
            })
            .finally(() => setLoading(false));
    }, [form]);

    const saveUser = async (): Promise<void> => {
        const values = await form.validateFields();
        setSaving(true);
        try {
            await updateUser({
                ...values,
                dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
            });
            showMessage('success', '用户信息已更新！');
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '无法更新用户信息！');
        }
        finally {
            setSaving(false);
        }
    };

    const savePassword = async (): Promise<void> => {
        const values = await pwdForm.validateFields();
        setChanging(true);
        try {
            await changePassword(values);
            showMessage('success', '修改密码成功！');
            pwdForm.resetFields();
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '修改密码出错！');
        }
        finally {
            setChanging(false);
        }
    };

    return (
        <div className="container mx-auto my-3">
            <Card title="账户信息" className="mb-3">
                <Spin spinning={loading}>
                    <Form form={form} layout="vertical">
                        <div className="flex gap-3">
                            <Form.Item className="flex-1" name="surname" label="姓氏" rules={[{ required: true }]}>
                                <Input placeholder="请输入用户姓氏 ..." />
                            </Form.Item>
                            <Form.Item className="flex-1" name="givenName" label="名称" rules={[{ required: true }]}>
                                <Input placeholder="请输入用户名称 ..." />
                            </Form.Item>
                        </div>
                        <div className="flex gap-3">
                            <Form.Item className="flex-1" name="email" label="电子邮箱" rules={[{ required: true }]}>
                                <Input placeholder="请输入用户电子邮箱 ..." />
                            </Form.Item>
                            <Form.Item className="flex-1" name="phoneNumber" label="电话号码" rules={[{ required: true }]}>
                                <Input placeholder="请输入用户电话号码 ..." />
                            </Form.Item>
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
                        <div className="flex justify-end">
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                loading={saving}
                                onClick={() => void saveUser()}
                            >
                                保存
                            </Button>
                        </div>
                    </Form>
                </Spin>
            </Card>
            <Card title="修改密码">
                <Form form={pwdForm} layout="vertical">
                    <Form.Item name="oldPassword" label="当前密码" rules={[{ required: true }]}>
                        <Input.Password placeholder="请输入当前密码" autoComplete="current-password" />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="新密码"
                        rules={[{ required: true }, { min: 8, message: '密码至少 8 个字符！' }]}
                    >
                        <Input.Password placeholder="请输入新密码" autoComplete="new-password" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="确认密码"
                        dependencies={['newPassword']}
                        rules={[{ required: true }, confirmTo('newPassword')]}
                    >
                        <Input.Password placeholder="请再输入一次新密码以进行确认" autoComplete="new-password" />
                    </Form.Item>
                    <div className="flex justify-end">
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            loading={changing}
                            onClick={() => void savePassword()}
                        >
                            保存
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default UserInfoPage;
