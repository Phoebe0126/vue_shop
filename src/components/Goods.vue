<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsInfo"
            @change="getGoodsInfo"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsInfo"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="6"
          ><el-button type="primary" @click="goAddPage">添加商品</el-button></el-col
        >
      </el-row>
      <!-- 表格主体区域 -->
      <el-table :data="goodsInfo" border stripe>
        <el-table-column type="index" label="#" >
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="400px"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
           </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteGoods(scope.row)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- 页码显示区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[100, 200, 500, 700]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
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
        pagenum: 1, // 当前页码
        pagesize: 30 // 每页显示条数
      },
      // 总共的商品条数
      total: 0,
      // 商品列表数组
      goodsInfo: []
    }
  },
  created () {
    this.getGoodsInfo()
  },
  methods: {
    // 获取商品列表数据
    async getGoodsInfo () {
      const { data: res } = await this.$http.get('/goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsInfo = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsInfo()
    },
    handleCurrentChange (currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getGoodsInfo()
    },
    // 删除商品
    async deleteGoods (row) {
      const confirmText = await this.$confirm(
        '此操作将永久删除该项商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmText !== 'confirm') {
        return this.$message.error('您已点击取消~')
      }
      const { data: res } = await this.$http.delete('goods/' + row.goods_id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功啦~')
      this.getGoodsInfo()
    },
    // 转向添加商品页面
    goAddPage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less"></style>
