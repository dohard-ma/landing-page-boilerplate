// import { transactionPasswordFlowError } from '@/src/pages/TransactionPassword/utils/flowController';
// import {
//     gt4ErrorCodes,
//     updateInfoErrorCodesShouldBack,
//     updateInfoErrorCodesShouldBackToApp,
//     updateInfoErrorCodesShouldBackToFirst,
// } from '@/src/pages/UpdateInfo/utils/apiController';
// import * as intl from 'react-intl-universal';

/** 交易账号校验手机验证码错误 */
export const transactionAccountVerificationError = 140030;

// 接口错误码对应提示
export const errors = {
  // 公版新的错误码
  "200002": "Error.SettingPlatformError",
  "160401": "Error.GoogleTranslateError",
  "160002": "Error.FileAcquisitionError",
  "160101": "Error.OcrError",
  "150002": "Error.UserRealFailed",
  "150001": "Error.UserRealError",
  "150003": "Error.ExistingSubmissionInformation",
  "150009": "Error.NoControlOrder",
  "150010": "Error.NoData",
  "100020": "Error.ErrorData",
  "150011": "Error.ErrorSignature",
  "100021": "Error.Required",
  "120111": "Error.UserNotExist",
  "150006": "Error.ErrorIdentity",
  "150007": "Error.ErrorFinancial",
  "150008": "Error.ErrorConcat",
  "9999": "Error.ServerError",
  "100018": "Error.TheOperationFailed",

  // 验证码相关
  "120107": "Error.VerificationCodeVerificationFailed", // 验证码错误
  "170116": "Error.FailedToObtainCodeToken", // 验证码已过期
  "170112": "Error.CodeSendError",
  "120120": "Error.TokenErrorExpiration",
  "120110": "Error.VerificationCodeUse", // 验证码已被使用
  // '120104': 'Error.AccountRegistered',
  "170113": "Error.SendLimits", // 上限
  "120108": "Error.FailedToObtainCodeToken", // 验证码已过期
  // 图形
  "160201": "Error.GraphicalTokenCreationFailed", // 图形CODE 创建失败
  "160202": "Error.TheGraphicCaptchaIncorrect", // 图形验证码不正确
  "160203": "Error.FailedToObtainCodeToken", // 图形验证CODE过期

  // 交易密码验证码相关
  "110109": "Error.SameOldNewPassword", // 新旧密码一致
  "110110": "Error.BirthdateValidationFailed", // 出生日期验证未通过
  "110114": "Error.PasswordFormatError", // 密码格式错误
  "110116": "Error.MissingParameter", // 缺少传入的参数
  "110117": "Error.PasswordDecryptionFailure", // 密码解密失败
  "100043": "Error.RsaKeyPairInvalid", // RSA秘钥对不存在或已过期
  "100044": "Error.DecryptionFailure", // 解密失败
  "110203": "Error.VerificationCodeSendFailed", // 验证码发送失败
  "110118": "Error.TransactionAccountNotExists", // 交易账户不存在
  "170201": "Error.ContactInfoNotFound", // 未查询到联系信息
  "110101": "Error.IncorrectPassword", // 密码验证失败
  // 新版交易密码
  140021: "Error.AccountDoesNotExist", // 用户绑定 uuid 信息未发现
  140024: "Error.SystemError", // 系统异常，请稍后再试
  140025: "Error.SystemError", // 系统异常，请稍后再试
  // ...transactionPasswordFlowError, // 需要跳出当前交易密码流程的错误码
  140027: "Error.SystemError", // 系统异常，请稍后再试
  140028: "Error.SystemError", // 系统异常，请稍后再试
  140029: "Error.VerifyCodeFrequent", // 验证码发送频繁，请稍后再试
  [transactionAccountVerificationError]: "Error.VerifyCodeInvalid", // 验证码错误，请重新输入
  140031: "Error.PasswordError", // 密码错误，请重试
  140032: "Error.OldAndNewPasswordSame", // 新旧密码一致，请重新设置
  140033: "Error.WrongBirthday", // 出生日期错误，请重新输入
  140034: "Error.OldPasswordError", // 旧密码错误，请重新输入

  //
  // 用户体系相关
  "110806": "Error.BindPhoneEmailException", // 绑定失败，请重试
  "110803": "Error.VerificationCodeError", // 验证码错误
  "110804": "Error.VerificationCodeExpired", // 验证码已失效，请重新获取
  "110805": "Error.VerificationCodeUsed", // 验证码已被使用，请重新获取
  "110809": "Error.PhoneEmailBindRepeat", // 绑定失败，已绑定其他号码
  "110302": "Error.PhoneMissing", // 流程异常，请返回后重新操作
  "110303": "Error.PhoneInvalid", // 流程异常，请返回后重新操作
  "110304": "Error.EmailInvalid", // 流程异常，请返回后重新操作
  "110308": "Error.PhoneAreaCodeInvalid", // 流程异常，请返回后重新操作
  "110801": "Error.ModifyPhoneEmailException", // 修改失败，请重试
  "110501": "Error.VerificationCodeSendLimit", // 今日验证码获取次数已达上限
  "110502": "Error.VerificationCodeSendBusinessTypeException", // 操作失败，请重试
  "160801": "Error.VerificationCodeSendFailed", // 验证码发送失败
  "160403": "Error.GeetestVerificationSuccessFailed", // 验证不通过，请重试验证
  "110504": "Error.VerificationCodeSendInterval", // 发送频繁，请稍后重试
  "110301": "Error.EmailMissing", // 流程异常，请返回后重新操作
  "110701": "Error.VerificationCodeError", // 验证码错误
  "110702": "Error.VerificationCodeExpired", // 验证码已失效，请重新获取
  "110703": "Error.VerificationCodeUsed", // 验证码已被使用，请重新获取
  "110704": "Error.VerificationCodeBusinessTypeException", // 流程异常，请返回后重新操作
  "110705": "Error.UserNotFoundByAid", // 流程异常，请返回后重新操作
  "110503": "Error.UserInfoNotFound", // 流程异常，请返回后重新操作
  // ...gt4ErrorCodes, // 极验验证码
  // ...updateInfoErrorCodesShouldBack, // 需要跳出当前修改信息流程的错误码
  // ...updateInfoErrorCodesShouldBackToApp, // 需要返回到 APP 的错误码
  // ...updateInfoErrorCodesShouldBackToFirst, // 需要返回到第一页的错误码

  /** */
  // '110305': '号码已注册，请直接登录',
  // '110306': '注册成功，自动登录失败请重新登录',
  // '110307': '密码强度不符合要求，请重新设置',
  // '110311': '验证码错误',
  // '110312': '验证码已失效',
  // '110313': '验证码已被使用',
  // '110315': '操作失败，请重试',
  // '110309': '用户不存在，请重新输入',
  // '110310': '身份信息已过期，请重新验证',
  // '110314': '操作失败，请重试',
  // '110401': '流程异常，请返回后重新操作',
  // '110402': '流程异常，请返回后重新操作',
  // '110403': '流程异常，请返回后重新操作',
  // '110404': '密码错误，xx次后将自动锁定登录密码',
  // '110405': '密码错误，登录密码已锁定，xx分钟自动解锁',
  // '110406': '登录密码已锁定，xx分钟自动解锁',
  // '110407': '请完成身份验证',
  // '110408': '请完成身份验证',
  // '110409': '请完成身份验证',
  // '110410': '验证码错误',
  // '110411': '验证码已失效',
  // '110412': '验证码已被使用',
  // '110413': '密码强度过低，请重新设置密码',
  // '110414': '密码修改失败，请重试',
  // '110415': '用户未注册',
  // '110416': '流程异常，请返回后重新操作',
  // '110417': '流程异常，请返回后重新操作',
  // '110419': '登录失败',
  // '160402': '服务异常，请更换验证方式',
  // '110001': '账户已禁用',
  // '110002': '账户已注销',
  // '110506': '验证码错误',
  // '110507': '验证码已失效',
  // '110508': '验证码已被使用',
  // '110509': '用户不存在，请重新输入',
  // '110601': '修改失败，密码强度过低',
  // '110602': '流程异常，请返回后重新操作',
  // '110603': '密码修改失败，请重试',
  // '110604': '流程异常，请返回后重新操作',
} as { [key: string]: string };

// 接口错误码对应提示
export default {
  ...errors,
  // 本地错误
  "1001": "Error.ClientUnknownError",
  "1002": "Error.ClientUnknownError",
  "8003": "Error.InviteCodeError",
  "2500": "Profile.HintUselessLink",
  "4701": "Social.HintRepeatBinding",
  "4702": "Social.HintBindSocialFailed",
  "4703": "Social.HintBindSocialExpired",
  "4704": "Social.HintRepeatBindingSocial",
  "4705": "Social.HintNoBindManagement",
  "4008": "Dashboard.HintAccountHasBind",
  "4009": "Dashboard.HintAccountAccessDenied",
  "5400": "Setting.HintSystemSettingError",
  "7010": "Rebate.HintHasNoStrategy",
} as { [key: string]: string };

/** 错误码信息，对应intl翻译 */
export const errMessage = (code: number | string): string => {
  // if (code !== undefined && code !== null) {
  //     if (errors[code]) {
  //         return intl.get(errors[code]).d(errors[code]); // 获取对应的错误码
  //     } else {
  //         return intl.get('Error.ClientUnknownError');
  //     }
  // } else {
  //     return '';
  // }
  return code.toString();
};

