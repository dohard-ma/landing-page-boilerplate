import * as React from "react";
import Style from "./index.module.scss";

// import { PDFJSWorker } from './pdf.worker';
// import * as PDFJS from 'pdfjs-dist'
import { Button, DotLoading } from "antd-mobile";
// import fullContent from './fullContent';
// import Icon from "@/src/components/IconFont";
// import { getHistory } from "@/src/utils/history";
import throttle from "lodash/throttle";
// import { isEqual } from 'lodash';
const PDFJS = require("pdfjs-dist");
// TODO处理offline下的路径问题
PDFJS.GlobalWorkerOptions.workerSrc = "/h5web/kyc/pdf.worker.js";

declare global {
  interface HTMLCanvasElement {
    // 用于标记是否已经渲染
    rendered?: boolean;
  }
}

const Icon = ({ name }) => {
  return <span>{name}</span>;
};

interface PDFPromise<T> {
  isResolved: () => boolean;
  isRejected: () => boolean;
  resolve: (value: T) => void;
  reject: (reason: string) => void;
  then: <U>(
    onResolve: (promise: T) => U,
    onReject?: (reason: string) => void
  ) => PDFPromise<U>;
}

interface PDFDoc {
  numPages: number;
  fingerprint: string;
  view: Array<number>;
  embeddedFontsUsed: () => boolean;
  getPage: (n: number) => PDFPromise<any>;
  getViewport: (n: { scale: number }) => any;
  getJavaScript: () => PDFPromise<string[]>;
  getOutline: () => PDFPromise<Array<any>>;
  getMetadata: () => PDFPromise<{ info: any; metadata: any }>;
  render: (args: any) => void;
  destroy: () => void;
}

interface drawParams {
  page: PDFDoc;
  scale?: number;
  canvas?: any;
  isLoading?: boolean;
}

export interface PDFReaderProps {
  src: string;
  hideButton?: boolean;
  scale?: number;
  style?: React.CSSProperties;
  overlayStyle?: any;
  model?: "multiple" | "single";
  btnDirection?: "left" | "center" | "right";
}

export interface PDFReaderState {
  pdf: PDFDoc | null;
  page: number;
  scale: number;
  loading: boolean;
}

/**
 * PDFReader
 */
class PDFReader extends React.Component<PDFReaderProps, PDFReaderState> {
  private mounted: boolean = true;
  private doc: PDFDoc | null = null;
  private core: HTMLCanvasElement | null = null;
  private cores: (HTMLCanvasElement | null)[] = [];
  private initialSrc: string = "";
  private static scale: any = {
    zoom: 1.2,
    minify: 0.8,
  };
  private static page: any = {
    next: 1,
    prev: -1,
  };
  // 滚动容器的 ref
  private scrollContainerRef = React.createRef<HTMLDivElement>();
  // 滚动容器的 DOM 元素
  private scrollContainer: HTMLDivElement | null = null;
  // 预期的 canvas 高度。用于判断 canvas 是否在可视区域内
  private expectedCanvasHeight: number | null = null;

  // canvas的默认宽高
  private defaultCanvasHeight = window.innerHeight / 2;
  private defaultCanvasWidth = window.innerWidth / 2;

  //   history = getHistory();

  constructor(props: PDFReaderProps) {
    super(props);
    this.state = {
      pdf: null,
      page: 1,
      scale: props.scale || 1,
      loading: true,
    };
    // load web worker
    // if (typeof window !== 'undefined' && 'Worker' in window) {
    //     // PDFJS.GlobalWorkerOptions.workerPort = new PDFJS.PDFWorker();
    // }
  }

  initData = (src: string) => {
    this.mounted = true;
    const { model } = this.props;
    if (!src) return;
    PDFJS.getDocument({ url: src }).promise.then((pdf: any) => {
      this.initialSrc = src;
      this.doc = pdf;
      if (model === "single") {
        pdf.getPage(this.state.page).then((p: any) => {
          this.drawPDF({ page: p, scale: this.state.scale || 1 });
        });
      }
      this.mounted &&
        this.setState({ pdf }, () => {
          setTimeout(() => {
            this.drawALLPDF(this.cores, pdf, this.state.scale);
          }, 0);
        });
    });
  };

  /**
   * 滚动事件处理函数
   */
  private handleScroll = throttle(() => {
    if (this.scrollContainer) {
      // 检查哪些页面是可见的
      const visiblePages = this.getVisiblePages();
      if (visiblePages && visiblePages.length) {
        // 渲染这些页面
        this.renderVisiblePages(visiblePages);
      }
    }
  }, 200);

