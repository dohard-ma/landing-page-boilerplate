import getBrokerInfo, { BrokerInfo } from '@/src/pages/TransactionPassword/utils/getBrokerInfo';
import { useCallback, useReducer } from 'react';
import { createContainer } from 'unstated-next';
import useAccountId from '../pages/TransactionPassword/use/useAccountId';
import useBrokerId from '../pages/TransactionPassword/use/useBrokerId';
import useFlowRef from '../pages/TransactionPassword/use/useFlowData';
import useStep from '../pages/TransactionPassword/use/useStep';
import getAccountInfo, { AccountInfo } from '../pages/TransactionPassword/utils/getAccountInfo';
import getPhoneInfo, { PhoneInfo } from '../pages/TransactionPassword/utils/getPhoneInfo';
import { Action } from './types';
import { reducer } from './utils';

type TransactionPasswordDataType = {
    /** 经纪商信息 */
    brokerInfo: BrokerInfo | null;
    /** 账号信息 */
    accountInfo: AccountInfo | null;
    /** 手机号码信息 */
    phoneInfo: PhoneInfo | null;
};

const initialTransactionPasswordData: TransactionPasswordDataType = {
    accountInfo: null,
    brokerInfo: null,
    phoneInfo: null,
};

export function useTransactionPasswordStore(initialState = initialTransactionPasswordData) {
    const [transactionPasswordData, dispatch] = useReducer<
        (state: TransactionPasswordDataType, action: Action<TransactionPasswordDataType>) => TransactionPasswordDataType
    >(reducer(initialTransactionPasswordData), initialState);
    const setTransactionPasswordData = useCallback(
        (data: Partial<TransactionPasswordDataType>) => {
            dispatch({
                type: 'renew',
                payload: data,
            });
        },
        [dispatch],
    );
    const brokerId = useBrokerId();
    const accountId = useAccountId();
    const { flowDataRef, updateFlowData, resetFlowData, removeFlowData, initFlowData } = useFlowRef();
    const { step, goNext, goFirst } = useStep();

    /** 获取账户信息 */
    const fetchAccountInfo = useCallback(async () => {
        if (!transactionPasswordData?.accountInfo) {
            const accountInfo = await getAccountInfo(accountId);
            if (accountInfo?.logo) {
                return loadImg(accountInfo.logo).then(() => {
                    setTransactionPasswordData({
                        accountInfo,
                    });
                    return accountInfo;
                });
            }
        }
        return transactionPasswordData.brokerInfo;
    }, [transactionPasswordData, setTransactionPasswordData, accountId]);

    /** 获取经纪商信息，如果已经有了，就不重复获取，直接返回 */
    const fetchBrokerInfo = useCallback(async () => {
        if (!transactionPasswordData?.brokerInfo) {
            const brokerInfo = await getBrokerInfo(brokerId);
            if (brokerInfo?.logo) {
                // 防止不展示经纪商 logo
                return loadImg(brokerInfo.logo).then(() => {
                    setTransactionPasswordData({
                        brokerInfo,
                    });
                    return brokerInfo;
                });
            }
        }
        return transactionPasswordData.brokerInfo;
    }, [transactionPasswordData, setTransactionPasswordData, brokerId]);

    /** 获取手机号信息 */
    const fetchPhoneInfo = useCallback(async () => {
        if (!transactionPasswordData?.phoneInfo) {
            const params = {
                accountId: String(accountId),
            };
            const phoneInfo = await getPhoneInfo(params);
            setTransactionPasswordData({
                phoneInfo,
            });
            return phoneInfo;
        }
    }, [transactionPasswordData, setTransactionPasswordData, accountId]);

    return {
        transactionPasswordData,
        fetchBrokerInfo,
        fetchPhoneInfo,
        fetchAccountInfo,
        flowDataRef,
        updateFlowData,
        resetFlowData,
        initFlowData,
        removeFlowData,
        step,
        goNext,
        goFirst,
    } as const;
}

/** 加载图片 */
function loadImg(src: string) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve;
    });
}

const transactionPasswordStore = createContainer(useTransactionPasswordStore);
export default transactionPasswordStore;
