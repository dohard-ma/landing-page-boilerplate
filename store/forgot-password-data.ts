import { useState } from 'react';
import { createContainer } from 'unstated-next';

export interface ForgotPasswordDataType {
    email: string;
    emailState: boolean;
    phone: string;
    phoneNumber: string;
    phoneState: boolean;
    verifyCode: string | number | null;
    signChecked: boolean;
    activeKey: 'email' | 'phone';
}

const init = {
    email: '',
    emailState: false,
    phoneState: false,
    phone: '',
    phoneNumber: '',
    verifyCode: null,
    signChecked: false,
    activeKey: 'email' as ForgotPasswordDataType['activeKey'],
};

/** 忘记密码数据源 */
export const useForgotPasswordData = () => {
    const [data, setData] = useState<ForgotPasswordDataType>(init);
    const updateSourceData = (value: Partial<ForgotPasswordDataType>) => {
        setData((v) => {
            return {
                ...v,
                ...value,
            };
        });
    };
    const initSourceData = () => {
        setData(init);
    };

    return {
        sourceData: data,
        updateSourceData,
        initSourceData,
    };
};

const forgotPasswordDataStore = createContainer(useForgotPasswordData);
export default forgotPasswordDataStore;
