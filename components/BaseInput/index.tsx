"use client";

import { Input, InputRef } from "antd-mobile";
import { emojiReg } from "h5-design";
import { Hidden, Visible } from "h5-design/icon";
import {
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import * as intl from "react-intl-universal";
import Style from "./index.module.scss";
export type Rules = {
  pattern?: RegExp;
  message?: string;
  required?: boolean;
  validate?: (value: any) => boolean;
};

export type inintValueType = {
  value: string;
  state: boolean;
};
export type BaseInputProps = {
  values: inintValueType;
  onChange: (v: inintValueType) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  rule: Rules;
  mode?: "password" | "text";
  tipInfo?: ReactNode;
  placeholder?: ReactNode;
  className?: string;
};

export type BaseInputRef = {
  validate: () => void;
};

// 输入框组件
const BaseInput = forwardRef<BaseInputRef, BaseInputProps>((props, ref) => {
  const {
    values,
    onChange,
    rule,
    onFocus,
    onBlur,
    mode = "text",
    tipInfo,
    placeholder,
    className,
  } = props;
  const currentInputRef = useRef<InputRef>(null);
  const [inputType, setInputType] = useState(mode);
  const [errorText, setErrorText] = useState<string>();
  const { message, pattern, validate, required } = rule || {};
  const [show, setShow] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [errorTextVisible, setErrorTextVisible] = useState(!!values?.value);

  /** 失焦校验 */
  const handleBlur = useCallback(() => {
    setShowTip(false);
    onBlur?.();
    setErrorTextVisible(true);
  }, [onBlur]);

  const validateGetValue = handleBlur;

  /** 获取焦点 */
  const inputFocus = useCallback(() => {
    setShowTip(true);
    setErrorTextVisible(false);
  }, []);

  /** 输入 */
  const inputChange = useCallback(
    (v: string) => {
      /** 默认过滤表情 */
      const value = v.replace(emojiReg, "");
      onChange &&
        onChange({
          value: value,
          state: verifyState(value),
        });
    },
    [onChange]
  );

  /** 校验状态 */
  const verifyState = useCallback(
    (v: string) => {
      if (!v) {
        return false;
      } else if (pattern && !pattern.test(v)) {
        return false;
      } else {
        return true;
      }
    },
    [pattern]
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        validate: validateGetValue,
      };
    },
    [handleBlur]
  );

  useEffect(() => {
    const val = values?.value?.trim();
    if (required) {
      if (!val) {
        setErrorText(intl.get("Validation.Required").d("此为必填项"));
      } else if (pattern && !pattern.test(val)) {
        setErrorText(message);
      } else {
        setErrorText("");
      }
    }
    if (validate) {
      if (val && !validate(val)) {
        setErrorText(message);
      } else {
        setErrorText("");
      }
    }
  }, [values.value, required, pattern, message, validate]);

  const iconClick = () => {
    setShow((i) => !i);
    currentInputRef.current?.focus();
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  };

  return (
    <div
      onFocus={inputFocus}
      className={[Style["base-input-container"], className].join(" ")}
    >
      <div
        className={[
          Style["input-box"],
          `${errorTextVisible && errorText ? Style["input-box-err"] : ""}`,
          "input-box",
        ].join(" ")}
      >
        <Input
          ref={currentInputRef}
          onFocus={onFocus}
          maxLength={200}
          placeholder={
            placeholder
              ? placeholder
              : intl.get("Component.InputPlaceholder").d("请输入")
          }
          value={values.value}
          onChange={inputChange}
          onBlur={() => handleBlur()}
          type={inputType}
        />
        {mode === "password" ? (
          <div className={Style["input-icon"]} onClick={iconClick}>
            {show ? <Visible /> : <Hidden />}
          </div>
        ) : null}
      </div>
      {tipInfo && showTip ? (
        <div className={Style["tip-text"]}>{tipInfo}</div>
      ) : null}
      {errorTextVisible && errorText ? (
        <div className={Style["error-text"]}>{errorText}</div>
      ) : null}
    </div>
  );
});

BaseInput.displayName = "BaseInput";

export default BaseInput;

