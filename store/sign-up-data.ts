import { useState } from 'react';
import { createContainer } from 'unstated-next';
import useAreaList from '../use/useAreaList';
export interface SignUpDataType {
    email: string;
    emailState: boolean;
    phone: string;
    phoneNumber: string;
    phoneState: boolean;
    emailPassword: string;
    phonePassword: string;
    phonePasswordState: boolean;
    emailPasswordState: boolean;
    // verifyCode: string | number | null;
    signChecked: boolean;
    activeKey: activeKeyType;
}

export enum activeKeyType {
    email = 'email',
    phone = 'phone',
}

const init = {
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

/** 登入注册数据 */
export const useSignUpProcess = () => {
    const [signUpData, setSignUpData] = useState<SignUpDataType>(init);
    const areaListController = useAreaList();
    /** 更新数据 */
    const updateSignUpData = (value: Partial<SignUpDataType>) => {
        setSignUpData((val) => ({
            ...val,
            ...value,
        }));
    };
    const initSignUpData = () => {
        setSignUpData(init);
    };
    return { signUpData, updateSignUpData, initSignUpData, areaListController };
};
const SignUpDataStore = createContainer(useSignUpProcess);
export default SignUpDataStore;
