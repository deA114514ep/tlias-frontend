<template>
  <div class="change-password-container">
    <el-card class="password-card">
      <template #header>
        <div class="card-header">
          <el-icon><EditPen /></el-icon>
          <span>修改密码</span>
        </div>
      </template>
      
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="120px"
        class="password-form"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">
            修改密码
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { EditPen } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const passwordFormRef = ref()

// 密码表单数据
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码验证规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度必须在6-20个字符之间', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,20}$/, message: '密码必须包含字母和数字，长度6-20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 提交表单
const submitForm = () => {
  if (!passwordFormRef.value) return
  
  passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        
        // 获取当前登录用户信息
        const loginUser = JSON.parse(localStorage.getItem('loginUser'))
        if (!loginUser || !loginUser.id) {
          ElMessage.error('请先登录')
          router.push('/login')
          return
        }
        
        // 调用修改密码接口
        const response = await axios.post('/api/change-password', {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        }, {
          headers: {
            'token': loginUser.token
          }
        })
        
        if (response.data.code === 1) {
          ElMessage.success('密码修改成功')
          resetForm()
          
          // 询问是否重新登录
          ElMessageBox.confirm('密码修改成功，是否重新登录？', '提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '稍后登录',
            type: 'success'
          }).then(() => {
            localStorage.removeItem('loginUser')
            router.push('/login')
          }).catch(() => {
            // 用户选择稍后登录，不做任何操作
          })
        } else {
          ElMessage.error(response.data.msg || '密码修改失败')
        }
      } catch (error) {
        console.error('修改密码失败:', error)
        if (error.response && error.response.data && error.response.data.msg) {
          ElMessage.error(error.response.data.msg)
        } else {
          ElMessage.error('密码修改失败，请稍后重试')
        }
      } finally {
        loading.value = false
      }
    } else {
      ElMessage.error('表单验证失败')
    }
  })
}

// 重置表单
const resetForm = () => {
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}
</script>

<style scoped>
.change-password-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.password-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.card-header .el-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #409eff;
}

.password-form {
  padding: 20px 0;
}

.el-form-item {
  margin-bottom: 24px;
}

.el-button {
  margin-right: 12px;
}
</style>
