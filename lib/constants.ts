export const chinaPhoneAreaCode = "+86";
export const lang = {
  "zh-CN": "zh_en",
  "zh-TW": "zh_tw",
  "en-US": "en_us",
};

// 中国大陆手机号校验规则
export const chinaPhoneReg = new RegExp(
  "^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\\d{8}$"
);
// 邮箱校验规则
export const emailReg = new RegExp(
  "^[a-zA-Z0-9_.+-]{1,40}@[a-zA-Z0-9_.+-]{1,20}\\.[a-zA-Z0-9_.+-]{1,20}$"
);

