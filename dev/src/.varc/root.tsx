import { renderClient } from 'varc/lib/index';

const routes = JSON.parse('[{"path":"/","component":"@/pages/index"}]')

export default renderClient({routes, history: 'browser', rootEle: "root"})


