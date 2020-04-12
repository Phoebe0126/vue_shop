<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-button type="primary">添加角色</el-button>、
      <!-- 表格主体内容区域 -->
      <el-table :data="roleList" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 每一行表示一个管理项目 -->
            <el-row
              :class="[
                'borBottom',
                index !== 0 ? '' : 'borTop',
                'content-center'
              ]"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
              @close="removeRightById(scope.row, item.id)"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable>{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级列表渲染 -->
              <el-col :span="19">
                <el-row
                  v-for="item2 of item.children"
                  :key="item2.id"
                  :class="['content-center']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级列表渲染 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px" align="center" fit="false">
          <template slot-scope="scopeTop">
            <el-button size="mini" icon="el-icon-edit" type="primary"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRole(scopeTop.row.id)"
              >删除</el-button
            >
            <el-tooltip content="设置" placement="top" :enterable="false">
              <el-button
              @click="editRightsForRole(scopeTop.row, defaultCheckRights)"
              size="mini" type="warning" icon="el-icon-setting"
                >分配权限
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限的对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="rightsDialogVisible"
        width="50%"
      >
        <el-tree :data="rightsData" :props="defaultRightsProps" show-checkbox
                 ref="treeRef"
                 node-key="id" default-expand-all :default-checked-keys="defaultCheckRights"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRights"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 存储角色信息的数组
      roleList: [],
      // 决定是否出现分配权限对话框
      rightsDialogVisible: false,
      // 树形控件的数据
      rightsData: [],
      // 树形控件显示的权限
      defaultRightsProps: {
        label: 'authName',
        children: 'children'
      },
      // 设置默认展开的权限数组
      defaultCheckRights: [],
      // 当前被选择的角色
      roleId: ''
    }
  },
  methods: {
    async getRolelist () {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败')
      } else {
        this.roleList = res.data
        console.log(this.roleList)
      }
    },
    // 删除当前角色指定权限的函数
    async removeRightById (data, id) {
      const { data: res } = await this.$http.delete(
        `roles/${data.id}/rights/${id}`
      )
      // 删除失败
      if (res.meta.status !== 200) {
        this.$message.error('删除权限失败')
      } else {
        this.$message.success('删除权限成功!')
        this.getRolelist()
      }
    },
    async deleteRole (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
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
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('删除角色失败')
      } else {
        this.$message.success('删除角色成功')
        this.getRolelist()
      }
    },
    // 分配权限
    async editRightsForRole (node, arr) {
      // 为了点击确认时确定是哪位角色
      this.roleId = node.id
      this.rightsDialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status === 200) {
        this.rightsData = res.data
        this.getLeafKeys(node, arr)
      } else {
        this.$message.error('获取权限列表失败!')
      }
    },
    // 获取该角色目前拥有的权限数组 利用递归
    getLeafKeys (node, arr) {
      // 往defaultCheckRights里添加id即可实现
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 点击确定时分配权限
    async setRights () {
    // 获取当前被选中的权限id
      const checkId = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ]
      console.log(checkId)
      const idStr = checkId.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })
      if (res.meta.status !== 200) {
        this.$message.error('更新失败！')
      } else {
        this.$message.success('更新权限成功！')
        this.getRolelist()
        this.rightsDialogVisible = false
      }
    }
  },
  created () {
    this.getRolelist()
  }

}
</script>
<style lang="less">
.borTop {
  border-top: 1px solid #eee;
}
.borBottom {
  border-bottom: 1px solid #eee;
}
.content-center {
  display: flex;
  align-items: center;
}
</style>
