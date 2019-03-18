<template>
  <div class="container">
      {{ t.pageHeader.hello }}
      <i-button @click="clickHandle('test click', $event)" type="primary">{{ t.pageHeader.hello }}</i-button>     
  </div>
</template>

<script>
import mta from '../utils/mta_analysis'
export default {
  mpType: 'page',
  config: {
    usingComponents: {
      'i-button': '../../static/iview/button/index'
    }
  },
  onLoad () {
    mta.Page.init()
  },
  data () {
    return {

    }
  },
  methods: {
    clickHandle (msg, ev) {
      // eslint-disable-next-line
      // this.$http.request({
      //   method: 'post',
      //   url: '/User',
      //   body: {}
      // }).then(res => {
      //   console.log(res)
      // })

      if (this.$store.state.lang === 'cn') {
        this.$store.commit('switchLang', 'en')
      } else {
        this.$store.commit('switchLang', 'cn')
      }
      this.$i18n.locale = this.$store.state.lang
    }
  },
  computed: {
    t () {
      return this.$t('pub')
    }
  },
  created () {
    // 调用应用实例的方法获取全局数据
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
