import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '../router'

/**
 * @description 创建axios实例对象
 * @param {Object} config - axios实例配置对象
 * @property {string} baseURL - 基础URL，用于拼接请求地址（示例：'/api'会自动添加到所有请求URL前面）
 * @property {number} timeout - 请求超时时间（单位：毫秒），超过600000毫秒未响应则请求失败
 */
const request = axios.create({
  baseURL: '/api', // 所有请求的基础路径，可根据后端接口地址统一配置
  timeout: 600000 // 请求超时时间设置为10分钟（600000ms）
});

// 请求拦截器-获取localStorage中的token数据，在请求头中增加token
request.interceptors.request.use(
  (config) => { // 请求成功时的回调函数
    // 获取localStorage中的token数据
   const loginUser= JSON.parse(localStorage.getItem('loginUser'));
    // 判断token是否存在，如果存在则将其添加到请求头中
    if (loginUser&&loginUser.token) {
      config.headers.token=loginUser.token;
    }
    return config;
  },
  (error) => { // 请求失败时的回调函数
    ElMessage.error('请求发送失败，请检查网络连接');
    return Promise.reject(error);
  }
)




/**
 * @description axios响应拦截器（处理响应数据的统一入口）
 * @param {Function} response => response.data - 成功响应处理函数
 *   - 作用：对所有接口返回的response对象进行预处理
 *   - 常规操作：提取response中的data字段（后端返回的业务数据通常存储在此）
 * @param {Function} error => Promise.reject(error) - 失败响应处理函数
 *   - 作用：统一处理请求失败的情况（如网络错误、超时、后端异常等）
 *   - 常规操作：将错误对象包装为Promise.reject以便上层调用捕获
 */
request.interceptors.response.use(
  (response) => { // 响应成功时的回调函数
    // 这里默认返回response中的data字段，通常后端返回的结构为{code: xxx, data: xxx, message: xxx}
    // 可根据实际需求进一步处理（如统一错误码判断、数据格式化等）
    return response.data;
  },
  (error) => { // 响应失败时的回调函数
    if (error.response) {
      // 服务器响应了错误状态码
      if (error.response.status === 401) {
        // 提示信息
        ElMessage.error('登录超时，请重新登录');
        // 跳转到登陆页面
        router.push('/login');
      } else if (error.response.status === 403) {
        ElMessage.error('权限不足，无法访问该资源');
      } else if (error.response.status === 404) {
        ElMessage.error('请求的资源不存在');
      } else if (error.response.status >= 500) {
        ElMessage.error('服务器内部错误，请稍后重试');
      } else {
        ElMessage.error(`请求失败：${error.response.status} ${error.response.statusText}`);
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      ElMessage.error('网络连接异常，请检查网络设置');
    } else {
      // 其他错误
      ElMessage.error('请求配置错误');
    }
    // 对请求错误进行统一处理（如记录错误日志、提示用户、重试机制等）
    // 此处直接返回 rejected 状态的Promise，以便调用方通过.catch()捕获错误
    return Promise.reject(error);
  }
);

// 导出axios实例对象，供其他模块调用
export default request;