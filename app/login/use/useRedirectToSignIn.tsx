import signInDataStore from '@/src/store/sign-in-data';
import historyObj from '@/src/utils/history';
import { useCallback } from 'react';

const target = '/auth/sign-in';

function useRedirectToSignIn() {
    const { initSignInData } = signInDataStore.useContainer();

    const redirectToSignIn = useCallback(() => {
        initSignInData();
        historyObj.history.push(target);
        sessionStorage.setItem('firstPagePath', target);
    }, [initSignInData]);

    return redirectToSignIn;
}

export default useRedirectToSignIn;
