export interface PhoneType {
  phone: string;
  phoneAreaCode: string;
  state: boolean;
}
import { clsx, type ClassValue } from "clsx";
import * as intl from "react-intl-universal";
import { twMerge } from "tailwind-merge";
import { chinaPhoneAreaCode, chinaPhoneReg, emailReg } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const emailRule = () => {
  return {
    message: intl.get("Component.EmailInputErrorMessage").d("邮箱格式错误"),
    pattern: emailReg,
    required: true,
  };
};

export const phoneRule = () => {
  return {
    message: intl.get("Component.PhoneInputErrorMessage").d("手机格式错误"),
    validate: (value: PhoneType) => {
      const { phone, phoneAreaCode } = value;
      if (phoneAreaCode === chinaPhoneAreaCode) {
        return chinaPhoneReg.test(phone);
      }
      return !!phone && !!phoneAreaCode;
    },
  };
};

export const PASSWORD_REG_I = "^(?=.*\\d)(?=.*[a-zA-Z]).{6,16}$";
export const PASSWORD_REG_II = "^(?=.*\\d)(?=.*[a-zA-Z]).{8,16}$";
export const PASSWORD_REG_III = "^(?=.*\\d)(?=.*[a-zA-Z]).{9,16}$";
export const PASSWORD_REG_IIII =
  "^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{11,16}$";

