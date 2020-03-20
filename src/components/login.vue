<template>
        <div class="login-container">
           <div class="login-box">
               <!-- 头像 -->
               <div class="avater"><img src="../assets/jellyjellywing_43914374_2186965421571137_11937066.jpg" alt=""></div>
               <!-- 表单 -->
               <el-form ref="loginFormRef" :model="loginForm" label-width="0" :rules="loginFormRules" class="login-form">
                        <!-- 登录名 -->
                        <el-form-item prop="username">
                            <el-input v-model= "loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
                         </el-form-item>
                        <!-- 密码 -->
                         <el-form-item prop="password">
                            <el-input v-model= "loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
                         </el-form-item>
                         <!-- 按钮 -->
                         <el-form-item class="login-button">
                             <el-button type="primary" @click="login">登录</el-button>
                             <el-button type="info" @click="resetForm">重置</el-button>
                         </el-form-item>
                </el-form>

           </div>
        </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 登录表单的数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登录验证对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return false
        }
        // 使用axios的post方法 紧跟着的函数加async 解构获得data属性的值
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '用户名或密码错误！',
            duration: 1000,
            center: true
          })
        } else {
          this.$message({
            type: 'success',
            message: '登录成功!',
            duration: 1000,
            center: true

          })
          window.sessionStorage.setItem('token', res.data.token)
          // 编程式导航
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
    background-color: #2b4b6b;
    height: 100%;
    .login-box {
    width: 450px;
    height: 300px;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
 .avater {
     width: 130px;
     height: 130px;
     border-radius: 50%;
     position: absolute;
     left: 50%;
     transform: translate(-50%, -50%);
     box-shadow: 0 0 20px #ddd;
     img {
         width: 100%;
         height: 100%;
         border-radius: 50%;
         background-color: #eee;
     }
    }

}
.login-form {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    position: absolute;
    bottom: 0;
    .login-button {
        display: flex;
        justify-content: flex-end;
    }
}

}

</style>
