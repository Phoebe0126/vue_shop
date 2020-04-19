<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 提示信息 -->
      <el-alert title="添加商品信息" type="info" show-icon center> </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 添加商品的表单内容 -->
      <el-form
        :model="addGoodsInfo"
        :rules="addGoodsRules"
        ref="goodsFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeChangeTab"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addGoodsInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addGoodsInfo.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addGoodsInfo.goods_number"></el-input>
            </el-form-item>
            <el-form-item>
              <!-- 选择商品分类区域 -->
              <el-row class="row-choose">
                <el-col>
                  <span>商品分类：</span>
                  <el-cascader
                    :options="catelist"
                    :props="cateProps"
                    v-model="selectedKeys"
                    @change="handleChangeCate"
                  >
                  </el-cascader>
                </el-col>
              </el-row>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyParamsList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 显示动态属性的值 -->
              <el-checkbox
                v-for="(param, index) in item.attr_vals"
                :key="index"
                checked
                :label="param"
                border
              ></el-checkbox>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              :key="index"
              v-for="(item, index) in onlyParamsList"
            >
              <el-input v-model="item.attr_vals" disabled></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="fileReqPath"
              :on-preview="handlePreview"
              :file-list="picsList"
              list-type="picture"
              :headers="headerObj"
              :on-success="uploadSuccess"
              :on-remove="removePic"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                点击符合商品的图片进行上传吧~
              </div>
            </el-upload>
            <!-- 显示图片的对话框 -->
            <el-dialog
              title="图片预览"
              :visible.sync="imgDialogVisible"
              width="50%"
            >
              <img :src="imgPreviewSrc" alt="图片预览" class="imgPreview" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addGoodsInfo.goods_introduce"
            />
            <el-button type="primary" class="addBtn" @click="submitGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '0',
      // 商品表格
      addGoodsInfo: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        attrs: [],
        pics: [],
        goods_introduce: '',
        goods_cat: ''
      },
      // 商品信息验证规则
      addGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { type: 'number', message: '价格必须为数字值' },
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { type: 'number', message: '价格必须为数字值' },
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { type: 'number', message: '重量必须为数字值' },
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      // 商品分类选择数据
      catelist: [],
      // 设置级联选择器相关显示
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectedKeys: [],
      // 获取的动态参数数组
      manyParamsList: [],
      // 静态属性数组
      onlyParamsList: [],
      // 请求图片路径
      fileReqPath: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传的图片列表
      picsList: [],
      // 图片上传的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 是否显示图片预览对话框
      imgDialogVisible: false,
      // 预览图片的url
      imgPreviewSrc: ''
    }
  },
  computed: {
    // 当前选择的id
    cateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[this.selectedKeys.length - 1]
      }
      return null
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('/categories')
      if (res.meta.status !== 200) {
        return this.$http.error('获取分类失败')
      }
      this.catelist = res.data
    },
    handleChangeCate () {
      // 不是三级分类不给选
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
      }
    },
    // 如果没有选择分类则不能跳转
    beforeChangeTab (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.selectedKeys.length === 0) {
        this.$message.error('请选择分类')
        return false
      }
      // 参数列表tab
      if (activeName === '1') {
        // 跳转到参数选择则需要获取参数列表
        this.getParamsList()
      }
      // 商品静态属性tab
      if (activeName === '2') {
        this.getOnlyParamsList()
      }
    },
    async getParamsList () {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: 'many'
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.manyParamsList = res.data
      // 将参数字符串处理为数组
      this.manyParamsList.forEach(value => {
        value.attr_vals = value.attr_vals ? value.attr_vals.split(',') : []
      })
    },
    async getOnlyParamsList () {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: 'only'
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取属性失败')
      }
      this.onlyParamsList = res.data
      // console.log(this.onlyParamsList)
    },
    // 点击图片列表中已上传的文件
    handlePreview (file) {
      this.imgPreviewSrc = file.response.data.url
      this.imgDialogVisible = true
    },
    // 图片上传成功
    uploadSuccess (response) {
      // console.log(response)
      // 创建一个图片对象
      const picObj = {
        pic: response.data.tmp_path
      }
      // 增加到pics数组中
      this.addGoodsInfo.pics.push(picObj)
      // console.log(this.addGoodsInfo.pics)
    },
    // 移除图片信息
    removePic (file) {
      const filePath = file.response.data.tmp_path
      const index = this.addGoodsInfo.pics.findIndex(value => {
        return filePath === value
      })
      this.addGoodsInfo.pics.splice(index, 1)
    },
    // 添加商品
    submitGoods () {
      // 验证表单填写规则
      this.$refs.goodsFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('商品信息没有填写完整哦~')
        }
        // 处理goods_cat字符串
        this.addGoodsInfo.goods_cat = this.selectedKeys.join(',')
        // 处理attrs数组
        // 添加动态参数对象
        // console.log(this.manyParamsList)
        this.manyParamsList.forEach(item => {
          const infoObj = {
            attr_id: item.attr_id,
            attr_value: item.attr_name
          }
          this.addGoodsInfo.attrs.push(infoObj)
        })
        // 处理静态参数
        this.onlyParamsList.forEach(item => {
          const infoObj = {
            attr_id: item.attr_id,
            attr_value: item.attr_name
          }
          this.addGoodsInfo.attrs.push(infoObj)
        })
        // console.log(this.addGoodsInfo)
        // 添加商品
        const { data: res } = await this.$http.post('/goods', this.addGoodsInfo)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功！')
        this.$router.push('/goods')
      })
    }
  }
}
</script>
<style lang="less">
.el-checkbox {
  margin: 0 5px 5px 0 !important;
}
.imgPreview {
  width: 100%;
}
.addBtn {
  margin-top: 15px !important;
}
.ql-editor {
  min-height: 300px;
}
</style>
