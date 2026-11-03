import { Button, Drawer, Space } from 'antd';

interface DetailDrawerProps {
    open: boolean;
    title: React.ReactNode;
    /** Called with 'ok' after a successful save, empty string when cancelled. */
    onClose: (result: '' | 'ok') => void;
    /** When provided a save button is rendered, returning false keeps it open. */
    onSave?: () => Promise<boolean> | boolean;
    saving?: boolean;
    saveText?: string;
    children: React.ReactNode;
}

/** Right side drawer used by all detail and edit forms. */
export function DetailDrawer({
    open,
    title,
    onClose,
    onSave,
    saving = false,
    saveText = '保存',
    children,
}: DetailDrawerProps) {
    const handleSave = async (): Promise<void> => {
        if (!onSave) {
            return;
        }
        const ok = await onSave();
        if (ok) {
            onClose('ok');
        }
    };

    return (
        <Drawer
            open={open}
            title={title}
            placement="right"
            size="40vw"
            closable={false}
            styles={{ body: { padding: 16, overflow: 'auto' } }}
            extra={
                <Space>
                    {onSave && (
                        <Button type="primary" loading={saving} onClick={() => void handleSave()}>
                            {saveText}
                        </Button>
                    )}
                    <Button onClick={() => onClose('')}>取消</Button>
                </Space>
            }
            onClose={() => onClose('')}
        >
            {children}
        </Drawer>
    );
}
