import { renderClient } from '{{{importRender}}}';

const routes = JSON.parse('{{{importRoutes}}}')

export default renderClient({routes, history: '{{history}}', rootEle: "{{rootEle}}"})


