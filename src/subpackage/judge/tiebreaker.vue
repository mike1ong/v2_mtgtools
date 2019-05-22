<template>
  <div class="flex-fullheight">
    <mtHeader color="#353535" :showIcon="true"></mtHeader>
    <i-tabs :current="currentTab" @change="changeTab">
        <i-tab key="tabHome" :title="t.common.home"></i-tab>
        <i-tab key="tabPlayer" :title="t.tiebreaker.standing"></i-tab>
        <i-tab key="tabResult" :title="t.tiebreaker.pairing"></i-tab>
        <i-tab key="tabAbout" :title="t.common.about"></i-tab>
    </i-tabs>

    <div class="tab-body" v-if="currentTab == 'tabHome'">
      <div class="title">{{t.tiebreaker.title}}</div>
      <div class="description"></div>
    </div>

    <div class="tab-body" v-if="currentTab == 'tabPlayer'">
      tabPlayer
    </div>

    <div class="tab-body" v-if="currentTab == 'tabResult'">
      tabResult
    </div>

    <div class="tab-body" v-if="currentTab == 'tabAbout'">
      tabAbout
    </div>
  </div>  
</template>

<script>
import mta from '../../utils/mta_analysis'
import { mapState } from 'vuex'
import mtHeader from '@/components/mtHeader'
// import { $msg } from '../../utils/index'
// import { createPlayer } from './tiebreaker.js'

export default {
  mpType: 'page',
  data () {
    return {
      currentTab: 'tabHome'
    }
  },
  computed: {
    ...mapState([
      'sysinfo'
    ]),
    t () {
      return this.$t('pub')
    }
  },
  config: {
    'usingComponents': {
      'i-drawer': '../../../static/iview/drawer/index',
      'i-action-sheet': '../../../static/iview/action-sheet/index',
      'i-tabs': '../../../static/iview/tabs/index',
      'i-tab': '../../../static/iview/tab/index',
      'i-message': '../../../static/iview/message/index'
    }
  },
  onLoad () {
    mta.Page.init()
  },
  components: {
    mtHeader
  },
  methods: {
    changeTab (e) {
      this.currentTab = e.mp.detail.key
    }
  },
  mounted () {
  }
}
</script>

<style scope>
.title {
  font-size: 32px;
}
</style>
