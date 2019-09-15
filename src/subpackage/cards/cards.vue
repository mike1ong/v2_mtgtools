<template>
  <div class="flex-fullheight">
    <mtHeader color="#353535" :showIcon="true"></mtHeader>
    <i-tabs :current="currentTab" @change="changeTab">
      <i-tab key="tabOracle" :title="'　  ORACLE  　'"></i-tab>
    </i-tabs>

    <div class="flex-fullheight" v-if="currentTab == 'tabOracle'">
      <i-sticky :scrollTop="oracleScrollTop">
        <i-sticky-item :fixedTop="sysinfo.headAreaHeight + 10 + sysinfo.headAreaMarTop + sysinfo.statusBarHeight+'px'" >
          <div slot="title">Oracle text:</div>
          <div slot="content">
            <div style="padding: 10px; line-height: 1.5">
              <div>Cave People</div>
              <div>{1}{R}{R}</div>
              <div>Creature — Human</div>
              <div>Whenever Cave People attacks, it gets +1/-2 until end of turn.
  {1}{R}{R}, {T}: Target creature gains mountainwalk until end of turn. (It can't be blocked as long as defending player controls a Mountain.)</div>
            </div>

            <div style="padding: 10px; line-height: 1.5">
              <div>Cave People</div>
              <div>{1}{R}{R}</div>
              <div>Creature — Human</div>
              <div>Whenever Cave People attacks, it gets +1/-2 until end of turn.
  {1}{R}{R}, {T}: Target creature gains mountainwalk until end of turn. (It can't be blocked as long as defending player controls a Mountain.)</div>
            </div>

          </div>
        </i-sticky-item>

        <i-sticky-item :fixedTop="sysinfo.headAreaHeight + 10 + sysinfo.headAreaMarTop + sysinfo.statusBarHeight+'px'">
          <div slot="title">Card-specific notes:</div>
          <div slot="content">
            <div style="padding: 10px; line-height: 1.5">
              <div>Cave People</div>
              <div>{1}{R}{R}</div>
              <div>Creature — Human</div>
              <div>Whenever Cave People attacks, it gets +1/-2 until end of turn.
  {1}{R}{R}, {T}: Target creature gains mountainwalk until end of turn. (It can't be blocked as long as defending player controls a Mountain.)</div>
            </div>

            <div style="padding: 10px; line-height: 1.5">
              <div>Cave People</div>
              <div>{1}{R}{R}</div>
              <div>Creature — Human</div>
              <div>Whenever Cave People attacks, it gets +1/-2 until end of turn.
  {1}{R}{R}, {T}: Target creature gains mountainwalk until end of turn. (It can't be blocked as long as defending player controls a Mountain.)</div>
            </div>

            <div style="padding: 10px; line-height: 1.5">
              <div>Cave People</div>
              <div>{1}{R}{R}</div>
              <div>Creature — Human</div>
              <div>Whenever Cave People attacks, it gets +1/-2 until end of turn.
  {1}{R}{R}, {T}: Target creature gains mountainwalk until end of turn. (It can't be blocked as long as defending player controls a Mountain.)</div>
            </div>

            <div style="padding: 10px; line-height: 1.5">
              <div>Cave People</div>
              <div>{1}{R}{R}</div>
              <div>Creature — Human</div>
              <div>Whenever Cave People attacks, it gets +1/-2 until end of turn.
  {1}{R}{R}, {T}: Target creature gains mountainwalk until end of turn. (It can't be blocked as long as defending player controls a Mountain.)</div>
            </div>
          </div>
        </i-sticky-item>

        <i-sticky-item :fixedTop="sysinfo.headAreaHeight + 10 + sysinfo.headAreaMarTop + sysinfo.statusBarHeight+'px'">
          <div slot="title">Format legality:</div>
          <div slot="content"></div>
        </i-sticky-item>
      </i-sticky>
    </div>
  </div>  
</template>

<script>
import mta from '../../utils/mta_analysis'
import { mapState } from 'vuex'
import mtHeader from '@/components/mtHeader'

export default {
  mpType: 'page',
  data () {
    return {
      currentTab: 'tabOracle',
      oracleScrollTop: 0
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
      'i-modal': '../../../static/iview/modal/index',
      'i-message': '../../../static/iview/message/index',
      'i-sticky': '../../../static/iview/sticky/index',
      'i-sticky-item': '../../../static/iview/sticky-item/index'
    }
  },
  onLoad () {
    mta.Page.init()
  },
  onPageScroll (event) {
    console.log(this.oracleScrollTop)
    this.oracleScrollTop = event.scrollTop
  },
  components: {
    mtHeader
  },
  methods: {
    changeTab (e) {
      this.currentTab = e.mp.detail.key
    }
  }
}
</script>

<style scope>

</style>
