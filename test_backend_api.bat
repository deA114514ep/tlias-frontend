@echo off
echo ========================================
echo Tlias后端API测试脚本
echo ========================================

echo.
echo 1. 测试后端服务是否启动...
curl -s -o nul -w "HTTP状态码: %%{http_code}\n" http://localhost:8080/emps?page=1^&pageSize=10
if %errorlevel% neq 0 (
    echo 错误: 无法连接到后端服务，请确保后端已启动
    echo 启动命令: cd "C:\Users\30598\Desktop\ctConfig\tlias-web-project\tlias-common\tlias-web" ^&^& java -jar target/tlias-web-0.0.1-SNAPSHOT.jar
    pause
    exit /b 1
)

echo.
echo 2. 测试员工列表API...
curl -X GET "http://localhost:8080/emps?page=1&pageSize=10" -H "Content-Type: application/json" -H "Accept: application/json"

echo.
echo.
echo 3. 测试登录API...
curl -X POST "http://localhost:8080/login" -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"123456\"}"

echo.
echo.
echo 4. 测试日志查询API...
curl -X GET "http://localhost:8080/log/page?page=1&pageSize=10" -H "Content-Type: application/json" -H "Accept: application/json"

echo.
echo.
echo ========================================
echo 测试完成！
echo ========================================
pause
