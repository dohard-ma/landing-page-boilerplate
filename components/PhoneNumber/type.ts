export interface AreaItem {
    label: string;
    /**区号_国家id */
    value: string;
    isDefault: boolean;
}

export interface PhoneNumberProps {
    onChange?: (val: string[]) => void;
    onBlur?: () => void;
    placeholder?: string;
    /** [区号_国家id，手机号] */
    value?: string[];
    /**区号列表 */
    areaList: AreaItem[];
    readonly?: boolean;
}
