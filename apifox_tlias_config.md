# Tlias后端项目Apifox联调配置指南

## 项目信息
- **后端项目路径**: `C:\Users\30598\Desktop\ctConfig\tlias-web-project`
- **后端端口**: 8080
- **前端端口**: 5173
- **数据库**: MySQL (tlias)

## 1. 后端启动检查

### 启动后端服务
```bash
# 方法1：使用JAR包启动
cd "C:\Users\30598\Desktop\ctConfig\tlias-web-project\tlias-common\tlias-web"
java -jar target/tlias-web-0.0.1-SNAPSHOT.jar

# 方法2：使用Maven启动
cd "C:\Users\30598\Desktop\ctConfig\tlias-web-project\tlias-parent"
mvn spring-boot:run -pl tlias-common/tlias-web
```

### 验证后端启动
访问: `http://localhost:8080/emps?page=1&pageSize=10`
应该返回JSON格式数据。

## 2. Apifox项目配置

### 创建项目
1. 打开Apifox
2. 创建新项目：`Tlias员工管理系统`
3. 选择项目类型：`Web API`

### 环境配置
```yaml
# 开发环境
baseUrl: http://localhost:8080
frontendUrl: http://localhost:5173

# 环境变量
token: {{token}}
userId: {{userId}}
```

## 3. 核心API接口配置

### 3.1 登录接口
```http
POST {{baseUrl}}/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

**预期响应**:
```json
{
  "code": 1,
  "msg": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "name": "管理员",
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

### 3.2 员工管理接口

#### 查询员工列表
```http
GET {{baseUrl}}/emps?page=1&pageSize=10
Headers:
  token: {{token}}
  Content-Type: application/json
```

#### 添加员工
```http
POST {{baseUrl}}/emps
Headers:
  token: {{token}}
  Content-Type: application/json

{
  "name": "张三",
  "gender": "男",
  "image": "https://example.com/avatar.jpg",
  "job": 1,
  "entryDate": "2024-01-01",
  "deptId": 1
}
```

#### 修改员工
```http
PUT {{baseUrl}}/emps
Headers:
  token: {{token}}
  Content-Type: application/json

{
  "id": 1,
  "name": "李四",
  "gender": "女",
  "image": "https://example.com/avatar.jpg",
  "job": 2,
  "entryDate": "2024-01-01",
  "deptId": 1
}
```

#### 删除员工
```http
DELETE {{baseUrl}}/emps?ids=1,2,3
Headers:
  token: {{token}}
  Content-Type: application/json
```

### 3.3 学生管理接口

#### 查询学生列表
```http
GET {{baseUrl}}/students?page=1&pageSize=10
Headers:
  token: {{token}}
  Content-Type: application/json
```

#### 添加学生
```http
POST {{baseUrl}}/students
Headers:
  token: {{token}}
  Content-Type: application/json

{
  "name": "王五",
  "gender": "男",
  "phone": "13800138000",
  "clazzId": 1
}
```

### 3.4 班级管理接口

#### 查询班级列表
```http
GET {{baseUrl}}/clazzs?page=1&pageSize=10
Headers:
  token: {{token}}
  Content-Type: application/json
```

### 3.5 日志管理接口

#### 查询日志列表
```http
GET {{baseUrl}}/log/page?page=1&pageSize=10
Headers:
  token: {{token}}
  Content-Type: application/json
```

## 4. Apifox测试脚本配置

### 4.1 登录接口测试脚本
```javascript
// 前置脚本
pm.test("登录接口测试", function () {
    pm.response.to.have.status(200);
    pm.response.to.be.json;
    
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('code');
    pm.expect(jsonData).to.have.property('msg');
    pm.expect(jsonData).to.have.property('data');
    
    if (jsonData.code === 1) {
        pm.environment.set("token", jsonData.data.token);
        pm.environment.set("userId", jsonData.data.id);
        pm.environment.set("userName", jsonData.data.name);
    }
});
```

### 4.2 通用测试脚本
```javascript
// 通用响应格式测试
pm.test("响应格式是JSON", function () {
    pm.response.to.be.json;
});

pm.test("响应状态码是200", function () {
    pm.response.to.have.status(200);
});

pm.test("响应包含必要字段", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('code');
    pm.expect(jsonData).to.have.property('msg');
    pm.expect(jsonData.code).to.be.oneOf([0, 1]);
});
```

## 5. 解决JSON格式问题

### 5.1 检查后端配置
确保以下配置正确：

#### application.yml配置
```yaml
server:
  port: 8080

spring:
  application:
    name: tlias-web-management
  web:
    cors:
      allowed-origins: "http://localhost:5173,http://localhost:5174"
      allowed-methods: "GET,POST,PUT,DELETE,OPTIONS"
      allowed-headers: "*"
      allow-credentials: true
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8
    serialization:
      write-dates-as-timestamps: false
    deserialization:
      fail-on-unknown-properties: false
```

#### WebConfig配置
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### 5.2 检查控制器注解
确保所有控制器都有正确的注解：

```java
@RestController  // 确保使用@RestController而不是@Controller
@RequestMapping("/emps")
public class EmpController {
    
    @GetMapping
    public Result page(EmpQueryParam empQueryParam) {
        // 确保返回Result对象
        return Result.success(pageResult);
    }
}
```

### 5.3 检查Result类
确保Result类能正确序列化：

```java
@Data
public class Result implements Serializable {
    private Integer code;
    private String msg;
    private Object data;
    
    // 确保有正确的构造函数和静态方法
    public static Result success() {
        Result result = new Result();
        result.code = 1;
        result.msg = "success";
        return result;
    }
}
```

## 6. 常见问题解决

### 6.1 返回HTML而不是JSON
**原因**: 使用了`@Controller`而不是`@RestController`
**解决**: 确保使用`@RestController`注解

### 6.2 跨域问题
**原因**: CORS配置不正确
**解决**: 检查CORS配置，确保允许Apifox的请求

### 6.3 认证问题
**原因**: 缺少token或token无效
**解决**: 确保在请求头中正确传递token

### 6.4 数据库连接问题
**原因**: 数据库配置错误或数据库未启动
**解决**: 检查数据库配置和连接

## 7. 测试流程

### 7.1 基础连通性测试
1. 启动后端服务
2. 在Apifox中测试登录接口
3. 验证返回JSON格式

### 7.2 功能测试
1. 测试员工管理CRUD操作
2. 测试学生管理CRUD操作
3. 测试班级管理CRUD操作
4. 测试日志查询功能

### 7.3 日志记录测试
1. 执行各种操作
2. 查询日志列表
3. 验证日志记录是否完整

## 8. 调试技巧

### 8.1 查看后端日志
```bash
# 查看控制台输出
# 关注以下日志：
# - 请求接收日志
# - SQL执行日志
# - 异常日志
```

### 8.2 使用浏览器测试
```bash
# 直接在浏览器中访问
http://localhost:8080/emps?page=1&pageSize=10
```

### 8.3 使用curl测试
```bash
curl -X GET "http://localhost:8080/emps?page=1&pageSize=10" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json"
```

## 9. 预期结果

### 9.1 成功响应格式
```json
{
  "code": 1,
  "msg": "success",
  "data": {
    "total": 100,
    "rows": [...]
  }
}
```

### 9.2 错误响应格式
```json
{
  "code": 0,
  "msg": "错误信息",
  "data": null
}
```

通过以上配置，你的Apifox应该能够正确接收和解析JSON格式的响应数据。
