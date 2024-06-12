"use client";

import {
  emailRule as getEmailRule,
  phoneRule as getPhoneRule,
} from "@/lib/utils";
import { useSignInDataStore } from "@/store/sign-in-data";
import { ComponentType, useCallback, useMemo } from "react";
import ContactSwitcher from "./ContactSwitcher";
import AuthContainer from "./Container";
import usePpasswordStrengthRules from "./use/usePpasswordStrengthRules";

type SignInProps = {
  headerFN: any;
} & ReturnType<typeof useSignInDataStore>;

const passwordRule = {
  required: true,
};

const _SignIn: ComponentType<SignInProps> = (props) => {
  // const { areaListController, signInData, updateSignInData } = props;
  // const { areaList, fetchAreaList } = areaListController;
  const { privacyPolicy, termsOfUse } = usePpasswordStrengthRules();
  const sign = useMemo(
    () => ({ privacyPolicy, termsOfUse }),
    [privacyPolicy, termsOfUse]
  );
  const emailRule = useMemo(() => getEmailRule(), []);
  const phoneRule = useMemo(() => getPhoneRule(), []);

  // useEffect(() => {
  //   fetchAreaList();
  // }, [fetchAreaList]);

  const handleSubmit = useCallback(() => {}, []);

  return (
    <AuthContainer mode="SignIn">
      <ContactSwitcher
        emailRule={emailRule}
        phoneRule={phoneRule}
        areaList={[]}
        passwordRule={passwordRule}
        sign={sign}
        authData={{}}
        updateAuthData={() => {}}
        mode={"SignIn"}
        submit={() => Promise.resolve()}
      />
    </AuthContainer>
  );
};

export default _SignIn;

