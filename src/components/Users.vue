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
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="this.getUsersInfo">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="this.getUsersInfo"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="6"><el-button type="primary">添加</el-button></el-col>
      </el-row>
      <!-- 用户表格区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态" >
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
          <el-button size="mini" icon="el-icon-edit" type="primary"></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
          ></el-button>
          <el-tooltip content="设置" placement="top" :enterable="false">
            <el-button size="mini" type="warning" icon="el-icon-setting">
            </el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <!-- 页码显示区域 -->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 7]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页数
        pagesize: 2 // 每页显示条数
      },
      userList: null,
      total: 0
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
      const { data: res } = await this.$http.put(`users/${userscope.id}/state/${userscope.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        userscope.mg_state = !userscope.mg_state
        return this.$message.error('用户状态更改失败！')
      }
      this.$message.success('用户状态更改成功！')
    }
  }
}
</script>

<style lang="less"></style>