  /**
   * 获取可见的页面
   */
  private getVisiblePages = () => {
    if (!this.scrollContainer) {
      return;
    }
    const visiblePages: number[] = [];
    // 容器的顶部和底部
    const containerTop = this.scrollContainer.scrollTop;
    // 加10像素的容差;以确保即使有轻微的偏移，canvas 也会被认为是可见的。解决最后一页无法渲染的问题
    const containerBottom =
      containerTop + this.scrollContainer.clientHeight + 10;

    this.cores.forEach((canvas, index) => {
      if (!canvas) {
        return;
      }
      const canvasTop = canvas.offsetTop;
      const canvasBottom = canvasTop + canvas.clientHeight;
      // 如果 canvas 在可视区域内，将其添加到 visiblePages 数组中
      // 如果是最后一页，且 canvas 的顶部在可视区域内，也将其添加到 visiblePages 数组中
      if (
        (canvasBottom >= containerTop && canvasTop <= containerBottom) ||
        (index === this.cores.length - 1 && canvasTop < containerBottom)
      ) {
        visiblePages.push(index);
      }
    });

    return visiblePages;
  };

  /**
   * 渲染可见的页面
   */
  private renderVisiblePages = (visiblePages: number[]) => {
    visiblePages.forEach((pageIndex) => {
      const canvas = this.cores[pageIndex];
      if (canvas && !canvas.rendered) {
        this.doc?.getPage(pageIndex + 1).then((p) => {
          // 渲染页面。使用默认的缩放比例
          this.drawPDF({ page: p, canvas, scale: this.state.scale || 1 });
          canvas.rendered = true; // 标记为已渲染
        });
      }
    });
  };

  componentDidMount() {
    this.initData(this.props.src);

    this.scrollContainer = this.scrollContainerRef.current;
    if (this.scrollContainer) {
      // 添加滚动事件监听器。动态加载页面
      this.scrollContainer.addEventListener("scroll", this.handleScroll);
    }
  }

  componentDidUpdate(nextProps: PDFReaderProps) {
    if (nextProps.src !== this.props.src) {
      this.doc && this.doc.destroy();

      this.mounted = true;
      this.doc = null;
      this.core = null;
      this.cores = [];
      this.initialSrc = "";
      setTimeout(() => {
        this.setState(
          {
            pdf: null,
            page: 1,
            scale: this.props.scale || 1,
            loading: true,
          },
          () => {
            this.initData(this.props.src);
          }
        );
      }, 0);
    }
  }

  // shouldComponentUpdate(nextProps:PDFReaderProps){
  //     return !isEqual(nextProps,this.props);
  // }

  componentWillUnmount() {
    this.mounted = false;
    this.doc && this.doc.destroy();

    // 移除滚动事件监听器
    if (this.scrollContainer) {
      this.scrollContainer.removeEventListener("scroll", this.handleScroll);
    }
  }

  /**
   * 渲染所有页面。用于多页模式
   * 只会渲染可视区域内的页面，其他页面跟随滚动动态渲染
   */
  private drawALLPDF = async (
    container: (HTMLCanvasElement | null)[],
    pdf: PDFDoc,
    scale: number = 1
  ) => {
    this.setState({ loading: true });
    if (container.length) {
      // 如果缩放比例发生变化，重新渲染所有已经渲染了的页面
      if (scale !== this.state.scale) {
        await Promise.all(
          container.map(async (canvas, i) => {
            if (canvas?.rendered) {
              const page = await pdf.getPage(i + 1);
              this.drawPDF({ page, scale, canvas, isLoading: false });
            }
          })
        );
      } else {
        // 首先渲染第一页，来计算预期的 canvas 高度，以便后续判断 canvas 是否在可视区域内
        if (container[0]) {
          const firstPage = await pdf.getPage(1);
          this.drawPDF({
            page: firstPage,
            scale,
            canvas: container[0],
            isLoading: false,
          });
        }
        // 等待第一页渲染完成并更新。创建一个微任务，以便其他页面可以在第一页渲染完成后立即渲染
        await new Promise((resolve) => setTimeout(resolve, 0));

        // 检查其他页面是否在可视区域内，并进行渲染
        for (let i = 1; i < container.length; i++) {
          const canvas = container[i];
          // 如果 canvas 在可视区域内，渲染页面
          if (canvas && this.isCanvasInViewport(canvas)) {
            const page = await pdf.getPage(i + 1);
            canvas.rendered = true; // 提前标记为已渲染
            this.drawPDF({ page, scale, canvas, isLoading: false });
          }
        }
      }
    }
    setTimeout(() => {
      this.setState({ loading: false });
    }, 0);
  };

