import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/index/index.vue'
import clazzView from '@/views/clazz/index.vue'
import DeptView from '@/views/dept/index.vue'
import EmpView from '@/views/emp/index.vue'
import LogView from '@/views/log/index.vue'
import stuView from '@/views/stu/index.vue'
import EmpReportView from '@/views/report/emp/index.vue'
import stuReportView from '@/views/report/stu/index.vue'
import LayoutView from '@/views/layout/index.vue'
import LoginView from '@/views/login/index.vue'
import ChangePasswordView from '@/views/changePassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {path:'/',
     name:'',
     component: LayoutView,
     redirect:'/index',
     children:[
      {path:'index',name:'index',component:IndexView},
      {path:'clazz',name:'clazz',component:clazzView},
      {path:'dept',name:'dept',component:DeptView},
      {path:'emp',name:'emp',component:EmpView},
      {path:'log',name:'log',component:LogView},
      {path:'stu',name:'stu',component:stuView},
      {path:'stuReport',name:'stuReport',component:stuReportView},
      {path:'empReport',name:'empReport',component:EmpReportView},
      {path:'changePassword',name:'changePassword',component:ChangePasswordView}
     ]
    },
    { path: '/login', name: 'login', component: LoginView }
  ]
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 获取localStorage中的登录信息
  const loginUser = JSON.parse(localStorage.getItem('loginUser') || 'null');
  
  // 如果访问登录页面，直接放行
  if (to.path === '/login') {
    next();
    return;
  }
  
  // 如果没有登录信息，跳转到登录页
  if (!loginUser || !loginUser.token) {
    next('/login');
    return;
  }
  
  // 有登录信息，放行
  next();
});

export default router