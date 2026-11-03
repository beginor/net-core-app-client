import { App } from 'antd';
import { useEffect } from 'react';

type AppApi = ReturnType<typeof App.useApp>;

let api: AppApi | null = null;

/** Capture the antd App context so plain modules can show feedback. */
export function useFeedbackBridge(): void {
    const app = App.useApp();
    useEffect(() => {
        api = app;
    }, [app]);
}

/** Mount inside <App> to expose its message and modal APIs to plain modules. */
export function FeedbackBridge(): null {
    useFeedbackBridge();
    return null;
}

export type MessageType = 'success' | 'info' | 'warning' | 'error';

/** Show a transient message, silently ignored before the bridge is ready. */
export function showMessage(type: MessageType, text: string): void {
    void api?.message[type](text);
}

/** Ask the user to confirm an action, resolves to false when cancelled. */
export function confirmDialog(content: string): Promise<boolean> {
    const current = api;
    if (!current) {
        return Promise.resolve(window.confirm(content));
    }
    return new Promise<boolean>(resolve => {
        current.modal.confirm({
            title: '提示：',
            content,
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
        });
    });
}
