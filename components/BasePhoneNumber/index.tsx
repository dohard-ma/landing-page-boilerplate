import { PhoneNumber } from "h5-design/components/Form/components";
import { AreaItem } from "h5-design/components/Form/components/PhoneNumber/type";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import * as intl from "react-intl-universal";

import Style from "./index.module.scss";

export interface PhoneType {
  phone: string;
  phoneAreaCode: string;
  state: boolean;
}

export type Rules = {
  pattern?: RegExp;
  message?: string;
  validate?: (value: any) => boolean;
};

interface BasePhoneNumberPropsType {
  areaList: AreaItem[];
  values?: PhoneType;
  onChange: (value: PhoneType) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  rule: Rules;
  className?: string;
  placeholder?: string;
}

export type BaseBasePhoneNumberRef = {
  validate: () => void;
};

/** 手机号输入 */
const BasePhoneNumber = forwardRef<
  BaseBasePhoneNumberRef,
  BasePhoneNumberPropsType
>((props, ref) => {
  const {
    areaList,
    values,
    onChange,
    rule,
    onFocus,
    onBlur,
    className,
    placeholder,
  } = props;
  const [errorTextVisible, setErrorTextVisible] = useState(!!values?.phone);

  const [errorText, setErrorText] = useState<string>();

  const phone = values ? [values?.phoneAreaCode, values?.phone] : undefined;

  const { message, validate } = rule || {};

  const handleBlur = useCallback(() => {
    onBlur?.();
    setErrorTextVisible(true);
  }, [onBlur]);

  useEffect(() => {
    const value = {
      phone: values?.phone,
      phoneAreaCode: values?.phoneAreaCode?.replace(/_(.*)$/, "") || "",
    };
    if (validate) {
      if (!value?.phone) {
        setErrorText(intl.get("Validation.Required").d("此为必填项"));
      } else if (value?.phone && value?.phoneAreaCode && !validate(value)) {
        setErrorText(message);
      } else {
        setErrorText("");
      }
    }
  }, [message, validate, values?.phone, values?.phoneAreaCode]);

  /** 校验状态 */
  const verifyState = useCallback(
    (v: { phone: string; phoneAreaCode: string }) => {
      if (!v) {
        return false;
      } else if (!v?.phone || !v?.phoneAreaCode) {
        return false;
      } else if (validate && !validate(v)) {
        return false;
      } else {
        return true;
      }
    },
    [validate]
  );

  const handleChange = useCallback(
    (val: any[]) => {
      const next = {
        phone: val[1] || "",
        phoneAreaCode: (val[0] || "").split("_")[0],
      };
      const state = verifyState(next);
      onChange?.({ ...next, state });
    },
    [verifyState]
  );

  const handleFocus = useCallback(() => {
    setErrorTextVisible(false);
  }, []);

  const validateGetValue = handleBlur;

  useImperativeHandle(
    ref,
    () => {
      return {
        validate: validateGetValue,
      };
    },
    [validateGetValue]
  );
  return (
    <div
      className={[Style["base-input-number-container"], className].join(" ")}
      onFocus={handleFocus}
    >
      <div
        className={[
          Style["input-box"],
          `${errorTextVisible && errorText ? Style["input-box-err"] : ""}`,
          "input-box",
        ].join(" ")}
      >
        <PhoneNumber
          onFocus={onFocus}
          placeholder={
            placeholder
              ? placeholder
              : intl.get("Component.InputPlaceholder").d("请输入")
          }
          value={phone}
          onChange={handleChange}
          areaList={areaList}
          onBlur={handleBlur}
        />
      </div>
      {errorTextVisible && errorText ? (
        <div className={Style["error-text"]}>{errorText}</div>
      ) : null}
    </div>
  );
});

export default BasePhoneNumber;

