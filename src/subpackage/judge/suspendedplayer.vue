<template>
  <div class="bodydiv">
    <mtHeader color="#353535" :showIcon="true"></mtHeader>
    <wux-search-bar clear controlled :value="value" :placeholder="t.suspendedplayer.placeholder" :cancelText="t.common.search" @clear="onClear" @change="onChange" @cancel="onCancel" @confirm="onConfirm"/>
    <i-notice-bar v-if="lasttime != ''">{{t.suspendedplayer.lastupdate}}: <wux-timeago :to="lasttime" :lang="lang"></wux-timeago></i-notice-bar>
    <div class="resultblock" v-for="(item, index) in resultList" :key="index">
      <div class="dciitem">
        <i-row>
          <i-col span="8" offset="1">{{item.dciNo}}</i-col>
          <i-col span="7">{{item.startDate}}</i-col>
          <i-col span="7">{{item.endDate}}</i-col>        
        </i-row>
        <i-row>
          <i-col span="22" offset="1">{{item.lastName}} {{item.firstName}}</i-col>
        </i-row>
        <i-row>
          <i-col span="22" offset="1">{{item.country}} {{item.region}} {{item.city}}</i-col>
        </i-row>
      </div>
    </div>
    <i-load-more v-if="resultList.length>0" :tip="hasnext ? t.common.loading : t.common.loaded" :loading="loading"/>
    <i-divider v-if="resultList.length==0" :content="t.common.nodata"></i-divider>
    <wux-fab-button v-if="showBack" theme="dark" position="bottomRight" actionRotate="false" 
    action="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB/ElEQVRoQ+2XwU4UQRRFzxXj3i/wS/gEFmCCxsgC2eAOEhNcoMaoCYSVYQEbdKExgYAu/AW+wc8gronyTCc9Safsqq7u1x3B1CxnqnrOue9WT4+44S/dcH6KwL+eYJnAfz0BM3tVCUp6PZXoZBUysy1gpwZ/Lml3ColJBAL4GfckEqMLROAnkxhVoAN+EonRBMxsG3iT2fNtSe8y1yaXjSKQmXwIMsqZcAtE4C+BOwFx23tuCZdABP4X8BA4DQTuA8fA7eB9l8RggQT8EnAOXASgd4F54OuYEoMEIvC/gUVJ382sgv1LQNJPM1sAvgFzY0yit0AC/oGkswoqJVB/PquTW6KXQA58jkBD4gS45ZlEtkAE/gpYniU/A+maQGPdI+CTRyJLIAG/IulLeIPPFagn4ZLoFIjAG/C4DT63Qk1pM6skPldP3n3rlBRIwK9J+hj7je8zgUadVoGjvhJRgaHwQyYQSHxoCWZD0vu2wFICL4Hwn9STVPJ9D3EbkJmtAwe5Veqq0B7wrL7YU0mHOU+QQyoUnImmxFtJL2Lfm3OI94EfksJUoi5egbqGG8A9SZup0DoFchL33EaHXL+5pwhEDmL0Yc6beLi/TKBMwNmpUqFSoVIhZwKlQs4Ay12oVOg6VsjJ1Gv7JGegF4FzcRFwBujeXibgjtB5gT9RxjFA8J58qAAAAABJRU5ErkJggg=="
    controlled @change="onBackToTop"></wux-fab-button>
  </div>
</template>

<script>
import mta from '../../utils/mta_analysis'
import { mapState } from 'vuex'
import mtHeader from '@/components/mtHeader'
import { doRequest } from '../../utils/websocket'
let condition = {
  keyword: '',
  pageindex: 1
}
export default {
  mpType: 'page',
  data () {
    return {
      lastdate: '',
      lasttime: '',
      value: '',
      hasnext: false,
      loading: false,
      showBack: false,
      resultList: []
    }
  },
  computed: {
    ...mapState(['suspenddci', 'lang']),
    t () {
      return this.$t('pub')
    }
  },
  config: {
    'usingComponents': {
      'i-drawer': '../../../static/iview/drawer/index',
      'i-action-sheet': '../../../static/iview/action-sheet/index',
      'i-notice-bar': '../../../static/iview/notice-bar/index',
      'i-row': '../../../static/iview/row/index',
      'i-col': '../../../static/iview/col/index',
      'i-divider': '../../../static/iview/divider/index',
      'i-load-more': '../../../static/iview/load-more/index',
      'wux-search-bar': '../../../static/wux/search-bar/index',
      'wux-fab-button': '../../../static/wux/fab-button/index',
      'wux-timeago': '../../../static/wux/timeago/index'
    },
    'enablePullDownRefresh': true
  },
  onLoad () {
    mta.Page.init()
  },
  onReachBottom () {
    if (this.hasnext) {
      condition.pageindex += 1
      this.doQuery(true)
    }
  },
  onPageScroll (e) {
    this.showBack = e.scrollTop > 20
  },
  components: {
    mtHeader
  },
  methods: {
    doQuery (force) {
      if (this.value !== condition.keyword) {
        condition.keyword = this.value
        condition.pageindex = 1
        this.hasnext = false
        this.resultList = []
        this.$store.commit('setSuspenddci', condition.keyword)
      } else if (!force) {
        return
      }
      this.loading = true
      doRequest('suspendedplayer/listdata', condition, (result) => {
        this.resultList = this.resultList.concat(result)
        this.hasnext = result.length >= 20
        this.loading = false
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
    },
    onBackToTop (res) {
      this.showBack = false
      wx.pageScrollTo({
        scrollTop: 0
      })
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
      this.doQuery(true)
    }
  }
}
</script>

<style scope>
page {
  background-color: #EFEFF4;
}
.bodydiv {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.resultblock {
  margin-top: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: #fff;
}
</style>
