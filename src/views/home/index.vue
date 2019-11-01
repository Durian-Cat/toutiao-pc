<template>
  <el-container class="containerBox">
    <el-aside :width="isopen?'200px':'64px'">
      <div class="logo" :class="{smallLogo:!isopen}"></div>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo slideList"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="!isopen"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/images">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <i class="el-icon-s-fold icon" @click="toggleOpen"></i>
        <span class="headtext">江苏传智播客科技教育有限公司</span>
        <el-dropdown class="primaryCenter">
          <span class="el-dropdown-link">
            <img class="headIcon" :src="userInfo.photo" alt />
            <span class="userName">{{userInfo.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="setting">
              <i class="el-icon-setting"></i>
              个人设置
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">
              <i class="el-icon-unlock"></i>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      isopen: true,
      userInfo: {}
    }
  },
  methods: {
    toggleOpen () {
      this.isopen = !this.isopen
    },
    setting () {
      this.$router.push('/setting')
    },
    logout () {
      local.removeUser()
      this.$router.push('/login')
    }
  },
  created () {
    var user = local.getUser()
    this.userInfo.photo = user.photo
    this.userInfo.name = user.name
  }
}
</script>

<style scoped lang="less">
.containerBox {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  .slideList {
    border-right: none;
  }
  .el-aside {
    background: #002033;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url(../../assets/logo_admin.png) no-repeat center;
    }
    .smallLogo {
      background-size: 30px auto;
      background-image: url(../../assets/logo_admin_01.png);
    }
  }
  .el-header {
    line-height: 60px;
    border-bottom: 1px solid #ddd;
    .icon {
      vertical-align: middle;
      font-size: 30px;
    }
    .headtext {
      vertical-align: middle;
      margin-left: 10px;
    }
  }
  .primaryCenter {
    float: right;
    .headIcon {
      width: 30px;
      height: 30px;
      vertical-align: middle;
      margin-right: 5px;
    }
    .userName {
      font-weight: 700;
      vertical-align: middle;
    }
  }
}
</style>
