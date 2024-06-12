import { IndexBar, List, SearchBar } from "antd-mobile";
import { IndexBarRef } from "antd-mobile/es/components/index-bar";
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Checked, Search } from "../../icon";

import Empty from "../Empty";
import { LocaleContext } from "../LocaleProvider";
import { SelectListItem, SelectListData as item } from "../types";
import "./index.less";
import { checkChinese } from "./utils";

const classPrefix = "h5d-checklist";

interface checkBoxDataItemProps extends item {
  afterNode?: {
    node: (props: any) => JSX.Element;
    nodeValue: string;
    required?: boolean;
    message?: string;
  };
  afterNodeValue?: any;
}

type checkBoxData = checkBoxDataItemProps[];

// 继承item数据类型，增加三种数据： 是否选中 其他 其他之前
interface listItem extends item {
  isSelect?: boolean;
  extra?: ReactNode;
  extraBefore?: ReactNode;
}

export type listType = listItem[];

export interface iProps {
  isSearch?: boolean; // 是否需要搜索框
  sticky?: boolean; // 是否开启锚点自动吸顶
  // defaultValue?: ReactNode; // 默认选择

  listData: listType; // 列表数据

  onChange?: (val: any) => void;
  value?: string | number; // 选中数据

  showSelectIcon?: boolean;

  model?: "list" | "indexes"; // 普通列表 | 带索引的列表
  onChangeDataType?: string;

  fixedOptions?: {
    values?: Array<string>; // 需要固定的value
    includeChecked?: boolean; // 选中的是否需要固定
    title?: ReactNode; // 标题
  };
  /** 是否把选中项滚动到屏幕中间，默认 false */
  scrollIntoView?: boolean;
}

const generateData: (data: checkBoxData) => listItem[] = (data) =>
  data.map((item) => ({ ...item, isSelect: false }));

/**
 * 生成分类组别
 * @param data
 * @returns Array<{ title: string; items: listType }>
 *
 */
const generateGroupList = (data: SelectListItem | listType) => {
  const groupList: Array<{ title: string; items: listType }> = [];
  const noazList: { title: string; items: listType } = {
    title: "#",
    items: [],
  };
  data.map((item) => {
    const title = checkChinese(item.label).toUpperCase(); // 获取所有条目中的每一项拼音的缩写，转化为大写字母
    if (/^[a-z|A-Z]/gi.test(title[0])) {
      // 判断是否能识别出来，不能识别，放到数组最后
      const currentGroup = groupList.find((item) => item.title === title[0]);
      if (currentGroup) {
        currentGroup.items.push({
          ...item,
          ...((item as listItem).isSelect
            ? { isSelect: (item as listItem).isSelect }
            : { isSelect: false }),
        });
      } else {
        groupList.push({
          title: title[0],
          items: [
            {
              ...item,
              ...((item as listItem).isSelect
                ? { isSelect: (item as listItem).isSelect }
                : { isSelect: false }),
            },
          ],
        });
      }
    } else {
      // noazList.title = title[0];
      noazList.items.push({
        ...item,
        ...((item as listItem).isSelect
          ? { isSelect: (item as listItem).isSelect }
          : { isSelect: false }),
      });
    }
  });
  // 合并的成组的数据，进行排序
  groupList.sort((a, b) => (a.title > b.title ? 1 : -1));
  noazList.items.length && groupList.unshift(noazList);
  return groupList;
};
/** 根据父组件传参，是否有条目需要固定的对象，需要固定哪些条目，固定的条目需要从数据中删除掉  */
const filterFixedList = (
  data: listType,
  fixedOptions: iProps["fixedOptions"] | undefined
) => {
  if (fixedOptions) {
    const { values, includeChecked } = fixedOptions;
    return data
      .filter((e) => !values?.includes(e.value))
      .filter((e) => (includeChecked ? !e.isSelect : true));
  }
  return data;
};
/** 根据父组件传参，是否有条目需要固定的对象，有，固定起来  合并父组件传过来的数据 */
const generateFixedList = (
  data: listType,
  fixedOptions: iProps["fixedOptions"] | undefined
) => {
  if (fixedOptions) {
    const { values, includeChecked } = fixedOptions;
    return [
      ...data
        .filter((e) => !values?.includes(e.value))
        .filter((e) => (includeChecked ? e.isSelect : false)),
      ...data.filter((e) => values?.includes(e.value)),
    ];
  }
  return [];
};

