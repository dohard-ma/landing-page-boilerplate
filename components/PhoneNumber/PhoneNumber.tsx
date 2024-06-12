import { useCallback, useContext, useMemo, useState } from 'react';
import { PullDown } from '../../../../icon';
import CheckList from '../../../CheckList';
import FakePage from '../../../FakePage';
import { history } from '../../../FakePage/tools/utils';
import { LocaleContext } from '../../../LocaleProvider';
import Input from '../Input';
import './index.less';
import type { PhoneNumberProps } from './type';

const classPrefix = 'h5d-phoneNumber';
/**
 * 区号选择 + 手机号输入组件
 * 通过接口数据获取默认区号
 * 只读状态下平铺 +86 18888888888
 */
const PhoneNumber = (props: PhoneNumberProps) => {
    const locale = useContext(LocaleContext);
    const { onChange, onBlur, placeholder = locale.input, value, areaList, readonly } = props;

    const [show, setShow] = useState<boolean>(false);

    /**默认区号 */
    const defaultArea = useMemo(() => {
        return areaList?.find((item) => item.isDefault)?.value || '';
    }, [areaList]);

    // 区号
    const area = useMemo(() => {
        return value?.[0] || defaultArea;
    }, [value, defaultArea]);

    const valueStr = useMemo(() => {
        return value
            ? value
                  .map((item, index) => {
                      if (index === 0) {
                          return item?.split('_')?.[0];
                      } else {
                          return item;
                      }
                  })
                  .join(' ')
            : '';
    }, [value]);

    /**号码变化 */
    const onPhoneChange = useCallback(
        (val: string) => {
            const preValue = value ? [...value] : [];
            preValue[0] = preValue[0] || defaultArea;
            preValue[1] = val;
            onChange?.(preValue);
        },
        [value, onChange, defaultArea],
    );

    /**区号变化 */
    const onAreaChange = useCallback(
        (val: string) => {
            const preValue = value ? [...value] : [];
            preValue[0] = val;
            onChange?.(preValue);
        },
        [value, onChange],
    );

    const onSelect = useCallback(
        (val: string) => {
            onAreaChange(val);
            onBlur?.();
            history.goBack();
        },
        [onAreaChange, onBlur],
    );

    return (
        <div className={`${classPrefix}-main`}>
            {readonly ? (
                <span className={`${classPrefix}-content`}>{valueStr}</span>
            ) : (
                <div className={`${classPrefix}-box`}>
                    <div className={`${classPrefix}-area`} onClick={() => setShow(true)}>
                        <span>{area?.split('_')?.[0]}</span>
                        <i>
                            <PullDown />
                        </i>
                    </div>
                    <Input
                        value={value?.[1]}
                        maxLength={20}
                        inputMode="numeric"
                        placeholder={placeholder}
                        onChange={onPhoneChange}
                        onBlur={onBlur}
                        noNumber={true}
                    />
                </div>
            )}
            <FakePage path="/phone" isShow={show} onClose={() => setShow(false)} header={locale.areaCode}>
                <CheckList
                    value={area}
                    isSearch
                    listData={areaList}
                    model="indexes"
                    onChange={onSelect}
                    onChangeDataType="value"
                />
            </FakePage>
        </div>
    );
};

export default PhoneNumber;
