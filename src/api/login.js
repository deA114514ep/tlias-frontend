// 登录相关
// 导入封装好的axios实例（包含基础配置和响应拦截器）
import request from "@/utils/request";

// 登录接口
export const loginApi = (data) =>request.post("/login",data);