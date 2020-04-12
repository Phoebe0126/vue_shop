<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="this.getUsersInfo"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="this.getUsersInfo"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="6"
          ><el-button type="primary" @click="dialogVisible = true"
            >添加</el-button
          ></el-col
        >
      </el-row>
      <!-- 用户表格区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <!-- 通过scope接收这一行的数据 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#eee"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="editUser(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope)"
            >
            </el-button>
            <el-tooltip content="设置" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="setRoleForUser(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配角色对话框 -->
      <el-dialog title="提示" :visible.sync="roleDialogVisible" width="50%">
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>分配角色： <el-select v-model="role" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select></p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 页码显示区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 7]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑用户区域 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetForm"
    >
      <!-- 添加表单主体内容 -->
      <el-form
        :model="editUserData"
        :rules="addUserRules"
        ref="userRuleForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditUser()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加用户区域 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetForm"
    >
      <!-- 添加表单主体内容 -->
      <el-form
        :model="userRuleForm"
        :rules="addUserRules"
        ref="userRuleForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userRuleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('userRuleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var checkMail = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!reg.test(value)) {
        callback(new Error('邮箱格式不正确'))
      }
    }
    var checkMobile = (rule, value, callback) => {
      const reg = /^1[3|4|5|7|8][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('手机号格式不正确'))
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页数
        pagesize: 2 // 每页显示条数
      },
      userList: null,
      total: 0,
      roleDialogVisible: false,
      // 当前选中的用户
      userInfo: {},
      // 角色列表
      roleList: [],
      // 下拉框当前的值
      role: '',
      dialogVisible: false,
      editUserData: {
        username: '',
        id: '',
        mobile: '',
        email: ''
      },
      editDialogVisible: false,
      userRuleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkMail, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入密码手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUsersInfo()
  },
  methods: {
    async getUsersInfo () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取用户列表失败！')
      } else {
        this.userList = res.data.users
        // 如果当前页数据为空，则获取上一页的数据
        if (this.userList.length === 0) {
          this.handleCurrentChange(--this.queryInfo.pagenum)
        }
        this.total = res.data.total
      }
    },
    // 更改每页的记录数
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersInfo()
    },
    // 更改当前页
    handleCurrentChange (currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getUsersInfo()
    },
    // 监听switch变化，更改状态
    async userStateChange (userscope) {
      // 使用模板字符串
      const { data: res } = await this.$http.put(
        `users/${userscope.id}/state/${userscope.mg_state}`
      )
      if (res.meta.status !== 200) {
        userscope.mg_state = !userscope.mg_state
        return this.$message.error('用户状态更改失败！')
      }
      this.$message.success('用户状态更改成功！')
    },
    // 为用户分配角色
    async setRoleForUser (userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.roleList = res.data
      this.roleDialogVisible = true
    },
    // 确定之后保存用户角色信息
    async saveRoleInfo () {
      const { data: res } = await this.$http.put('users/' + this.userInfo.id + '/role', {
        rid: this.role
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败！')
      }
      this.$message.success('分配角色成功！')
      this.getUsersInfo()
      this.roleDialogVisible = false
    },
    // 重置添加用户对话框内容
    resetForm () {
      this.$refs.userRuleForm.resetFields()
    },
    async submitForm (userRuleForm) {
      const { data: res } = await this.$http.post('users', this.userRuleForm)

      if (res.meta.status !== 201) {
        this.$message.error('添加用户失败！')
      }
      this.$message.success('添加用户成功！')
      // 隐藏添加用户的对话框
      this.dialogVisible = false
      // 重新获取用户列表数据
      this.getUsersInfo()
    },
    async deleteUser (dataRow) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果取消
      if (confirmResult !== 'confirm') {
        return this.$message.info('您已点击取消')
      }
      const { data: res } = await this.$http.delete(`users/${dataRow.row.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      } else {
        this.$message.success('删除成功')
        this.getUsersInfo()
      }
    },
    // 点击打开编辑用户框函数，获取后台数据
    async editUser (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('oops，出错了')
      }
      this.editUserData = res.data
      // 显示编辑框
      this.editDialogVisible = true
    },
    // 确认修改
    async confirmEditUser () {
      const { data: res } = await this.$http.put(
        'users/' + this.editUserData.id,
        this.editUserData)
      if (res.meta.status !== 200) {
        this.$message.error('修改失败！')
      } else {
        this.$message.success('修改成功！')
        this.editDialogVisible = false
        this.getUsersInfo()
      }
    }
  }
}
</script>

<style lang="less"></style>
