"use client";

import {
  forwardRef,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import * as intl from "react-intl-universal";
import Style from "./index.module.scss";

import BaseContactTabs from "@/components/BaseContactTabs";
import BaseInput, {
  BaseInputRef,
  inintValueType,
  Rules,
} from "@/components/BaseInput";
import { PhoneType } from "@/components/BasePhoneNumber";
import Mask from "@/components/Mask";
import PdfLink from "@/components/PdfLink";
import { Radio } from "antd-mobile";
import { Button } from "h5-design";
import { AreaItem } from "h5-design/components/Form/components/PhoneNumber/type";

interface ContactSwitcherPropsType {
  /** 区号信息 */
  areaList: AreaItem[];
  /** 密码提示信息 */
  passwordTipInfo?: ReactNode;
  /** 密码输入框规则校验 */
  passwordRule?: Rules;
  /** 签署协议 */
  sign?: {
    privacyPolicy: string;
    termsOfUse: string;
  };
  emailRule?: Rules;
  phoneRule?: Rules;
  authData?: SignUpDataType;
  isShowPasswordInput?: boolean;
  updateAuthData?: (v: Partial<SignUpDataType>) => void;
  mode: "SignUp" | "SignIn";
  submit: (activeKeyType: activeKeyType) => Promise<void>;
}

const _ContactSwitcher = forwardRef<
  {
    validate: () => void;
  },
  ContactSwitcherPropsType
>((props, ref) => {
  const {
    mode,
    areaList,
    passwordTipInfo,
    passwordRule,
    phoneRule,
    sign,
    authData,
    updateAuthData,
    emailRule,
    isShowPasswordInput = true,
    submit,
  } = props;
  const activeKey = authData?.activeKey;

  const phone = useMemo(
    () => ({
      phone: authData?.phone || "",
      phoneAreaCode: authData?.phoneNumber || "",
      state: authData?.phoneState || false,
    }),
    [authData?.phone, authData?.phoneNumber, authData?.phoneState]
  );
  const email = useMemo(
    () => ({
      value: authData?.email || "",
      state: authData?.emailState || false,
    }),
    [authData?.email, authData?.emailState]
  );
  const [passwordFocusState, setPasswordFocusState] = useState(false);
  const [focus, setFocus] = useState(false);
  const passwordInputRef = useRef<BaseInputRef>(null);
  const [loading, setLoading] = useState(false);
  const checked = authData?.signChecked;
  const password = useMemo(() => {
    return {
      value:
        authData?.activeKey === "email"
          ? authData?.emailPassword
          : authData?.phonePassword || "",
      state:
        authData?.activeKey === "email"
          ? authData.emailPasswordState
          : authData?.phonePasswordState || false,
    };
  }, [authData]);

  const passwordChange = useCallback(
    (val: inintValueType) => {
      const { value, state } = val;
      updateAuthData?.({
        ...(activeKey === "email"
          ? { emailPasswordState: state, emailPassword: value }
          : {}),
        ...(activeKey === "phone"
          ? { phonePasswordState: state, phonePassword: value }
          : {}),
      });
    },
    [activeKey, updateAuthData]
  );

  const handleFocus = useCallback(() => {
    setFocus(true);
  }, []);

  const handleBlur = useCallback(
    (type: SignUpDataType["activeKey"]) => {
      setFocus(false);
      updateAuthData?.({
        ...(type === "email"
          ? { email: email.value.trim() }
          : { phone: phone.phone.trim() }),
      });
    },
    [updateAuthData, email, phone]
  );

  const passwordFocus = useCallback(() => {
    setPasswordFocusState(true);
  }, []);

  const passwordBlur = useCallback(() => {
    setPasswordFocusState(false);
    switch (activeKey) {
      case "email":
        updateAuthData?.({
          emailPassword: password.value.trim(),
        });
        break;
      case "phone":
        updateAuthData?.({
          phonePassword: password.value.trim(),
        });
        break;

      default:
        break;
    }
  }, [activeKey, updateAuthData, password]);

  const onTabsChange = (v: string) => {
    updateAuthData?.({
      activeKey: v as activeKeyType,
    });
  };

  const onPhoneChange = useCallback(
    (val: PhoneType) => {
      const { phone, phoneAreaCode, state } = val;
      updateAuthData?.({
        phone,
        phoneNumber: phoneAreaCode,
        phoneState: state,
      });
    },
    [updateAuthData]
  );

  const onEmailChange = useCallback(
    (val: inintValueType) => {
      const { value, state } = val;
      updateAuthData?.({
        email: value,
        emailState: state,
      });
    },
    [updateAuthData]
  );

  // useImperativeHandle(
  //     ref,
  //     () => {
  //         return {
  //             validate: handleBlur,
  //         };
  //     },
  //     [handleBlur],
  // );

  const handleSubmit = useCallback(async () => {
    switch (activeKey) {
      case "email": {
        if (!email.state || !password.state) {
          return;
        }
        break;
      }
      case "phone": {
        if (!phone.state || !password.state) {
          return;
        }
        break;
      }
    }
    setLoading(true);
    if (activeKey) {
      await submit?.(activeKey);
    }
    setLoading(false);
  }, [submit, activeKey, email.state, phone.state, password.state]);

  const submitDisabled = useMemo(() => {
    let disabled = true;
    if (checked) {
      switch (activeKey) {
        case "email":
          if (focus) {
            // 邮箱输入框有焦点时，需要密码规则校验通过且邮箱有值
            if (email.value && password.state) {
              disabled = false;
            }
          } else if (passwordFocusState) {
            // 密码输入框有焦点时，需要邮箱规则校验通过且密码有值
            if (password.value && email.state) {
              disabled = false;
            }
          } else {
            // 没有焦点时，只有两个都有值且都校验通过时才可以点击
            if (email.state && password.state) {
              disabled = false;
            }
          }
          break;
        case "phone":
          if (focus) {
            // 手机输入框有焦点时，需要密码规则校验通过且手机有值
            if (phone.phone && phone.phoneAreaCode && password.state) {
              disabled = false;
            }
          } else if (passwordFocusState) {
            // 密码输入框有焦点时，需要手机规则校验通过且密码有值
            if (password.value && phone.state) {
              disabled = false;
            }
          } else {
            // 没有焦点时，只有两个都有值且都校验通过时才可以点击
            if (phone.state && password.state) {
              disabled = false;
            }
          }
          break;
      }
    }
    return disabled;
  }, [
    email.value,
    password.value,
    checked,
    phone.phone,
    phone.phoneAreaCode,
    activeKey,
    email.state,
    phone.state,
    password.state,
    focus,
    passwordFocusState,
  ]);

  const passwordInput = useMemo(() => {
    return isShowPasswordInput ? (
      <div className={Style["password-input-container"]}>
        <BaseInput
          ref={passwordInputRef}
          mode={"password"}
          placeholder={intl.get("Hint.Input", {
            field: intl.get("Passport.Password"),
          })}
          onChange={passwordChange}
          className={Style["password-input"]}
          values={password}
          rule={passwordRule || {}}
          tipInfo={passwordTipInfo}
          onFocus={passwordFocus}
          onBlur={passwordBlur}
        />
      </div>
    ) : null;
  }, [password, passwordTipInfo, passwordRule, isShowPasswordInput]);

  const handleCheckedSign = useCallback(() => {
    updateAuthData?.({
      signChecked: !checked,
    });
  }, [checked, updateAuthData]);

  const buttomText = useMemo(() => {
    return mode === "SignUp"
      ? intl.get("Auth.SignUpNow")
      : intl.get("Auth.SignInNow").d("立即登入");
  }, [mode]);

  return (
    <>
      <div className={Style["container"]}>
        <div className={Style["main"]}>
          <BaseContactTabs
            tabsKey={activeKey!}
            email={email}
            phone={phone}
            emailRule={emailRule!}
            phoneRule={phoneRule!}
            areaList={areaList}
            onEmailBlur={() => handleBlur(activeKeyType.email)}
            onEmailFocus={handleFocus}
            onPhoneFocus={handleFocus}
            onPhoneBlur={() => handleBlur(activeKeyType.phone)}
            onTabsChange={onTabsChange}
            onPhoneChange={onPhoneChange}
            onEmailChange={onEmailChange}
          >
            {passwordInput}
          </BaseContactTabs>
          <div className={Style["sign"]}>
            <Radio
              checked={checked}
              onClick={handleCheckedSign}
              style={{
                "--icon-size": "14px",
                marginRight: "4px",
              }}
            />
            <span>{intl.get("Kyc.CommunityProtocolConfirm")}</span>&nbsp;
            <PdfLink
              text={intl.get("Auth.PrivacyPolicy").d("隐私条例")}
              title={intl.get("Auth.PrivacyPolicy").d("隐私条例")}
              url={sign?.privacyPolicy || ""}
            />
            &nbsp;{intl.get("Auth.And").d("和")} &nbsp;
            <PdfLink
              text={intl.get("Auth.TermsOfService").d("用户协议")}
              title={intl.get("Auth.TermsOfService").d("用户协议")}
              url={sign?.termsOfUse || ""}
            />
          </div>
          <Button
            loading={loading}
            id="btn"
            style={{ width: "100%", height: "4.4rem", fontSize: "1.6rem" }}
            onMouseDown={handleSubmit}
            disabled={submitDisabled}
          >
            {buttomText}
          </Button>
        </div>
      </div>
      <Mask visible={loading} />
    </>
  );
});

_ContactSwitcher.displayName = "ContactSwitcher";

const ContactSwitcher = _ContactSwitcher;

export default ContactSwitcher;

