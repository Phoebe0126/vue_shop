<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限表格 -->
    <el-card class="box-card">
      <el-table :data="rightsList" stripe border style="width: 100%">
        <el-table-column type="index" label="#" align="center"> </el-table-column>
        <el-table-column prop="authName" label="名称" align="center"> </el-table-column>
        <el-table-column prop="path" label="路径" align="center"> </el-table-column>
        <el-table-column prop="level" label="等级" align="center">
         <template slot-scope="scope">
            <el-tag  effect="dark" v-if="scope.row.level == 0">
            等级1
          </el-tag>
          <el-tag type="success" effect="dark" v-else-if="scope.row.level == 1">
            等级2
          </el-tag>
          <el-tag type="danger" effect="dark" v-else>
            等级3
          </el-tag>
         </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      this.rightsList = res.data
    }
  },

  created () {
    this.getRightsList()
  }
}
</script>
<style scoped></style>
