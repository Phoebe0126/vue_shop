<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCatefory">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树形表格区域 -->
      <tree-table
        class="tree-table"
        :data="categoryList"
        show-index
        index-text="#"
        :columns="columns"
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        border
      >
        <!-- 是否有效列 -->
        <template slot="isOK" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color:green"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 排序列 -->
        <template slot="sort" slot-scope="scope">
          <el-tag effect="dark" v-if="scope.row.cat_level == 0">
            一级
          </el-tag>
          <el-tag
            type="success"
            effect="dark"
            v-else-if="scope.row.cat_level == 1"
          >
            二级
          </el-tag>
          <el-tag type="danger" effect="dark" v-else>
            三级
          </el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="set" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="editCategory(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteCategory(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 页码显示区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="setCategoryList.pagenum"
        :page-sizes="[1, 2, 5, 7]"
        :page-size="setCategoryList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="resetAddDialogForm">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="一级分类：">
          <el-select v-model="firstValue" placeholder="请选择">
            <el-option
              v-for="item in firstCateList"
              :key="item.cat_id"
              :label="item.cat_name"
              :value="item.cat_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="二级分类：">
          <el-select v-model="secondValue" placeholder="请选择">
            <el-option
              v-for="item in secondCateList"
              :key="item.cat_id"
              :label="item.cat_name"
              :value="item.cat_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetAddDialogForm">取 消</el-button>
        <el-button type="primary" @click="submitAddCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editCategoryForm"
        :rules="addCateFormRules"
        ref="userRuleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCategoryForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取参数数组
      categoryList: [],
      // 设置参数配置
      setCategoryList: {
        type: 3,
        pagenum: 1, // 当前所在的页码
        pagesize: 5 // 每页显示条数
      },
      // 添加分类的内容
      // 编辑分类表格内容
      editCategoryForm: {},
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 添加分类传送的数据体
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 是否显示添加分类对话框
      addDialogVisible: false,
      editDialogVisible: false,
      // 级联选择器选择的id数组
      firstValue: '',
      secondValue: '',
      firstCateList: [],
      secondCateList: [],
      total: 0,
      // 树形表格指定每一列的设置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOK'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'set'
        }
      ]
    }
  },
  created () {
    this.getCategoryList()
  },
  watch: {
    firstValue () {
      this.getChildCategoryById()
    }
  },
  methods: {
    // 获取列表数据列表
    async getCategoryList () {
      let str = '?'
      for (const key in this.setCategoryList) {
        str += key + '=' + this.setCategoryList[key] + '&'
      }
      str = str.substr(0, str.length - 1)
      const { data: res } = await this.$http.get('/categories' + str)
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败！')
      }
      this.categoryList = res.data.result
      // 如果当前分裂列表为空,则跳转到上一页
      if (this.categoryList.length === 0) {
        this.handleCurrentChange(--this.setCategoryList.pagenum)
      }
      this.total = res.data.total
    },
    // 改变每页的记录数
    handleSizeChange (newSize) {
      this.setCategoryList.pagesize = newSize
      this.getCategoryList()
    },
    // 改变当前页码
    handleCurrentChange (newNum) {
      this.setCategoryList.pagenum = newNum
      this.getCategoryList()
    },
    // 添加分类
    addCatefory () {
      // 先获取父级列表
      this.getParentCategoryList()
      this.addDialogVisible = true
    },
    // // 获取父级数据列表
    async getParentCategoryList () {
      // parentCateList
      const { data: res } = await this.$http.get('/categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级数据失败')
      }
      this.firstCateList = res.data
    },
    // 根据id查询分类
    getChildCategoryById () {
      for (let i = 0; i < this.firstCateList.length; i++) {
        // 找到了对应的父节点
        if (this.firstCateList[i].cat_id === this.firstValue) {
          this.secondCateList = this.firstCateList[i].children
        }
      }
    },
    // 提交添加结果
    async submitAddCategory () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        // 如果第一级不为空 说明添加的不为一级
        if (this.firstValue) {
        // 判断是否为二级
          this.addCateForm.cat_level = this.secondValue ? 2 : 1
          this.addCateForm.cat_pid = this.secondValue ? this.secondValue : this.firstValue
        }
        const { data: res } = await this.$http.post('/categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCategoryList()
        this.resetAddDialogForm()
      })
    },
    // 重置添加分类对话框内容
    resetAddDialogForm () {
      this.addDialogVisible = false
      this.firstValue = ''
      this.secondValue = ''
      this.firstCateList = []
      this.secondCateList = []
      this.addCateForm.cat_name = ''
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 编辑分类
    editCategory (category) {
      this.editCategoryForm = category
      this.editDialogVisible = true
    },
    // 提交编辑结果
    async submitEditData () {
      const { data: res } = await this.$http.put(
        '/categories/' + this.editCategoryForm.cat_id,
        {
          cat_name: this.editCategoryForm.cat_name
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('编辑失败')
      }
      this.$message.success('编辑成功')
      this.editDialogVisible = false
    },
    // 删除分类
    async deleteCategory (id) {
      const confirmText = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmText !== 'confirm') {
        return this.$message.info('已取消')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('删除分类失败')
      } else {
        this.$message.success('删除分类成功！')
        this.getCategoryList()
      }
    }
  }
}
</script>
<style lang="less"></style>
