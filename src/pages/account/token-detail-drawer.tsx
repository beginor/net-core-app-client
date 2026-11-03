import { CloseOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Checkbox, DatePicker, Form, Input, Spin } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import {
    createUserToken,
    getRolesAndPrivileges,
    newTokenValue,
    searchUserTokens,
    updateUserToken,
} from '../../api/account';
import type { UserTokenModel } from '../../api/account';
import { groupByModule } from '../../api/privileges';
import type { ModulePrivileges } from '../../api/privileges';
import type { AppRole } from '../../api/account';
import { DetailDrawer } from '../../components/detail-drawer';
import { showMessage } from '../../utils/feedback';

interface TokenDetailDrawerProps {
    id: string;
    editable: boolean;
    onClose: (result: '' | 'ok') => void;
}

interface FormValues {
    name: string;
    value: string;
    expiresAt?: Dayjs;
    roles?: string[];
    privileges?: string[];
}

/** Create or edit an API token. */
export function TokenDetailDrawer({ id, editable, onClose }: TokenDetailDrawerProps) {
    const [form] = Form.useForm<FormValues>();
    const [roles, setRoles] = useState<AppRole[]>([]);
    const [groups, setGroups] = useState<ModulePrivileges[]>([]);
    const [urls, setUrls] = useState<string[]>([]);
    const [urlInput, setUrlInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const isNew = id === '0';

    useEffect(() => {
        const loadToken = async (): Promise<UserTokenModel | undefined> => {
            if (isNew) {
                return undefined;
            }
            const result = await searchUserTokens({ skip: 0, take: 9999 });
            return result.data?.find(token => token.id === id);
        };
        Promise.all([getRolesAndPrivileges(), loadToken()])
            .then(async ([rap, token]) => {
                setRoles(rap.roles);
                setGroups(groupByModule(rap.privileges));
                if (token) {
                    form.setFieldsValue({
                        name: token.name,
                        value: token.value,
                        expiresAt: token.expiresAt ? dayjs(token.expiresAt) : undefined,
                        roles: token.roles ?? [],
                        privileges: token.privileges ?? [],
                    });
                    setUrls(token.urls ?? []);
                }
                else {
                    form.setFieldsValue({ name: '', value: '', roles: [], privileges: [] });
                    const value = await newTokenValue();
                    form.setFieldValue('value', value);
                }
            })
            .catch((ex: unknown) => {
                console.error(ex);
                showMessage('error', '加载凭证信息出错！');
            })
            .finally(() => setLoading(false));
    }, [id, isNew, form]);

    const refreshValue = async (): Promise<void> => {
        try {
            form.setFieldValue('value', await newTokenValue());
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '生成新凭证值出错！');
        }
    };

    const addUrl = (): void => {
        const url = urlInput.trim();
        if (url && !urls.includes(url)) {
            setUrls([...urls, url]);
        }
        setUrlInput('');
    };

    const save = async (): Promise<boolean> => {
        const values = await form.validateFields();
        const model: UserTokenModel = {
            id,
            name: values.name,
            value: values.value,
            roles: values.roles ?? [],
            privileges: values.privileges ?? [],
            urls,
            expiresAt: values.expiresAt?.format('YYYY-MM-DD'),
        };
        setSaving(true);
        try {
            if (isNew) {
                await createUserToken(model);
                showMessage('success', '创建凭证成功！');
            }
            else {
                await updateUserToken(id, model);
                showMessage('success', '更新凭证成功！');
            }
            return true;
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', isNew ? '创建凭证出错！' : '更新凭证出错！');
            return false;
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <DetailDrawer
            open
            title={isNew ? '新建凭证' : '凭证信息'}
            saving={saving}
            onSave={editable ? save : undefined}
            onClose={onClose}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical" disabled={!editable}>
                    <Form.Item name="name" label="凭证名称" rules={[{ required: true }]}>
                        <Input placeholder="请输入凭证名称 ..." />
                    </Form.Item>
                    <Form.Item name="value" label="凭证值" rules={[{ required: true }]}>
                        <Input
                            readOnly
                            placeholder="请输入凭证值 ..."
                            suffix={<SyncOutlined className="cursor-pointer" onClick={() => void refreshValue()} />}
                        />
                    </Form.Item>
                    <Form.Item name="expiresAt" label="过期时间">
                        <DatePicker
                            className="w-full"
                            inputReadOnly
                            placeholder="设置凭证的过期时间，否者将永不过期。"
                            disabledDate={current => !current.isAfter(dayjs(), 'day')}
                        />
                    </Form.Item>
                    <Form.Item name="roles" label="凭证角色">
                        <Checkbox.Group
                            className="flex flex-col gap-1"
                            options={roles.map(role => ({
                                value: role.name,
                                label: role.description ?? role.name,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item name="privileges" label="凭证权限">
                        <Checkbox.Group className="flex flex-col gap-2">
                            {groups.map(group => (
                                <div key={group.module}>
                                    <div className="font-bold">{group.module}</div>
                                    <div className="flex flex-col gap-1 ps-2">
                                        {group.privileges.map(privilege => (
                                            <Checkbox key={privilege.id} value={privilege.name}>
                                                {privilege.description ?? privilege.name}
                                            </Checkbox>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item label="允许的 url 地址">
                        <Input
                            className="mb-2"
                            placeholder="http:// ..."
                            value={urlInput}
                            onChange={e => setUrlInput(e.target.value)}
                            onPressEnter={addUrl}
                            suffix={<PlusOutlined className="cursor-pointer" onClick={addUrl} />}
                        />
                        {urls.map(url => (
                            <Input
                                key={url}
                                className="mb-2"
                                readOnly
                                value={url}
                                suffix={
                                    <CloseOutlined
                                        className="cursor-pointer"
                                        onClick={() => setUrls(urls.filter(item => item !== url))}
                                    />
                                }
                            />
                        ))}
                    </Form.Item>
                </Form>
            </Spin>
        </DetailDrawer>
    );
}
