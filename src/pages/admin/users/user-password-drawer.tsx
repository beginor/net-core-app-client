import { Form, Input } from 'antd';
import { useState } from 'react';

import { usersApi } from '../../../api/users';
import { DetailDrawer } from '../../../components/detail-drawer';
import { encodeBase64Url } from '../../../utils/base64-url';
import { confirmDialog, showMessage } from '../../../utils/feedback';
import { confirmTo } from '../../../utils/validators';

interface UserPasswordDrawerProps {
    id: string;
    fullname: string;
    onClose: (result: '' | 'ok') => void;
}

interface FormValues {
    password: string;
    confirmPassword: string;
}

/** Reset the password of another user. */
export function UserPasswordDrawer({ id, fullname, onClose }: UserPasswordDrawerProps) {
    const [form] = Form.useForm<FormValues>();
    const [saving, setSaving] = useState(false);

    const save = async (): Promise<boolean> => {
        const values = await form.validateFields();
        if (!(await confirmDialog('确认重置该用户的密码么？'))) {
            return false;
        }
        setSaving(true);
        try {
            await usersApi.resetPassword(id, {
                password: encodeBase64Url(values.password),
                confirmPassword: encodeBase64Url(values.confirmPassword),
            });
            return true;
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '重置用户密码失败！');
            return false;
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <DetailDrawer open title={`重置 ${fullname} 的密码`} saving={saving} onSave={save} onClose={onClose}>
            <Form form={form} layout="vertical">
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true }, { min: 8, message: '密码至少 8 个字符！' }]}
                >
                    <Input.Password placeholder="请输入用户密码，至少 8 个字符 ..." autoComplete="new-password" />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="确认密码"
                    dependencies={['password']}
                    rules={[{ required: true }, confirmTo('password')]}
                >
                    <Input.Password placeholder="请确认用户密码 ..." autoComplete="off" />
                </Form.Item>
            </Form>
        </DetailDrawer>
    );
}
