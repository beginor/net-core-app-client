/** Resolve after the given number of milliseconds. */
export function waitFor(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