/**
 * onChangeDataType 控制返回listData中的哪个key 默认none 返回整个item
 *
 */
const CheckList = (props: iProps) => {
  const locale = useContext(LocaleContext);
  const {
    listData,
    sticky,
    isSearch,
    showSelectIcon = true,
    onChange,
    value,
    model = "list",
    onChangeDataType = "none",
    fixedOptions,
    scrollIntoView = false,
  } = props;
  const [list, setList] = useState<listType>(
    generateData(filterFixedList(listData, fixedOptions))
  );
  const [groupList, setGroupList] = useState(
    generateGroupList(filterFixedList(listData, fixedOptions))
  );
  const [searcValue, setSearcValue] = useState("");
  const [FixedList, setFixedList] = useState(
    generateData(generateFixedList(listData, fixedOptions))
  );
  const [searchFoucs, setSearchFoucs] = useState<boolean>(false);
  const [
    FixedTitle,
    // setFixedTitle
  ] = useState(fixedOptions?.title || ""); // 固定头部的标题
  const indexBarRef = useRef<IndexBarRef>(null); // 带索引的列表dom

  const searchDOM = useRef<any>(); // 搜索组件外层的dom
  const fixedPptionsDOM = useRef<any>(); // 需要固定的列表的dom
  const fixedTitleDOM = useRef<any>(); // title的dom
  const triggerScrollIntoViewRef = useRef(scrollIntoView); // 是否需要让选中项滚动到屏幕中间

  /** 滚动选中项到屏幕中间 */
  const selectedNodeRef = useCallback((node: HTMLSpanElement) => {
    if (node && triggerScrollIntoViewRef.current) {
      setTimeout(() => {
        node?.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      });
    }
  }, []);

  /** 搜索的onChange事件：获取搜索的数据 */
  const SearcChange = useCallback((e: any) => setSearcValue(e), []);

  /** 选中的数据 */
  const _onChange = useCallback(
    (item: any, index: number, isFxed: boolean) => () => {
      // 点击选择的时候，标识为 false，表示手动选中的情况下不需要自动滚动到屏幕中间
      triggerScrollIntoViewRef.current = false;
      const params = { ...item, index, isSelect: true };
      isFxed
        ? setFixedList((e) =>
            e.map((el) => ({ ...el, isSelect: item.value === el.value }))
          )
        : setList((e) =>
            e.map((el) => ({ ...el, isSelect: item.value === el.value }))
          );
      onChange &&
        onChange(
          onChangeDataType === "none" ? params : params[onChangeDataType]
        );
    },
    [onChange, onChangeDataType]
  );

  /** 额外的数据展示：icon 选中的对号icon */
  const getItemExtra = (item: any) => {
    if (showSelectIcon) {
      if (item.extra) {
        if (item.isSelect)
          return (
            <>
              <div>
                <span className={`${classPrefix}-list-item-icon`}>
                  <Checked />
                </span>
              </div>
              {item.extra}
            </>
          );
        return item.extra;
      } else if (item.isSelect) {
        return (
          <span className={`${classPrefix}-list-item-icon`}>
            <Checked />
          </span>
        );
      }
    }
    return "";
  };

  /** 渲染列表中的每一项 */
  const getList = (list: listType, isFxed = false) => (
    <List>
      {list.map((item, index) => (
        <List.Item
          className={item.isSelect ? `${classPrefix}-list-item-selected` : ""}
          arrow={false}
          key={`${item.value}-${index}`}
          extra={getItemExtra(item)}
          onClick={_onChange(item, index, isFxed)}
        >
          <span ref={item.isSelect ? selectedNodeRef : null}>{item.label}</span>
        </List.Item>
      ))}
    </List>
  );

  /** 搜索label的数据改变，返回搜索到的新的数据，去除两边的空格 */
  const checkGroupList = useCallback(
    (data: SelectListItem) =>
      data.filter((item) => item.label.indexOf(searcValue.trim()) >= 0),
    [searcValue]
  );

  /**
   *  1.进入页面先判断model值，根据父组件传参判断，带索引的列表或普通列表
   *  2.整理初始数据，增加变量isSelect，循环条件是选中的value，是否为列表的数据的value
   *  3.数据拼接：成组数据、固定列表数据
   */
  useEffect(() => {
    if (model === "list") {
      setList(
        checkGroupList(
          filterFixedList(
            listData.map((item) => ({
              ...item,
              isSelect: value === item.value,
            })),
            fixedOptions
          )
        )
      );
    } else if (model === "indexes") {
      const newList = generateGroupList(
        checkGroupList(
          filterFixedList(
            listData.map((item) => ({
              ...item,
              isSelect: value === item.value,
            })),
            fixedOptions
          )
        )
      );
      setGroupList(newList); // 数据进行拼接
      const nTilt = (newList[0] || {}).title; // 获取列表中第一个数据
      // 设置页面渲染完，滚动到列表中的第一位
      setTimeout(() => {
        indexBarRef.current?.scrollTo(nTilt === "" ? "A" : nTilt || "");
      }, 0);
    }
    /** 如果有固定条目的配置项，需要设置固定的列表 */
    if (fixedOptions) {
      setFixedList(
        generateData(
          generateFixedList(
            listData.map((item) => ({
              ...item,
              isSelect: value === item.value,
            })),
            fixedOptions
          )
        ).map((item) => ({ ...item, isSelect: value === item.value }))
      );
    }
  }, [value, searcValue, listData, fixedOptions]);

  /** 获取样式 */
  const getStyle = () => {
    const fixedPptionsDOMHeight =
      ((fixedPptionsDOM.current as any)?.offsetHeight || 60) * FixedList.length; // 根据固定列表的数据量，获取固定列表的高度
    const searchDOMHeight = (searchDOM.current as any)?.offsetHeight || 0; // 获取搜索栏的高度
    const fTitleDOMHeight =
      (fixedTitleDOM.current as any)?.offsetHeight || FixedTitle ? 17 : 0; // 获取标题的高度，如果有标题，标题高度为17，

    return {
      height: `calc(100% - ${
        fixedPptionsDOMHeight + searchDOMHeight + fTitleDOMHeight
      }rem)`,
    }; // 减去搜索、固定列表、标题高度，返回主列表的高度
  };

  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // 获取右侧锚点列表的元素，阻止冒泡。点击索引时，避免触发了列表的选中事件
    const sidebar = mainRef.current?.querySelector(".adm-index-bar-sidebar");
    const handleClick = (e: Event) => e.stopPropagation();
    sidebar?.addEventListener("click", handleClick, true);

    // 返回一个清理函数
    return () => {
      sidebar?.removeEventListener("click", handleClick, true);
    };
  }, []);

  return (
    <div className={`${classPrefix}-main`} ref={mainRef}>
      {isSearch ? (
        <div
          className={
            searchFoucs ? `${classPrefix}-searchFocus` : `${classPrefix}-search`
          }
          ref={searchDOM}
        >
          <SearchBar
            icon={
              <span className={`${classPrefix}-search-icon`}>
                <Search />
              </span>
            }
            placeholder={locale.search}
            style={{
              "--placeholder-color": "#c6c6c6",
              "--padding-left": "16px",
            }}
            onChange={SearcChange}
            onFocus={() => setSearchFoucs(true)}
            onBlur={() => setSearchFoucs(false)}
          />
        </div>
      ) : (
        ""
      )}
      {FixedList.length ? (
        <>
          {FixedTitle ? (
            <div
              className={`${classPrefix}-fixedPptionsTitle`}
              ref={(dom) => (fixedTitleDOM.current = dom)}
            >
              {FixedTitle}
            </div>
          ) : (
            ""
          )}
          <div className={`${classPrefix}-fixedPptions`} ref={fixedPptionsDOM}>
            {getList(FixedList, true)}
          </div>
        </>
      ) : (
        ""
      )}
      <div
        className={[
          `${classPrefix}-content`,
          !isSearch && `${classPrefix}-noSearch`,
        ]
          .filter(Boolean)
          .join(" ")}
        style={getStyle()}
      >
        {model === "list" ? (
          getList(list)
        ) : (
          <>
            {groupList.length > 0 ? (
              <IndexBar sticky={sticky} ref={indexBarRef}>
                {groupList.map((group) => {
                  const { title, items } = group;
                  return (
                    <IndexBar.Panel
                      index={title}
                      title={title}
                      key={`group${title}`}
                    >
                      {getList(items)}
                    </IndexBar.Panel>
                  );
                })}
              </IndexBar>
            ) : (
              <Empty type="noResult" description={locale.notSearchData} />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default CheckList;

