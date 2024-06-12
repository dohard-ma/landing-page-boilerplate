import { FakePage } from "h5-design";
import { ComponentType, useCallback, useState } from "react";
import Style from "./index.module.scss";

interface PdfLinkProps {
  text: string;
  url: string;
  title: string;
}

const _PdfLink: ComponentType<PdfLinkProps> = (props) => {
  const { text, title, url } = props;
  const [visible, setVisible] = useState(false);

  const handleVisible = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  return (
    <div className={Style["container"]}>
      <div className={Style["main"]}>
        <span className={Style["link"]} onMouseDown={handleVisible}>
          {text}
        </span>
        <FakePage
          path={window.location.pathname}
          isShow={visible}
          header={title}
          onClose={handleVisible}
        >
          <div className={Style["pdf-wrapper"]}>
            <div className={Style["pdf-inner"]}></div>
          </div>
        </FakePage>
      </div>
    </div>
  );
};

const PdfLink = _PdfLink;

export default PdfLink;

