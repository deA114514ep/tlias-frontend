import request from '@/utils/request'

//分页条件查询
export const queryPageApi = (name, begin, end, page, pageSize) => 
  request.get(`/clazzs?name=${name}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)

//新增班级
export const addApi = (clazz) => request.post('/clazzs', clazz)

//根据ID查询班级
export const queryInfoApi = (id) => request.get(`/clazzs/${id}`)

//更新班级
export const updateApi = (clazz) => request.put(`/clazzs`, clazz)

//删除班级
export const deleteApi = (ids) => request.delete(`/clazzs?ids=${ids}`)

//查询全部班级信息
export const queryAllApi = () => request.get('/clazzs/list') 
