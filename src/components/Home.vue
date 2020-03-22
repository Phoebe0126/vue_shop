<template>
  <div class="home-container">
    <el-container class="container">
      <!-- 头部区域 -->
      <el-header>
        <div class="header-left">
          电商后台管理系统
        </div>
        <el-button type="info" @click="exit">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse? '64px' : '200px'">
          <!-- 折叠菜单 -->
          <div class="toggle-button" @click="changeCollapse">|||</div>
          <!-- 菜单 -->
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item of menuList"
              :key="item.id"
            >
              <template slot="title">
                <i :class="iconList[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+ child.path"
                v-for="child of item.children"
                :key="child.id"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  {{ child.authName }}
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体部分 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconList: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-claim',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing'
      },
      isCollapse: false,
      // 被激活的链接
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    // 设置当前高亮的菜单项 也就是当前路由的路径表示为index
    this.activePath = this.$router.history.current.path
  },
  methods: {
    exit () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    changeCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less">
.home-container {
  height: 100%;
}
.container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > .header-left {
    color: #fff;
    line-height: 60px;
    font-size: 22px;
  }
}
.el-aside {
  background-color: #333744;
  .toggle-button {
    background-color: #4a5064;
    text-align: center;
    line-height: 24px;
    letter-spacing: 0.2em;
    font-size: 10px;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
