<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Document } from '@element-plus/icons-vue'
import { queryPageApi, clearAllLogsApi } from '@/api/log'

//列表展示数据
let tableData = ref([])
//加载状态
let loading = ref(false)

//钩子函数 - 页面加载时触发
onMounted(() => {
  queryPage()
})

//分页组件
const pagination = ref({currentPage: 1, pageSize: 15, total: 0})
//每页展示记录数发生变化时触发
const handleSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize
  queryPage()
}
//当前页码发生变化时触发
const handleCurrentChange = (page) => {
  pagination.value.currentPage = page
  queryPage()
}

//分页条件查询
const queryPage = async () => {
  loading.value = true
  try {
    const result = await queryPageApi(pagination.value.currentPage,pagination.value.pageSize);
    if(result.code) {
      tableData.value = result.data.rows
      pagination.value.total = result.data.total
    }
  } finally {
    loading.value = false
  }
}

//清空所有日志
const clearAllLogs = async () => {
  try {
    await ElMessageBox.confirm(
      `此操作将永久删除所有操作日志（共${pagination.value.total}条），是否继续？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    loading.value = true
    const result = await clearAllLogsApi()
    if(result.code) {
      ElMessage.success('所有操作日志已清空')
      // 清空后重新查询第一页
      pagination.value.currentPage = 1
      queryPage()
    } else {
      ElMessage.error(result.msg || '清空日志失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清空日志失败')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>

    <!-- 顶部标题和操作按钮 -->
    <div>
      <div class="header-actions">
        <div id="title">日志管理</div>
        <div class="clear-button">
          <el-button 
            type="danger" 
            :icon="Delete" 
            @click="clearAllLogs"
            :disabled="pagination.total === 0"
            size="small"
          >
            清空所有日志
          </el-button>
        </div>
      </div>
      <br>
    </div>
    
    <!-- 列表展示 -->
    <el-table :data="tableData" border style="width: 100%" fit size="small" v-loading="loading">
      <el-table-column prop="operateEmpName" label="操作人" align="center" width="80px"/>
      <el-table-column prop="operateTime" label="操作时间" align="center" width="150px"/>
      <el-table-column prop="className" label="类名" align="center" width="300px" />
      <el-table-column prop="methodName" label="方法名" align="center" width="100px" />
      <el-table-column prop="costTime"  label="操作耗时(ms)" align="center" width="100px"/>
      <el-table-column prop="methodParams" label="请求参数" align="center" width="280px">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto" popper-style="font-size:12px">
            <template #default>
              <div>参数: {{ scope.row.methodParams }}</div>
            </template>
            <template #reference>
              <el-tag v-if="scope.row.methodParams.length <= 30">{{ scope.row.methodParams}}</el-tag>
              <el-tag v-else>{{ scope.row.methodParams.substring(0,30) + '...' }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="returnValue"  label="返回值" align="center"></el-table-column>
      <template #empty>
        <div style="padding: 20px; text-align: center; color: #999;">
          <el-icon size="48"><Document /></el-icon>
          <p>暂无操作日志</p>
        </div>
      </template>
    </el-table>
    <br>
    
    <!-- 分页组件Pagination -->
    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
</template>


<style scoped>
#title {
  font-size: 20px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.clear-button {
  margin-left: auto;
}
</style>