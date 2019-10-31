<template>
  <div class="container_article">
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
          <!-- <el-breadcrumb-item>内容管理</el-breadcrumb-item> -->
          <my-bread>内容管理</my-bread>
        </el-breadcrumb>
        <template scope></template>
      </div>
      <el-form label-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="selectData.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道：">
          <el-select v-model="selectData.channel_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in channelData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="justData"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changeDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="selectArticle">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header" style="margin-top:20px">
        <span>根据筛选条件共查询到{{total_count}}条数据</span>
      </div>
      <el-table :data="articles" style="width: 100%">
        <el-table-column label="封面" width="180">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" fit="fill"></el-image>
          </template>
          <el-image>
            <div slot="error">
              <el-image src="../../assets/error.gif"></el-image>
            </div>
          </el-image>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="toEdit(scope.row.id)"
              circle
              plain
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" circle plain></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="total_count"
        :page-size="selectData.per_page"
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :current-page="selectData.page"
        @current-change="changePage"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectData: {
        status: null,
        channel_id: null,
        page: 1,
        per_page: 20,
        begin_pubdate: null,
        end_pubdate: null
      },
      // 总条数
      total_count: 0,
      // 频道数据
      channelData: [],
      // 时间日期
      justData: [],
      // 文章列表
      articles: []
    }
  },
  methods: {
    async getChannels () {
      const {
        data: { data }
      } = await this.$http.get('channels')
      // console.log(data)
      this.channelData = data.channels
    },
    async getArticles () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.selectData })
      this.articles = data.results
      this.total_count = data.total_count
      console.log(this.total_count)
      // console.log(data)
    },
    changePage (newPage) {
      this.selectData.page = newPage
      this.getArticles()
    },
    selectArticle () {
      if (this.selectData.channel_id === '') this.selectData.channel_id = null
      this.selectData.page = 1
      this.getArticles()
    },
    changeDate (justData) {
      if (justData) {
        this.selectData.begin_pubdate = justData[0]
        this.selectData.end_pubdate = justData[1]
      } else {
        this.selectData.begin_pubdate = null
        this.selectData.end_pubdate = null
      }
    },
    toEdit (id) {
      this.$router.push({ path: '/publish', query: { id } })
    }
  },
  created () {
    this.getChannels()
    this.getArticles()
  }
}
</script>

<style lang="less" scoped>
</style>
