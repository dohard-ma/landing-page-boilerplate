import { get } from "@/lib/axios";
import { ResolvedRes } from "@baymax/h5-api";

export type Res<T> = ResolvedRes<T>;

export type GetParams = Parameters<typeof get>;

