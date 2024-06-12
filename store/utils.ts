export const reducer = (initData: { [key: string]: any }) => (state: any, action: any) => {
    const { type, payload } = action;
    switch (type) {
        case 'renew':
            return { ...(state ? state : {}), ...payload };
        case 'init':
            return { ...(initData ? initData : {}) };
        default:
            throw new Error();
    }
};
