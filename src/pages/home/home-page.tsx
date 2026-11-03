import { Alert, Button } from 'antd';
import { useState } from 'react';

import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';

/** Demo home page, kept from the Angular seed app. */
export function HomePage() {
    const [count, setCount] = useState(0);
    const [info, setInfo] = useState('');
    useBreadcrumbs([{ label: '首页' }]);

    const updateMessage = (): void => {
        const next = count + 1;
        setCount(next);
        setInfo(next % 5 === 0 ? 'Well done!' : '');
    };

    return (
        <div className="container mx-auto p-5">
            <div className="grid gap-2">
                <Button size="large" onClick={updateMessage}>
                    Hello, react ! ({count})
                </Button>
            </div>
            {info && <Alert className="mt-3" type="warning" showIcon message={info} />}
        </div>
    );
}

export default HomePage;
