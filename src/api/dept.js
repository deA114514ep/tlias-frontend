// 导入封装好的axios实例（包含基础配置和响应拦截器）
import request from "@/utils/request";

/**
 * @description 查询全部部门数据信息
 * @returns {Promise} 返回Promise对象，成功时返回部门列表数据
 * @example
 * queryAllApi().then(data => {
 *   console.log('部门列表:', data);
 * }).catch(error => {
 *   console.error('获取部门列表失败:', error);
 * });
 */
// 发起GET请求，路径为基础URL（/api）拼接/depts，即/api/depts
export const queryAllApi = () => request.get('/depts');

// 新增部门时我们要向后端传输数据，所以需要定义一个参数dapt，用于接收要传输的数据
// 这样在新增时就会发送post请求，将部门数据传入后端
export const addApi = (dept) => request.post('/depts', dept);

// 根据id查询部门信息
export const queryByIdApi = (id) => request.get(`/depts/${id}`);

//  修改部门信息
export const updateApi = (dept) => request.put('/depts', dept);

// 删除部门信息
export const deleteApi = (id) => request.delete(`/depts?id=${id}`);
