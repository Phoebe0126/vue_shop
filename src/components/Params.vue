<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片主体内容区域 -->
    <el-card class="box-card">
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      ></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="row-choose">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            :options="catelist"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChangeCate"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tabs分页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addNewManyParams"
            >添加参数</el-button
          >
          <!-- 动态参数表格区域 -->
          <el-table
            :data="manyParamsList"
            border
            ref="manyTableRef"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            @expand-change="toggleRowExpansion"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row>
                  <el-tag
                    closable
                    @close="handleCloseTag(item, scope.row)"
                    v-for="(item, index) of scope.row.attr_vals
                      ? scope.row.attr_vals.split(',')
                      : []"
                    :key="index"
                    >{{ item }}</el-tag
                  >
                  <!-- 添加tag输入框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="newTagInputVisible"
                    v-model="newTagInputValue"
                    size="small"
                    ref="saveInputTagRef"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    class="button-new-tag"
                    size="small"
                    v-else
                    @click="showNewTagInupt"
                    >+ New Tag</el-button
                  >
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-edit"
                  @click="editManyParams(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  @click="deleteManyParam(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性栏 -->
        <el-tab-pane label="静态参数" name="only">
          <el-table :data="onlyParamsList" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row>
                  <el-tag
                    v-for="(item, index) of scope.row.attr_vals
                      ? scope.row.attr_vals.split(',')
                      : []"
                    :key="index"
                    >{{ item }}</el-tag
                  >
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="small" icon="el-icon-edit"
                >修改</el-button
              >
              <el-button type="danger" size="small" icon="el-icon-delete"
                >删除</el-button
              >
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加动态参数对话框 -->
      <el-dialog
        title="添加参数"
        :visible.sync="addNewManyParamsDialogVisible"
        width="50%"
        @close="resetManyDialog"
      >
        <el-form
          label-width="100px"
          :rules="addParamsFormRules"
          :model="manyParams"
          ref="manyParamsRef"
        >
          <el-form-item label="参数名称：" prop="manyValue">
            <el-input v-model="manyParams.manyValue"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetManyDialog">取 消</el-button>
          <el-button type="primary" @click="submitNewMany">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改动态参数对话框 -->
      <el-dialog
        title="修改参数"
        :visible.sync="editNewManyParamsDialogVisible"
        width="50%"
        @close="resetEditManyDialog"
      >
        <el-form
          label-width="100px"
          :rules="addParamsFormRules"
          :model="manyParams"
          ref="editManyParamsRef"
        >
          <el-form-item label="参数名称：" prop="manyValue">
            <el-input v-model="manyParams.manyValue"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetEditManyDialog">取 消</el-button>
          <el-button type="primary" @click="submitEditMany">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chosenGoods: '',
      // 获取到的参数列表
      catelist: [],
      // 设置级联选择器相关显示
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选择的3级商品分类
      selectedCateKeys: [],
      // tabs默认显示哪一个
      activeName: 'many',
      // 动态参数列表
      manyParamsList: [],
      // 静态参数列表
      onlyParamsList: [],
      // 参数内容
      attValue: [],
      // 控制是否显示new tag输入框
      addNewTagInputVisible: false,
      // 是否显示添加参数对话框
      addNewManyParamsDialogVisible: false,
      // 添加验证规则
      addParamsFormRules: {
        manyValue: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      //   要添加的动态参数值
      manyParams: {
        manyValue: ''
      },
      // 是否显示修改动态对话框
      editNewManyParamsDialogVisible: false,
      // 当前选择参数的id
      paramsId: '',
      // 是否显示new tag
      newTagInputVisible: false,
      // new tag的值
      newTagInputValue: '',
      // 展开的行数组
      expands: []
    }
  },
  created () {
    this.getCategoryList()
  },
  computed: {
    // 设置添加参数按钮是否禁用
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选择的id
    cateId () {
      return this.selectedCateKeys[this.selectedCateKeys.length - 1]
    }
  },
  methods: {
    // 获取参数列表
    async getCategoryList () {
      const { data: res } = await this.$http.get('categories?type=3')
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      this.catelist = res.data
    },
    // 监听选项卡变化
    handleClick (tab) {
      this.getParamsList()
    },
    // 获取对应分类的参赛列表
    handleChangeCate () {
      // 判断是否为三级分类
      if (this.selectedCateKeys.length !== 3) {
        return
      }
      this.getParamsList()
    },
    async getParamsList () {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      if (this.activeName === 'many') {
        this.manyParamsList = res.data
      } else {
        this.onlyParamsList = res.data
      }
    },
    // 添加新的参数
    addNewManyParams () {
      this.addNewManyParamsDialogVisible = true
    },
    // 提交新的参数到后台
    submitNewMany () {
      // 简单验证 如果为空则取消提交
      this.$refs.manyParamsRef.validate(async valid => {
        if (!valid) return
        console.log(this.manyParams.manyValue)
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.manyParams.manyValue,
            attr_sel: 'many'
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('oops 添加分类失败了')
        }
        this.getParamsList()
        this.$message.success('添加分类成功!')
        this.addNewManyParamsDialogVisible = false
      })
    },
    // 关闭对话框按钮
    resetManyDialog () {
      this.$refs.manyParamsRef.resetFields()
      this.addNewManyParamsDialogVisible = false
    },
    // 显示修改动态参数对话框
    editManyParams (attr) {
      this.paramsId = attr.attr_id
      this.manyParams.manyValue = attr.attr_name
      this.editNewManyParamsDialogVisible = true
    },
    // 提交修改之后的动态参数名称
    submitEditMany () {
      // categories/:id/attributes/:attrId
      this.$refs.editManyParamsRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.paramsId}`,
          {
            attr_name: this.manyParams.manyValue,
            attr_sel: 'many'
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getParamsList()
        this.editNewManyParamsDialogVisible = false
      })
    },
    // 关闭修改动态参数对话框按钮
    resetEditManyDialog () {
      this.$refs.editManyParamsRef.resetFields()
      this.manyParams.manyValue = ''
      this.editNewManyParamsDialogVisible = false
    },
    // 删除动态参数属性
    async deleteManyParam (attr) {
      console.log(attr)
      const confirmText = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmText === 'confirm') {
        const { data: res } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${attr.attr_id}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        return this.getParamsList()
      }
    },
    // 显示new tag输入框
    showNewTagInupt () {
      this.newTagInputVisible = true
      // 自动聚焦
      this.$nextTick(_ => {
        this.$refs.saveInputTagRef.$refs.input.focus()
      })
    },
    // 删除tag
    async handleCloseTag (tag, row) {
      const arr = row.attr_vals.split(',')
      arr.splice(arr.indexOf(tag), 1)
      const attrValue = arr.join(',')
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: 'many',
          attr_vals: attrValue
        })
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getParamsList()
    },
    // 修改tag 删除或新增
    async handleInputConfirm (row) {
      if (!this.newTagInputValue) {
        this.newTagInputVisible = false
        return
      }
      const attrValue = row.attr_vals ? row.attr_vals + ',' + this.newTagInputValue : this.newTagInputValue
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: 'many',
          attr_vals: attrValue
        })
      if (res.meta.status !== 200) {
        return this.$message.error('添加失败')
      }
      this.$message.success('添加成功')
      this.getParamsList()
      this.newTagInputVisible = false
      this.newTagInputValue = ''
    },
    // 获取行的row key
    getRowKeys (row) {
      return row.attr_id
    },
    // 切换展开行
    toggleRowExpansion (row) {
      // 切换同一个展开行，不用清空
      if (row.attr_id === this.expands.shift() && this.expands.length === 0) {
        return
      }
      // 先清空所有展开行row key
      this.expands = []
      // 添加当前行的row 作为展开行
      this.expands.push(row.attr_id)
    }
  }
}
</script>

<style lang="less">
.row-choose {
  margin-top: 15px;
}
</style>
