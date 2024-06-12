import Provider from '@baymax/h5-common/dist/es/components/Provider';
import commonStore, { StoreKey as CommonStoreKey } from '@baymax/h5-common/dist/es/utils/store';
import { Container } from 'unstated-next';
import { default as forgotPasswordData } from './forgot-password-data';
import { default as signInData } from './sign-in-data';
import { default as signUpData } from './sign-up-data';
import { default as transactionPassword } from './transaction-password';
import { default as updateInfo } from './update-info';

type StoreKey =
    | CommonStoreKey
    | 'account'
    | 'transactionPassword'
    | 'updateInfo'
    | 'signInData'
    | 'signUpData'
    | 'forgotPasswordData';
type Containers = { [key: string]: Container<any, any> };

const store: Containers = {
    ...commonStore,
    transactionPassword,
    updateInfo,
    signInData,
    signUpData,
    forgotPasswordData,
};

export type { StoreKey };
export const PassportStateProvider: React.ElementType = Provider({
    signUpData,
    forgotPasswordData,
    transactionPassword,
    updateInfo,
    signInData,
} as Containers);
export default store;
