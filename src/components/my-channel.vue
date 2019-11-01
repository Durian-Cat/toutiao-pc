<template>
  <el-select @change="fn" :value="value" placeholder="请选择" clearable>
    <el-option v-for="item in channelData" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
      //   value: null,
      channelData: []
    }
  },
  methods: {
    fn (channelId) {
      if (channelId === '') {
        channelId = null
      }
      this.$emit('input', channelId)
    },
    async getChannels () {
      const {
        data: { data }
      } = await this.$http.get('channels')
      // console.log(data)
      this.channelData = data.channels
    }
  },
  created () {
    this.getChannels()
  }
}
</script>

<style lang="less" scoped>
</style>