  // 检查 canvas 是否在可视区域内
  private isCanvasInViewport(canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const expectedHeight = this.expectedCanvasHeight || rect.height; // 使用预期的高度
    return (
      rect.top + expectedHeight >= 0 &&
      rect.left >= 0 &&
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left + rect.width <=
        (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // draw file
  private drawPDF = (params: drawParams) => {
    const { page, scale = 1, canvas = null, isLoading = true } = params;
    isLoading && this.setState({ loading: true });
    const _canvas = canvas || this.core;
    let originViewport = page.getViewport({ scale: 1 }); // pdf 文件宽度
    let offsetWidth = _canvas?.parentElement?.offsetWidth || 1; // 容器宽度
    let multiple = (offsetWidth / originViewport.width) * scale || 1; // 尺寸缩放比例
    let targetViewport = page.getViewport({ scale: multiple });
    let canvasContext = _canvas?.getContext("2d");
    _canvas && (_canvas.height = targetViewport.height);
    _canvas && (_canvas.width = targetViewport.width);

    // Try to render the page and catch any errors
    try {
      page.render({ canvasContext, viewport: targetViewport });

      // 如果 expectedCanvasHeight 尚未设置，使用当前 canvas 的高度作为预期高度
      if (this.expectedCanvasHeight === null) {
        this.expectedCanvasHeight = targetViewport.height;
      }
      _canvas && (_canvas.rendered = true); // 标记为已渲染
      isLoading && this.setState({ loading: false });
    } catch (error) {
      // Reset the rendered flag to allow retrying the rendering
      if (_canvas) {
        _canvas.rendered = false;
      }
    }
  };

  // scale
  private scale = (multiple: number) => () => {
    const { model } = this.props;
    const { pdf, scale } = this.state;
    if (!pdf) return;
    const deal = scale * multiple;
    model === "single"
      ? pdf
          .getPage(this.state.page)
          .then((p: PDFDoc) => this.drawPDF({ page: p, scale: deal }))
      : this.drawALLPDF(this.cores, pdf, deal);
    this.mounted && this.setState({ scale: deal });
  };

  // page change
  private pagination = (step: number) => () => {
    const pdf = this.pdf;
    if (!pdf) return;
    const { lastPage, next, prev, core } = pdf;
    if (!next && !prev) return;
    const currPage = lastPage + step;
    core.getPage(currPage).then((p: PDFDoc) => this.drawPDF({ page: p }));
    this.mounted && this.setState({ page: currPage });
  };

  // reset canvas
  private reset = () => {
    const { model, scale } = this.props;
    const { pdf, page } = this.state;
    pdf &&
      (model === "single"
        ? pdf
            ?.getPage(page)
            .then((p: PDFDoc) => this.drawPDF({ page: p, scale: scale || 1 }))
        : this.drawALLPDF(this.cores, pdf, scale || 1));
    this.mounted && this.setState({ scale: scale || 1 });
  };

  // pagination disable
  private get pdf() {
    const { pdf, page } = this.state;
    if (!pdf) return null;
    const maxPage = pdf.numPages || 0;
    return {
      maxPage,
      lastPage: page,
      next: maxPage > page,
      prev: page > 1,
      reset: !!this.initialSrc && this.props.src === this.initialSrc,
      core: pdf,
    };
  }

  // private fullScreen = () => {
  //     const { src } = this.props;
  //     const newWindow = window.open();
  //     newWindow?.document.write(fullContent(src));
  // };

  getAllPage = () => {
    const { maxPage } = this.pdf || {};
    if (maxPage) {
      return Array.from(Array(maxPage)).map((_, i) => (
        <canvas
          key={`canvas_pad_${i}`}
          width={this.defaultCanvasWidth}
          height={this.defaultCanvasHeight}
          ref={(ctx: HTMLCanvasElement) => (this.cores[i] = ctx)}
        />
      ));
    }
  };

  // render content
  render() {
    const {
      style,
      overlayStyle,
      hideButton,
      model = "single",
      btnDirection = "left",
    } = this.props;
    const { loading } = this.state;
    const pdf = this.pdf;
    const maxWidth =
      (this.core && this.core.parentElement?.offsetWidth) || "100%";
    const overflow =
      this.state.scale > 1 || model !== "single" ? "auto" : "hidden";
    return (
      <div className={Style.main} style={style}>
        {!!pdf && !hideButton && (
          <div
            className={[Style.btns, Style[`btns-${btnDirection}`]].join(" ")}
          >
            {model === "single" ? (
              <>
                <Button
                  fill="none"
                  disabled={!pdf.prev}
                  onClick={this.pagination(PDFReader.page.prev)}
                >
                  <Icon name="icon-new-left" />
                </Button>
                <Button
                  fill="none"
                  disabled={!pdf.next}
                  onClick={this.pagination(PDFReader.page.next)}
                >
                  <Icon name="icon-new-right" />
                </Button>
              </>
            ) : (
              ""
            )}
            <Button fill="none" onClick={this.scale(PDFReader.scale.zoom)}>
              <Icon name="icon-new-plus" />
            </Button>
            <Button fill="none" onClick={this.scale(PDFReader.scale.minify)}>
              <Icon name="icon-new-minus" />
            </Button>
            <Button fill="none" disabled={!pdf.reset} onClick={this.reset}>
              <Icon name="icon-new-undo" />
            </Button>
            {/* <Button fill="none" onClick={this.fullScreen}>
                        <Icon name="icon-new-fullscreen" />
                    </Button> */}
          </div>
        )}
        {loading ? <DotLoading /> : ""}
        <div
          className={Style["pdf-scroll"]}
          style={{ maxWidth, ...overlayStyle, overflow }}
          ref={this.scrollContainerRef}
        >
          {model === "single" ? (
            <canvas
              width={this.defaultCanvasWidth}
              height={this.defaultCanvasHeight}
              ref={(ctx: HTMLCanvasElement) => (this.core = ctx)}
            />
          ) : (
            this.getAllPage()
          )}
        </div>
      </div>
    );
  }
}

(PDFReader as any).defaultProps = {
  model: "single",
};

export default PDFReader;

