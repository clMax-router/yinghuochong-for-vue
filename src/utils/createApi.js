// 导入axios
import Axios from 'axios'
// 导入qs模块
import qs from 'qs'

// 导入ant design vue
import { Message } from 'ant-design-vue'
// 定义一个api生成类
class CreateApi { // es6类
    // 构造函数
    constructor (config) {
        // 将config保存为一个全局配置
        this.config = config
        // 在构造函数中配置axios
        // 配置axios的请求地址
        Axios.defaults.baseURL = this.config.BASE_URL
        // 配置axios每次请求都带sessionId值
        Axios.defaults.withCredentials = this.config.WITHCORS
        // 配置axios的请求超时时间
        Axios.defaults.timeout = this.config.TIMEOUT
        // 配置axios在post请求的时候请求体以ajax的形式请求
        // 默认post请求头
        Axios.defaults.headers.post['Accept'] = 'application/json' // 设置post的响应为json
        Axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest' // 设置post请求为ajax请求
        // 定义一个axios拦截器
        Axios.interceptors.request.use(
            (req) => { // 请求拦截成功的回调函数 req当前的请求的值
                return req
            },
            (err) => {
                // 请求拦截失败的回调函数 请求失败
                return Promise.reject(err) // 返回.catch方法
            }
        )
        // 定义一个axios的响应拦截器
        Axios.interceptors.response.use(
            (res) => {
                // 如果响应码0 则代表请求成功
                if (res.data.code === 0) {
                    // 出去axios的第一层data 再去除服务器返回的数据的一层data
                    return res.data.data
                } else {
                    Message.err(res.data.msg)
                    return Promise.reject(res.data.msg)
                }
            },
            (err) => {
                // 响应失败
                return Promise.reject(err)
            }
        )
        // 获取__method的返回值
        this.method = this.__method()
    }

    //  生成api的方法
    create () {
        //  定义一个模块对象
        const modules = {}
        // 循环传过来的modules
        for (const module in this.config.Modules) {
            const modulesApi = {} //  用来保存每个api的模块
            this.config.Modules[module].forEach(item => {
                // 定义模块对象
                const moduleApi = (params) => {
                    item.params = params
                    // console.log(params)
                    //  判断接口规范是否正确
                    // 检测请求方法是否定义
                    // 如果为undefined则为未定义该方法
                    if (this.method[item.method] === undefined) {
                        console.log('未定义该方法', item.method)
                        return
                    }
                    return this.method[item.method](item)
                }
                modulesApi[item.name] = moduleApi
            })
            // 将所有的模块api保存到大模块中
            modules[module] = modulesApi
        }
        console.log(modules)
        return modules
    }

    //  定义一个发送请求的方法 私有的
    __method () {
        return {
            get (opt) {
                // 定义get需要的参数
                const params = opt.params || {}
                return Axios({
                    method: 'get', // 请求方式
                    url: opt.url, // 请求地址
                    responseType: 'json', // 请求返回类型
                    params // get请求参数
                })
            },
            post (opt) {
                // 定义post需要的参数
                const data = qs.stringify(opt.params) || {}
                return Axios({
                    method: 'post', // 请求方式
                    url: opt.url, // 请求地址
                    data // post请求参数
                })
            }
        }
    }
}

export default CreateApi
