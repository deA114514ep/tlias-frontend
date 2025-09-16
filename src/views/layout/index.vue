<script setup>
import {ref,onMounted} from 'vue'
import { ElMessage,ElMessageBox } from "element-plus";
import {useRouter} from 'vue-router'
import { EditPen, SwitchButton, Promotion, Menu, HomeFilled, UserFilled, Tools, HelpFilled, Avatar, Histogram, InfoFilled, Share, Document } from '@element-plus/icons-vue'
// 当前登录员工
const loginName = ref('');
// 定义钩子函数
onMounted(()=>{
  // 获取当前登录用户名
  const loginUser = JSON.parse(localStorage.getItem('loginUser'));
  if(loginUser&&loginUser.name){
    loginName.value = loginUser.name;
  }

})

// 定义路由实例
const router = useRouter();

// 修改密码
const changePassword = () => {
  router.push('/changePassword');
}

// 退出登录
const logout = () =>{
// 弹框提示用户是否删除
   ElMessageBox.confirm('您确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async() => { // 确认
   ElMessage.success('已退出登录');
   localStorage.removeItem('loginUser');
   router.push('/login');
   
  }).catch(() => { // 取消
    ElMessage.info('已取消退出');
  });
 
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">Tlias智能学习辅助系统</span>
        <span class="right_tool">
          <a href="javascript:;" @click="changePassword">
            <el-icon>
              <EditPen />
            </el-icon> 修改密码 &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
          </a>
          <a href="javascript:;" @click="logout">
            <el-icon>
              <SwitchButton />
            </el-icon> 退出登录【{{loginName}}】
          </a>
        </span>
      </el-header>

      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="aside">

          <!-- 添加左侧侧边栏 -->
          <el-menu router>

            <!-- 首页菜单 -->
             <el-menu-item index="/index">
              <el-icon><Promotion></Promotion></el-icon>首页
            </el-menu-item>

            <!-- 一级菜单 学员管理-->
            <el-sub-menu index="/manage">
              <template #title>
                <!-- 这里导入了图标组件在文档里有 -->
                <el-icon><Menu /></el-icon>班级学员管理
              </template>
              <el-menu-item index="/clazz"><el-icon><HomeFilled /></el-icon>班级管理</el-menu-item>
              <el-menu-item index="/stu"><el-icon><UserFilled /></el-icon>学员管理</el-menu-item>
            </el-sub-menu>

            <!-- 二级菜单 系统信息管理 -->
            <el-sub-menu index="/system">
              <template #title>
                <!-- 这里导入了图标组件在文档里有 -->
                <el-icon><Tools /></el-icon>系统信息管理
              </template>
              <el-menu-item index="/dept"><el-icon><HelpFilled /></el-icon>部门管理</el-menu-item>
              <el-menu-item index="/emp"><el-icon><Avatar /></el-icon>员工管理</el-menu-item>
            </el-sub-menu>

            <!-- 三级菜单 数据统计管理 -->
            <el-sub-menu index="/report">
              <template #title>
                <!-- 这里导入了图标组件在文档里有 -->
                <el-icon><Histogram /></el-icon>数据统计管理
              </template>
              <el-menu-item index="/empReport"><el-icon><InfoFilled /></el-icon>员工信息统计</el-menu-item>
              <el-menu-item index="/stuReport"><el-icon><Share /></el-icon>学员信息统计</el-menu-item>
              <el-menu-item index="/log"><el-icon><Document /></el-icon>日志信息统计</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>


        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.header {
  background-image: linear-gradient(to right, #00547d, #007fa4, #00aaa0, #00d072, #a8eb12);
}

.title {
  color: white;
  font-size: 40px;
  font-family: 楷体;
  line-height: 60px;
  font-weight: bolder;
}

.right_tool {
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
}

.aside {
  width: 220px;
  border-right: 1px solid #ccc;
  height: 730px;
}
</style>
