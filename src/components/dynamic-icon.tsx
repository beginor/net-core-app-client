import { QuestionCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

import { BASE_PATH } from '../config';

interface DynamicIconProps {
    /** Icon path from the database, e.g. "bi/person" or "fa/solid/user". */
    icon?: string;
    size?: number;
    className?: string;
}

/** Resolve "bi/person" or "bi:person" into a public asset url. */
function iconUrl(icon: string): string | null {
    const [prefix, ...rest] = icon.split(/[/:]/);
    if (!prefix || rest.length === 0) {
        return null;
    }
    const name = rest.join('/');
    return `${BASE_PATH}/assets/${prefix}/${name}.svg`;
}

/** Render a database driven icon by masking the SVG with the current color. */
export function DynamicIcon({ icon, size = 16, className }: DynamicIconProps) {
    const [failed, setFailed] = useState(false);
    const url = icon ? iconUrl(icon) : null;

    if (!url || failed) {
        return <QuestionCircleOutlined style={{ fontSize: size }} className={className} />;
    }

    return (
        <span
            className={className}
            style={{
                display: 'inline-block',
                width: size,
                height: size,
                verticalAlign: '-0.125em',
                backgroundColor: 'currentColor',
                maskImage: `url("${url}")`,
                WebkitMaskImage: `url("${url}")`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
            }}
            onLoadCapture={() => setFailed(false)}
            onErrorCapture={() => setFailed(true)}
        >
            {/* Probe the asset so a missing file falls back to the default icon. */}
            <img
                src={url}
                alt=""
                style={{ display: 'none' }}
                onError={() => setFailed(true)}
            />
        </span>
    );
}
