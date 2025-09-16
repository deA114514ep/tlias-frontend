import request from '@/utils/request'

//分页条件查询
export const queryPageApi = (page, pageSize) => request.get(`/log/page?page=${page}&pageSize=${pageSize}`)

//清空所有操作日志
export const clearAllLogsApi = () => request.delete('/log/clear')
