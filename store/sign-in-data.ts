import { useCallback, useEffect, useRef, useState } from 'react';
import { createContainer } from 'unstated-next';
import useAreaList from '../use/useAreaList';
import { activeKeyType } from './sign-up-data';

interface SignInDataType {
    email: string;
    emailState: boolean;
    phone: string;
    phoneNumber: string;
    phoneState: boolean;
    emailPassword: string;
    phonePassword: string;
    phonePasswordState: boolean;
    emailPasswordState: boolean;
    signChecked: boolean;
    activeKey: activeKeyType;
    userInfo?: {
        email?: string;
        phone?: string;
        phoneAreaCode?: string;
        aid?: string;
    };
}

const initialSignInData: SignInDataType = {
    email: '',
    emailState: false,
    phoneState: false,
    phone: '',
    phoneNumber: '',
    // verifyCode: null,
    emailPassword: '',
    phonePassword: '',
    phonePasswordState: false,
    emailPasswordState: false,
    signChecked: false,
    activeKey: activeKeyType.email,
};

export function useSignInDataStore(_initialState = initialSignInData) {
    const initialSignInDataRef = useRef(_initialState);
    const [signInData, setSignInData] = useState<SignInDataType>(_initialState);
    const [initCount, setInitCount] = useState(0);
    const areaListController = useAreaList();

    useEffect(() => {
        setSignInData(initialSignInDataRef.current);
    }, [initCount]);

    /** 重新初始化全部 hook */
    const initSignInData = useCallback(() => {
        setInitCount((prev) => prev + 1);
    }, []);

    const updateSignInData = (value: Partial<SignInDataType>) => {
        setSignInData((val) => ({
            ...val,
            ...value,
        }));
    };

    return {
        signInData,
        areaListController,
        updateSignInData,
        initSignInData,
    } as const;
}

const signInDataStore = createContainer(useSignInDataStore);
export default signInDataStore;
