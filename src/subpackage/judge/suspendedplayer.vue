<template>
  <div class="bodydiv">
    <mtHeader color="#353535" :showIcon="true"></mtHeader>
    <wux-search-bar clear controlled :value="value" :placeholder="t.suspendedplayer.placeholder" :cancelText="t.common.search" @clear="onClear" @change="onChange" @cancel="onCancel" @confirm="onConfirm"/>
    <i-notice-bar v-if="lasttime != ''">{{t.suspendedplayer.lastupdate}}: {{lasttime}}</i-notice-bar>
    <div v-for="(item, index) in resultList" :key="index">
      {{item.dciNo}}
      {{item.lastName}} {{item.firstName}}
    </div>
  </div>  
</template>

<script>
import mta from '../../utils/mta_analysis'
import { mapState } from 'vuex'
import mtHeader from '@/components/mtHeader'
import { doRequest } from '../../utils/websocket'
let condition = {
  keyword: '',
  pageindex: 1,
  hasnext: false
}
export default {
  mpType: 'page',
  data () {
    return {
      lastdate: '',
      lasttime: '',
      value: '',
      resultList: []
    }
  },
  computed: {
    ...mapState(['suspenddci']),
    t () {
      return this.$t('pub')
    }
  },
  config: {
    'usingComponents': {
      'i-drawer': '../../../static/iview/drawer/index',
      'i-action-sheet': '../../../static/iview/action-sheet/index',
      'i-notice-bar': '../../../static/iview/notice-bar/index',
      'wux-search-bar': '../../../static/wux/search-bar/index'
    }
  },
  onLoad () {
    mta.Page.init()
  },
  components: {
    mtHeader
  },
  methods: {
    doQuery () {
      if (this.value !== condition.keyword) {
        condition.keyword = this.value
        condition.pageindex = 1
        condition.hasnext = false
        this.resultList = []
        this.$store.commit('setSuspenddci', condition.keyword)
      }
      doRequest('suspendedplayer/listdata', condition, (result) => {
        this.resultList = this.resultList.concat(result)
      })
    },
    onChange (res) {
      this.value = res.mp.detail.value
    },
    onClear () {
      this.value = ''
      this.doQuery()
    },
    onCancel (res) {
      this.doQuery()
    },
    onConfirm (res) {
      this.doQuery()
    }
  },
  created () {
    console.log('created')
  },
  mounted () {
    this.value = this.suspenddci
    if (!this.lastdate) {
      doRequest('suspendedplayer/lasttime', null, (result) => {
        this.lastdate = result.lastdate
        this.lasttime = result.lasttime
      })
    }
    if (this.resultList.length === 0) {
      this.doQuery()
    }
  }
}
</script>

<style scope>
.bodydiv {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
