import { del, get, post, put, xhr } from '@baymax/h5-api';
import errors from './errors';

export { get, post, del, put };

xhr.addErrorinfo(errors);
