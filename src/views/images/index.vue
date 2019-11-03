<template>
  <div class="container_image">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <el-radio-group size="small" v-model="reqParams.collect" @change="changeStatus">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-dialog title="添加素材" :visible.sync="dialogVisible" width="30%">
        <el-upload
          class="avatar-uploader"
          name="image"
          :headers="headers"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :show-file-list="false"
          :on-success="uploadImage"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-dialog>
      <el-button type="success" size="small" style="float:right" @click="dialogVisible = true">添加素材</el-button>
      <div class="imgs">
        <div class="img_item" v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="footer" v-if="!reqParams.collect">
            <i class="el-icon-star-off" :class="{red:item.is_collected}" @click="changeSave(item)"></i>
            <i class="el-icon-delete" @click="deleteImg(item)"></i>
          </div>
        </div>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pageChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      reqParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      headers: { Authorization: `Bearer ${local.getUser().token}` },
      images: [],
      dialogVisible: false,
      imageUrl: null,
      total: 0
    }
  },
  methods: {
    uploadImage (res) {
      this.imageUrl = res.data.url
      this.$message.success('素材添加成功')
      window.setTimeout(() => {
        this.dialogVisible = false
        this.getImages()
        this.imageUrl = null
      }, 2000)
    },
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    pageChange (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    changeStatus () {
      this.reqParams.page = 1
      this.getImages()
    },
    async changeSave (item) {
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      item.is_collected = data.collect
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
    },
    async deleteImg (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`user/images/${item.id}`)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getImages()
      })
    }
  },
  created () {
    this.getImages()
  }
}
</script>

<style lang="less" scoped>
.imgs {
  padding-top: 20px;
  .img_item {
    width: 180px;
    height: 180px;
    position: relative;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      width: 100%;
      text-align: center;
      color: #fff;
      i {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
