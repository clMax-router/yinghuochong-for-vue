// 导入BASE_URL
import { BASE_URL } from '@/utils/gateway'

// 导入api生成器
import CreateApi from '@/utils/createApi'

// 导入modules文件
import base from './modules/base'
import goods from './modules/goods'
import user from './modules/user'

const Modules = {
    base,
    user,
    goods
}

const config = {
    BASE_URL,
    TIMEOUT: 7 * 24 * 60 * 60 * 1000,
    WITHCORS: true,
    Modules
}
const api = new CreateApi(config).create()

export default api
