<template>
  <div class="container-publish">
    <el-card>
      <div slot="header">
        <my-bread>{{$route.query.id?'编辑':'发布'}}文章</my-bread>
      </div>
      <el-form ref="form" :model="publishList" label-width="80px">
        <el-form-item label="标题：">
          <el-input style="width:400px" v-model="publishList.title"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <quill-editor v-model="publishList.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group v-model="publishList.cover.type" @change="publishList.cover.images = []">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="publishList.cover.type === 1">
          <my-image v-model="publishList.cover.images[0]"></my-image>
        </div>
        <div v-if="publishList.cover.type === 3">
          <my-image v-model="publishList.cover.images[i-1]" v-for="i in 3" :key="i"></my-image>
        </div>
        <el-form-item label="频道：">
          <my-channel v-model="publishList.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="$route.query.id">
          <el-button type="primary" @click="update($route.query.id,false)">修改</el-button>
          <el-button @click="update($route.query.id,true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="create(false)">添加</el-button>
          <el-button @click="create(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      publishList: {
        title: null,
        channel_id: null,
        content: null,
        cover: {
          type: 1,
          images: []
        }
      },
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  watch: {
    '$route.query.id': function () {
      this.toggleStatus()
    }
  },
  methods: {
    toggleStatus () {
      const id = this.$route.query.id
      if (id) {
        // 修改
        this.getArticle(id)
      } else {
        this.publishList = {
          title: null,
          channel_id: null,
          content: null,
          cover: {
            type: 1,
            images: []
          }
        }
      }
    },
    // 新增
    async create (draft) {
      await this.$http.post(`articles?draft=${draft}`, this.publishList)
      this.$message.success(draft ? '发表成功' : '存入草稿成功')
      this.$router.push('/article')
    },
    // 获取
    async getArticle (id) {
      const {
        data: { data }
      } = await this.$http.get(`articles/${id}`)
      this.publishList = data
    },
    // 修改
    update (id, draft) {
      this.$http.get(`articles/${id}?draft=${draft}`, this.publishList)
      this.$message.success(draft ? '存入草稿成功' : '修改成功')
      this.$router.push('/article')
    }
  },
  created () {
    this.toggleStatus()
  }
}
</script>

<style lang="less" scoped>
</style>
