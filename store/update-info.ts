import { createContainer } from 'unstated-next';
import useContactInfo from '../pages/UpdateInfo/use/useContactInfo';
import useFlowDataStore from '../pages/UpdateInfo/use/useFlowDataStore';
import useOperateType from '../pages/UpdateInfo/use/useOperateType';
import useStep from '../pages/UpdateInfo/use/useStep';
import useVerifyMethod from '../pages/UpdateInfo/use/useVerifyMethod';
import useAreaList from '../use/useAreaList';

interface UpdateInfoDataType {}

const initialUpdateInfoData: UpdateInfoDataType = {};

export function useUpdateInfoStore(initialState = initialUpdateInfoData) {
    const stepController = useStep();
    const flowDataController = useFlowDataStore();
    const areaListController = useAreaList();
    const operateTypeController = useOperateType();
    const contactInfoController = useContactInfo();
    const verifyMethodController = useVerifyMethod(() => stepController.back(0));

    return {
        stepController,
        flowDataController,
        areaListController,
        operateTypeController,
        contactInfoController,
        verifyMethodController,
    } as const;
}

const updateInfoStore = createContainer(useUpdateInfoStore);
export default updateInfoStore;
