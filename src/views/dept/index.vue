<script setup>
import { ref, onMounted } from "vue";
import { queryAllApi, addApi,queryByIdApi ,updateApi,deleteApi} from "@/api/dept";
import { ElMessage,ElMessageBox } from "element-plus";

// 定义钩子函数，当页面加载完毕就会调用这函数，然后这个函数就会调用serch方法，
// 就会调用链接，将获取的值赋给deptList，然后就在页面显示了
onMounted(() => { //生命周期
  search();
});
// 查询部门列表
const search = async () => {
  // 注释掉旧代码  
  //  const result = await axios.get("https://m1.apifoxmock.com/m1/6421010-6118327-default/depts");
  //  // 如果code为1就显示数据，否则提示错误信息
  //  if(result.data.code == 1) { //布尔类型
  //    deptList.value = result.data.data;
  //  } else {
  //    this.$message.error(result.data.message);
  //  }

  const result = await queryAllApi();
  deptList.value = result.data;

};

//定义响应式数据
const deptList = ref([]);


// Dialog对话框组件
const dialogFormVisible = ref(false);
// 部门名称
const dept = ref({ name: '' });
// 动态表单标题，当新增时候标题为新增部门，否则为修改部门
const fromTitle = ref('');
// 保存按钮
const save = async () => {
  // 进行表单校验
  if (!deptFormRef.value) { return }
  deptFormRef.value.validate(async(valid) => { // valid表示是否通过校验
    if (valid) {
      // 发送请求，保存数据-调用接口，并且将部门数据传入给api接口，然后api在将数据使用post传入后端
      // await 是 await 是一个关键字，用来等待一个 Promise 对象。当发送请求的时候，await 会等待接口返回数据，然后返回数据
      // 否则会直接执行完毕用户看不到交互结果
      
      let result;// const不允许修改
      // 添加保存与修改的校验，如果id存在，那么就是修改，否则就是新增
      if (dept.value.id){ // 修改
       result= await updateApi(dept.value);

      }else{ // 新增
       result = await addApi(dept.value);

      }
      // 做一个判断，如果返回的数据是成功，那么就提示用户，并且将表单清空
      if (result.code) {
        ElMessage.success("添加成功");

        // 关闭对话框
        dialogFormVisible.value = false;

        // 查询最新数据
        search();
      } else {
        ElMessage.error(result.msg);
      }
    }else {
      ElMessage.error("表单校验未通过");
    }

  });

};

// 部门新增按钮
const addDept = () => {
  // 先将表单显示出来
  dialogFormVisible.value = true;
  // 然后将表单标题设置为新增部门
  fromTitle.value = '新增部门';
  // 重置表单
  dept.value = { name: '' };

  //  清空表单校验
  if(deptFormRef.value){
    deptFormRef.value.resetFields();
  }

};


// 表单校验相关
const rules = ref({
  name: [
    // required: true部门名称必填，trigger: "blur" 表示失去焦点时触发校验
    { required: true, message: "请输入部门名称", trigger: "blur" },
    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
  ],
});


// 定义响应式对象-用于校验表单数据（不通过不能提交）
const deptFormRef = ref();

// 查询操作-接收部门id
const edit = async (id)=>{
  // 这样就调用了api中的根据id查询部门信息的接口
  const result = await queryByIdApi(id);
  if(result.code){
    // 展示对话框
    dialogFormVisible.value = true;
    // 设置表单标题为编辑部门
    fromTitle.value = '编辑部门';
    // 将部门数据设置给dept对象（将数据回显到表单输入框中）
    dept.value = result.data;
    // 重置表单校验
    if(deptFormRef.value){
      deptFormRef.value.resetFields();
    }
  }
}

// 删除操作
const delById = async (id)=>{
  // 弹框提示用户是否删除
  const result = await ElMessageBox.confirm('此操作将永久删除该部门, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async() => { // 确认
    // 删除
    const result = await deleteApi(id);
   // 如果删除成功，就提示用户删除成功，并且将dept
   if(result.code){ //如果删除成功给出信息，并且刷新页面
    ElMessage.success('删除成功');
    search();
   }else{//删除失败给出信息
    ElMessage.error(result.msg);
   }
   
  }).catch(() => { // 取消
    ElMessage.info('已取消删除');
  });
}

</script>

<template>
  <h1>部门管理</h1>
  <div class="container">
    <!-- 绑定点击事件，点击按钮，dialogFormVisible被设置为true，即打开对话框 -->
    <el-button type="primary" @click="addDept">+新增部门</el-button>
  </div>

  <!-- 表格区域 -->
  <div class="container">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center" />
      <el-table-column prop="name" label="部门名称" width="260" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="300" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope" >
          <el-button type="primary" size="small" @click="edit(scope.row.id)">
            <el-icon>
              <Edit />
            </el-icon>编辑
          </el-button>
          <el-button type="danger" size="small" @click="delById(scope.row.id)">
            <el-icon>
              <Delete />
            </el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>


  <!-- Dialog对话框组件 -->
  <!-- 为了让修改部门也可以复用这个Dialog，所以要将标题动态绑定，所以要使用插槽,注意这里需要加：插槽的标签是title，所以这里要写title，而不是fromTitle -->
  <el-dialog v-model="dialogFormVisible" :title="fromTitle" width="500">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <!-- ref="deptFormRef"通过这个响应式对象我们就能引用到表单数据了 -->
      <el-form-item label="部门名称" :label-width="80" prop="name" >
        <el-input v-model="dept.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <!--@click="dialogFormVisible = false"是当点击按钮被点击的时候，dialogFormVisible被设置为false，即关闭对话框  -->
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <!-- @click="save"是当点击按钮被点击的时候，调用save方法，即保存数据 -->
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>


</template>

<style scoped>
.container {
  /* 距离上下10px 左右0px */
  margin: 20px 0px;
}
</style>
