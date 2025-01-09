export function assertError(error) {
    if (!(error instanceof Error)) {
        throw error;
    }
}
