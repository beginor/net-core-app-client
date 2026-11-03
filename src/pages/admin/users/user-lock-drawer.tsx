import { DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';

import { usersApi } from '../../../api/users';
import { DetailDrawer } from '../../../components/detail-drawer';
import { showMessage } from '../../../utils/feedback';

interface UserLockDrawerProps {
    id: string;
    fullname: string;
    onClose: (result: '' | 'ok') => void;
}

interface FormValues {
    lockoutEnd: Dayjs;
}

/** Lock a user until the end of the selected day. */
export function UserLockDrawer({ id, fullname, onClose }: UserLockDrawerProps) {
    const [form] = Form.useForm<FormValues>();
    const [saving, setSaving] = useState(false);

    const save = async (): Promise<boolean> => {
        const { lockoutEnd } = await form.validateFields();
        setSaving(true);
        try {
            await usersApi.lock(id, `${lockoutEnd.format('YYYY-MM-DD')} 23:59:59`);
            return true;
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '锁定用户失败！');
            return false;
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <DetailDrawer open title={`锁定 ${fullname || '用户'}`} saving={saving} onSave={save} onClose={onClose}>
            <Form form={form} layout="vertical" initialValues={{ lockoutEnd: dayjs() }}>
                <Form.Item name="lockoutEnd" label="锁定至" rules={[{ required: true }]}>
                    <DatePicker
                        className="w-full"
                        inputReadOnly
                        allowClear={false}
                        disabledDate={current => current.isBefore(dayjs(), 'day')}
                    />
                </Form.Item>
            </Form>
        </DetailDrawer>
    );
}
