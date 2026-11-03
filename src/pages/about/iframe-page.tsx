import { useLocation, useParams } from 'react-router';

import { useAppStore } from '../../stores/app-store';
import type { NavigationNode } from '../../types';

/** Find the frameUrl of the navigation node matching the current path. */
function findFrameUrl(nodes: NavigationNode[], pathname: string): string | undefined {
    for (const node of nodes) {
        if (node.url === pathname) {
            return node.frameUrl;
        }
        if (node.url && pathname.startsWith(node.url) && node.children) {
            const found = findFrameUrl(node.children, pathname);
            if (found) {
                return found;
            }
        }
    }
    return undefined;
}

/** Render an external page inside an iframe, used by the about/:src route. */
export function IframePage() {
    const { src } = useParams();
    const { pathname } = useLocation();
    const menuRoot = useAppStore(state => state.menuRoot);

    const url = src && /^https?:\/\//.test(src)
        ? src
        : findFrameUrl(menuRoot.children ?? [], pathname) ?? '';

    return <iframe src={url} className="h-full w-full border-0" title="iframe" />;
}

export default IframePage;
