"use client";

// import historyObj from "@/src/utils/history";
import { ReactNode } from "react";
import * as intl from "react-intl-universal";
import Style from "./index.module.scss";
interface AuthContainerPropsType {
  children: ReactNode;
  mode: "SignUp" | "SignIn";
}

/** 登入注册基础容器 */
export default function AuthContainer(props: AuthContainerPropsType) {
  const { children, mode } = props;
  const title = {
    SignUp: intl.get("Auth.StartRegistration").d("开始注册"),
    SignIn: intl.get("Auth.WelcomeToUse").d("欢迎使用"),
  }[mode];
  return (
    <div className={Style["auth-container"]}>
      <div className={Style["title-info"]}>
        <div className={Style["logo"]}>
          {/* <Image src="/logo.webp" alt="" /> */}
        </div>
        <div className={Style["title"]}>{title}</div>
      </div>
      <div>{children}</div>
      {mode === "SignIn" ? (
        <div className={Style["tip-info"]}>
          <div className={Style["left"]}>
            <span>{intl.get("Auth.NoAccount").d("没有账号?")}</span>
            <span
              onClick={() => {
                // historyObj.history.push("/auth/sign-up");
              }}
            >
              {intl.get("Auth.GoToRegistration").d("前往注册")}
            </span>
          </div>
          <div
            className={Style["right"]}
            onClick={() => {
              // historyObj.history.push("/auth/forgot-password");
            }}
          >
            {intl.get("Auth.ForgotPassword").d("忘记密码")}?
          </div>
        </div>
      ) : null}
    </div>
  );
}

