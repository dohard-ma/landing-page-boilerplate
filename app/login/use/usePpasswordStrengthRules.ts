import { SettingResponse, getSetting } from "@/api/user/v1/setting/get";
import {
  PASSWORD_REG_I,
  PASSWORD_REG_II,
  PASSWORD_REG_III,
  PASSWORD_REG_IIII,
} from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import * as intl from "react-intl-universal";
type SettingResponseView = SettingResponse;
export default function usePpasswordStrengthRules() {
  const [setting, setSetting] = useState<SettingResponseView>({});
  const [number, setNumber] = useState(0);

  useEffect(() => {
    getInitSetting();
  }, [number]);

  const updateSetting = () => {
    setNumber((i) => ++i);
  };

  const getInitSetting = async () => {
    const res = await getSetting();
    if (res.code === 0) {
      setSetting(res.data);
    }
  };

  const regular = useMemo(() => {
    return (
      {
        0: {
          reg: PASSWORD_REG_I,
          max: 16,
          min: 6,
          tip: intl.get("Auth.PasswordStrength", { field: "6-16" }),
        },
        1: {
          reg: PASSWORD_REG_II,
          max: 16,
          min: 8,
          tip: intl.get("Auth.PasswordStrength", { field: "8-16" }),
        },
        2: {
          reg: PASSWORD_REG_III,
          max: 16,
          min: 9,
          tip: intl.get("Auth.PasswordStrength", { field: "9-16" }),
        },
        3: {
          reg: PASSWORD_REG_IIII,
          max: 16,
          min: 11,
          tip: intl.get("Auth.PasswordStrengthIIII"),
        },
      }[setting.passwordLevel!] || {
        reg: PASSWORD_REG_I,
        max: 16,
        min: 6,
        tip: intl.get("Auth.PasswordStrength", { field: "6-16" }),
      }
    );
  }, [setting.passwordLevel]);

  return {
    updateSetting,
    regular,
    passwordLevel: setting.passwordLevel,
    privacyPolicy: setting?.loginOrRegisterAgreement?.privacyPolicy || "",
    termsOfUse: setting?.loginOrRegisterAgreement?.termsOfUse || "",
  };
}

