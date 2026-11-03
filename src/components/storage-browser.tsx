import { FileOutlined, FolderOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Empty, Input, Modal, Space, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { storagesApi } from '../api/storages';
import type { StorageContent } from '../api/storages';
import { showMessage } from '../utils/feedback';
import { DynamicIcon } from './dynamic-icon';

interface StorageBrowserProps {
    open: boolean;
    title: string;
    alias: string;
    filter?: string;
    onClose: (result?: string) => void;
}

interface FolderItem {
    name: string;
    type: 'folder' | 'file';
    ext: string;
}

/** Split the file names of a folder into folder and file entries. */
function buildItems(content: StorageContent): FolderItem[] {
    const items: FolderItem[] = [];
    [...(content.folders ?? [])].sort().forEach(name => {
        items.push({ name, type: 'folder', ext: '' });
    });
    [...(content.files ?? [])].sort().forEach((name) => {
        const idx = name.lastIndexOf('.');
        items.push({
            name: idx > 0 ? name.substring(0, idx) : name,
            type: 'file',
            ext: idx > 0 ? name.substring(idx + 1) : '',
        });
    });
    return items;
}

/** Browse a storage folder and pick a file, used by the icon picker. */
export function StorageBrowser({ open, title, alias, filter, onClose }: StorageBrowserProps) {
    const [content, setContent] = useState<StorageContent>({ title, alias, path: '/' });
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [selected, setSelected] = useState<FolderItem | null>(null);

    const load = useCallback(async (path: string): Promise<void> => {
        setLoading(true);
        try {
            const result = await storagesApi.browse(alias, path, filter);
            setContent(result);
            setKeyword('');
            setSelected(null);
        }
        catch (ex) {
            console.error(ex);
            showMessage('warning', '无法获取存储内容！');
        }
        finally {
            setLoading(false);
        }
    }, [alias, filter]);

    useEffect(() => {
        if (open) {
            void (async () => {
                await load('/');
            })();
        }
    }, [open, load]);

    const items = useMemo(() => buildItems(content), [content]);
    const visible = keyword ? items.filter(item => item.name.includes(keyword)) : items;

    const breadcrumbs = useMemo(() => {
        const path = content.path;
        if (!path || path === '.' || path === '/') {
            return [];
        }
        const segments = path.split('/').filter(Boolean);
        return segments.map((name, index) => ({
            name,
            path: segments.slice(0, index + 1).join('/'),
        }));
    }, [content.path]);

    const enter = (item: FolderItem): void => {
        if (item.type !== 'folder') {
            return;
        }
        const base = content.path && content.path !== '.' ? content.path.replace(/\/$/, '') : '';
        void load(`${base}/${item.name}`);
    };

    const confirm = (): void => {
        if (!selected) {
            onClose();
            return;
        }
        const base = content.path && content.path !== '.' ? `${content.path.replace(/\/$/, '')}/` : '';
        const file = selected.type === 'file' ? `${selected.name}.${selected.ext}` : selected.name;
        onClose(`${base}${file}`);
    };

    return (
        <Modal
            open={open}
            title={
                <Space wrap>
                    <span>{title}</span>
                    <Space.Compact size="small">
                        <Button icon={<HomeOutlined />} onClick={() => void load('/')}>{alias}</Button>
                        {breadcrumbs.map(item => (
                            <Button key={item.path} onClick={() => void load(item.path)}>
                                {item.name}
                            </Button>
                        ))}
                    </Space.Compact>
                </Space>
            }
            width={1056}
            okText="确定"
            cancelText="取消"
            onOk={confirm}
            onCancel={() => onClose()}
        >
            <Input.Search
                className="mb-2"
                placeholder="搜索..."
                allowClear
                onChange={e => setKeyword(e.target.value)}
            />
            <Spin spinning={loading}>
                <div className="flex max-h-[60vh] flex-wrap gap-2 overflow-auto p-1">
                    {visible.map(item => (
                        <div
                            key={`${item.type}-${item.name}`}
                            className={`w-24 cursor-pointer rounded border p-2 text-center ${
                                selected?.name === item.name ? 'border-blue-500' : 'border-gray-300'
                            }`}
                            title={item.name}
                            onClick={() => setSelected(item)}
                            onDoubleClick={() => enter(item)}
                        >
                            <div className="text-cyan-500">
                                {item.type === 'folder' ? (
                                    <FolderOutlined style={{ fontSize: 28 }} />
                                ) : item.ext === 'svg' ? (
                                    <DynamicIcon icon={`${content.path}/${item.name}.svg`} size={28} />
                                ) : (
                                    <FileOutlined style={{ fontSize: 28 }} />
                                )}
                            </div>
                            <div className="mt-1 truncate text-xs select-none">
                                {item.type === 'file' ? `${item.name}.${item.ext}` : item.name}
                            </div>
                        </div>
                    ))}
                    {visible.length === 0 && !loading && <Empty className="w-full" />}
                </div>
            </Spin>
        </Modal>
    );
}
