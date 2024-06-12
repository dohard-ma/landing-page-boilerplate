export type Action<T> = {
    type: 'renew' | 'init';
    payload: Partial<T>;
};
