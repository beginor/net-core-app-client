import { Checkbox, Spin } from 'antd';
import { useEffect, useState } from 'react';

import { groupByModule, privilegesApi } from '../../../api/privileges';
import type { ModulePrivileges } from '../../../api/privileges';
import { rolesApi } from '../../../api/roles';
import type { AppRoleModel } from '../../../api/roles';
import { DetailDrawer } from '../../../components/detail-drawer';
import { showMessage } from '../../../utils/feedback';

interface RolePrivilegeDrawerProps {
    role: AppRoleModel;
    onClose: () => void;
}

/** Toggle the privileges of a role, each change is saved immediately. */
export function RolePrivilegeDrawer({ role, onClose }: RolePrivilegeDrawerProps) {
    const [groups, setGroups] = useState<ModulePrivileges[]>([]);
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            privilegesApi.search({ skip: 0, take: 9999 }),
            rolesApi.getPrivileges(role.id),
        ])
            .then(([result, rolePrivileges]) => {
                setGroups(groupByModule(result.data ?? []));
                const map: Record<string, boolean> = {};
                rolePrivileges.forEach(name => {
                    map[name] = true;
                });
                setChecked(map);
            })
            .catch((ex: unknown) => {
                console.error(ex);
                showMessage('error', '获取角色权限出错！');
            })
            .finally(() => setLoading(false));
    }, [role.id]);

    const toggle = async (name: string): Promise<void> => {
        const enabled = checked[name] === true;
        try {
            if (enabled) {
                await rolesApi.removePrivilege(role.id, name);
            }
            else {
                await rolesApi.addPrivilege(role.id, name);
            }
            setChecked(prev => ({ ...prev, [name]: !enabled }));
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', enabled ? '删除角色权限失败！' : '添加角色权限失败！');
        }
    };

    return (
        <DetailDrawer
            open
            title={`${role.description ?? role.name}权限列表`}
            saveText="确定"
            onSave={() => true}
            onClose={() => onClose()}
        >
            <Spin spinning={loading}>
                {groups.map(group => (
                    <div key={group.module} className="mb-4">
                        <div className="mb-1 text-lg font-bold">{group.module}</div>
                        <div className="flex flex-col gap-1 ps-3">
                            {group.privileges.map(privilege => (
                                <Checkbox
                                    key={privilege.id}
                                    checked={checked[privilege.name] === true}
                                    onChange={() => void toggle(privilege.name)}
                                >
                                    {privilege.description ?? privilege.name}
                                </Checkbox>
                            ))}
                        </div>
                    </div>
                ))}
            </Spin>
        </DetailDrawer>
    );
}
