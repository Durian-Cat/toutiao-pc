<template>
  <div class="container-comment">
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数" width="180"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数" width="180"></el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <el-button
              @click="toggleStatus(scope.row.id,false)"
              v-if="scope.row.comment_status"
              type="danger"
              size="small"
            >关闭评论</el-button>
            <el-button
              @click="toggleStatus(scope.row.id,true)"
              v-else
              type="success"
              size="small"
            >打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      reqParams: {
        per_page: 20,
        page: 1,
        response_type: 'comment'
      },
      allow_comment: ''
    }
  },
  methods: {
    toggleStatus (id, status) {
      this.$confirm(
        status ? '您确定要打开评论嘛？' : '您确定要关闭评论嘛？',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          const {
            data: { data }
          } = await this.$http.put(`comments/status?article_id=${id}`, {
            allow_comment: status
          })
          this.$message.success(data.allow_comment ? '打开评论成功' : '关闭评论成功')
          this.getComment()
        })
        .catch(() => {})
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getComment()
    },
    async getComment () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      this.tableData = data.results
      this.total = data.total_count
    }
  },
  created () {
    this.getComment()
  }
}
</script>

<style lang="less" scoped>
</style>
