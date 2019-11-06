<template>
  <div class="container-setting">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form label-width="120px">
            <el-form-item label="编号">
              <el-input v-model="userInfo.id"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="userInfo.mobile"></el-input>
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="userInfo.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="saveUserInfo">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :http-request="uploadAvatar"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import eventBus from '@/eventBus'
import local from '@/utils/local'
export default {
  data () {
    return {
      userInfo: {
        id: '',
        mobile: '',
        name: '',
        intro: '',
        email: '',
        photo: null
      }
    }
  },
  methods: {
    async getUserInfo () {
      const {
        data: { data }
      } = await this.$http.get('user/profile')
      this.userInfo = data
    },
    async saveUserInfo () {
      const { name, intro, email } = this.userInfo
      await this.$http.patch('user/profile', { name, intro, email })
      this.$message.success('修改用户资料成功')
      eventBus.$emit('updateUserInfo', name)
      const user = local.getUser()
      user.name = name
      local.setUser(user)
    },
    async uploadAvatar ({ file }) {
      const fd = new FormData()
      fd.append('photo', file)
      const {
        data: { data }
      } = await this.$http.patch('user/photo', fd)
      this.$message.success('修改用户头像成功')
      this.userInfo.photo = data.photo
      eventBus.$emit('updateAvatar', data.photo)
      const user = local.getUser()
      user.photo = data.photo
      local.setUser(user)
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
</style>
