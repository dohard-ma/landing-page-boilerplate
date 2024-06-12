import { Res } from "@/api/types";
import { get } from "@/lib/axios";

/** 获取安全设置和登录/注册协议出参 */
export type SettingResponse = {
  /** 登录/注册协议 */
  loginOrRegisterAgreement?: {
    /** 隐私条例 */
    privacyPolicy?: string;
    /** 用户协议 */
    termsOfUse?: string;
  };
  /** 密码强度等级，从强到弱 3 > 2 > 1 > 0 */
  passwordLevel?: number;
};

/** 获取安全设置和登录/注册协议 */
export const getSetting = (): Res<SettingResponse> => {
  return get(`/user/v1/setting`);
};

