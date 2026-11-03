import { Checkbox, Spin } from 'antd';
import { useEffect, useState } from 'react';

import { rolesApi } from '../../../api/roles';
import type { AppRoleModel } from '../../../api/roles';
import { usersApi } from '../../../api/users';
import { DetailDrawer } from '../../../components/detail-drawer';
import { showMessage } from '../../../utils/feedback';

interface UserRolesDrawerProps {
    id: string;
    fullname: string;
    onClose: (result: '' | 'ok') => void;
}

/** Assign roles to a user, sending only the differences on save. */
export function UserRolesDrawer({ id, fullname, onClose }: UserRolesDrawerProps) {
    const [roles, setRoles] = useState<AppRoleModel[]>([]);
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            rolesApi.search({ skip: 0, take: 999 }),
            usersApi.getRoles(id),
        ])
            .then(([roleResult, userRoles]) => {
                setRoles(roleResult.data ?? []);
                const map: Record<string, boolean> = {};
                userRoles.forEach(role => {
                    map[role.name] = true;
                });
                setChecked(map);
            })
            .catch((ex: unknown) => {
                console.error(ex);
                showMessage('error', '获取用户角色失败！');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const save = async (): Promise<boolean> => {
        const toAdd = Object.keys(checked).filter(name => checked[name]);
        const toDelete = Object.keys(checked).filter(name => !checked[name]);
        setSaving(true);
        try {
            if (toAdd.length > 0) {
                await usersApi.addRoles(id, toAdd);
            }
            if (toDelete.length > 0) {
                await usersApi.removeRoles(id, toDelete);
            }
            return true;
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '保存用户角色失败！');
            return false;
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <DetailDrawer
            open
            title={`设置 ${fullname || '用户'} 的角色`}
            saving={saving}
            saveText="确定"
            onSave={save}
            onClose={onClose}
        >
            <Spin spinning={loading}>
                <div className="flex flex-col gap-2">
                    {roles.map(role => (
                        <Checkbox
                            key={role.id}
                            checked={checked[role.name] === true}
                            onChange={e => setChecked(prev => ({
                                ...prev,
                                [role.name]: e.target.checked,
                            }))}
                        >
                            {role.description ?? role.name}
                        </Checkbox>
                    ))}
                </div>
            </Spin>
        </DetailDrawer>
    );
}
