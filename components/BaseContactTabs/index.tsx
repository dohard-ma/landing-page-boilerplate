import { Tabs } from "antd-mobile";
import { AreaItem } from "h5-design/components/Form/components/PhoneNumber/type";
import { ReactNode, useRef } from "react";
import * as intl from "react-intl-universal";
import BaseInput, { BaseInputRef, Rules } from "../BaseInput";
import BasePhoneNumber, { PhoneType } from "../BasePhoneNumber";
import Style from "./index.module.scss";

type inintValueType = {
  value: string;
  state: boolean;
};

type TabsKeys = "phone" | "email";

interface BaseContactTabsPropsType {
  tabsKey: TabsKeys;
  email: inintValueType;
  phone: PhoneType;
  emailRule: Rules;
  phoneRule: Rules;
  areaList: AreaItem[];
  children?: ReactNode;
  onEmailBlur: () => void;
  onEmailFocus: () => void;
  onPhoneFocus: () => void;
  onPhoneBlur: () => void;
  onTabsChange?: (v: string) => void;
  onPhoneChange?: (v: PhoneType) => void;
  onEmailChange?: (v: inintValueType) => void;
  emailTabContent?: ReactNode;
  phoneTabContent?: ReactNode;
}
export default function BaseContactTabs(props: BaseContactTabsPropsType) {
  const {
    tabsKey: activeKey,
    emailRule,
    phoneRule,
    areaList,
    onEmailBlur,
    onEmailFocus,
    onPhoneFocus,
    onPhoneBlur,
    onTabsChange,
    onEmailChange,
    onPhoneChange,
    phone,
    email,
    children,
    emailTabContent,
    phoneTabContent,
  } = props;
  const emailInputRef = useRef<BaseInputRef>(null);
  return (
    <div className={Style["base_contact_tabs-main"]}>
      <Tabs stretch={false} activeKey={activeKey} onChange={onTabsChange}>
        <Tabs.Tab title={intl.get("Auth.Email").d("邮箱")} key={"email"}>
          <BaseInput
            className={Style["tabs-email-box"]}
            ref={emailInputRef}
            values={email}
            placeholder={intl.get("Auth.PleaseEnterField", {
              field: intl.get("Auth.Email"),
            })}
            onChange={onEmailChange!}
            rule={emailRule!}
            onBlur={onEmailBlur}
            onFocus={onEmailFocus}
          />
          {emailTabContent ? emailTabContent : children}
        </Tabs.Tab>
        <Tabs.Tab title={intl.get("Auth.Phone").d("手机")} key={"phone"}>
          <BasePhoneNumber
            className={Style["tabs-phone-box"]}
            placeholder={intl.get("Auth.PleaseEnterField", {
              field: intl.get("Auth.Phone"),
            })}
            areaList={areaList}
            values={phone}
            onChange={onPhoneChange!}
            rule={phoneRule}
            onFocus={onPhoneFocus}
            onBlur={onPhoneBlur}
          />
          {phoneTabContent ? phoneTabContent : children}
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}

