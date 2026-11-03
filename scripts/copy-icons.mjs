// Copy icon SVGs into public/assets so DynamicIcon can render them by name.
import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const targets = [
    ['node_modules/bootstrap-icons/icons', 'public/assets/bi'],
    ['node_modules/@fortawesome/fontawesome-free/svgs', 'public/assets/fa'],
];

for (const [source, target] of targets) {
    const from = join(root, source);
    const to = join(root, target);
    await rm(to, { recursive: true, force: true });
    await mkdir(to, { recursive: true });
    await cp(from, to, { recursive: true });
}
