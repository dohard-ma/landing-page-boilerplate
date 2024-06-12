// import historyObj from "@/src/utils/history";
import { ComponentType } from "react";
import { Prompt } from "react-router";
import Style from "./index.module.scss";

interface Props {
  visible?: boolean;
}

const Mask: ComponentType<Props> = ({ visible } = { visible: false }) => {
  return (
    <>
      {/** visible 期间同时不允许返回 */}
      <Prompt
        when={visible}
        message={(location, action) => {
          if (
            visible &&
            action === "POP"
            // historyObj.history.location.pathname !== location.pathname
          ) {
            return false;
          }
          return true;
        }}
      />
      <div
        className={Style.container}
        style={{
          display: visible ? "block" : "none",
        }}
      >
        <div className={Style.main}></div>
      </div>
    </>
  );
};

export default Mask;

