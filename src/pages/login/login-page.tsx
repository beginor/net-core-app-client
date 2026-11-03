import { SyncOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { captchaUrl, login } from '../../api/account';
import { errorMessage } from '../../api/errors';
import { useAppStore } from '../../stores/app-store';

interface LoginForm {
    userName: string;
    password: string;
    captcha: string;
}

/** Login page with captcha, redirects to returnUrl after signing in. */
export function LoginPage() {
    const [form] = Form.useForm<LoginForm>();
    const [captcha, setCaptcha] = useState(captchaUrl());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const refreshAccount = useAppStore(state => state.refreshAccount);

    useEffect(() => {
        document.title = '登录';
    }, []);

    const refreshCaptcha = (): void => setCaptcha(captchaUrl());

    const submit = async (values: LoginForm): Promise<void> => {
        setLoading(true);
        setError('');
        try {
            await login(values);
            await refreshAccount();
            const returnUrl = params.get('returnUrl') ?? '/home';
            void navigate(returnUrl, { replace: true });
        }
        catch (ex) {
            console.error(ex);
            setError(errorMessage(ex) || '无法登录！');
            form.setFieldValue('captcha', '');
            refreshCaptcha();
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full items-center justify-center bg-gray-50">
            <Card title="登录您的账户" className="w-96">
                <Form<LoginForm>
                    form={form}
                    layout="vertical"
                    onFinish={values => void submit(values)}
                >
                    <Form.Item
                        name="userName"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名！' }]}
                    >
                        <Input size="large" placeholder="请输入用户名 ..." autoComplete="username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[{ required: true, message: '请输入密码！' }]}
                    >
                        <Input.Password
                            size="large"
                            placeholder="请输入密码 ..."
                            autoComplete="new-password"
                        />
                    </Form.Item>
                    <Form.Item
                        name="captcha"
                        label="验证码"
                        rules={[{ required: true, message: '请输入验证码！' }]}
                    >
                        <Input
                            size="large"
                            placeholder="请输入验证码..."
                            suffix={
                                <img
                                    src={captcha}
                                    alt="点击刷新验证码"
                                    title="点击刷新验证码"
                                    width={118}
                                    height={38}
                                    className="cursor-pointer"
                                    onClick={refreshCaptcha}
                                />
                            }
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            size="large"
                            block
                            htmlType="submit"
                            loading={loading}
                            icon={loading ? <SyncOutlined /> : undefined}
                        >
                            {loading ? '登录中 ...' : '登录'}
                        </Button>
                    </Form.Item>
                    {error && (
                        <Alert
                            type="error"
                            showIcon
                            closable
                            message={error}
                            onClose={() => setError('')}
                        />
                    )}
                </Form>
            </Card>
        </div>
    );
}

export default LoginPage;
