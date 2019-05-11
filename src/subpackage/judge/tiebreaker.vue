<template>
  <div class="flex-fullheight">
    <mtHeader color="#353535" :showIcon="true"></mtHeader>
  </div>  
</template>

<script>
import mta from '../../utils/mta_analysis'
import { mapState } from 'vuex'
import mtHeader from '@/components/mtHeader'
// import { createPlayer } from './tiebreaker.js'

export default {

  mpType: 'page',
  data () {
    return {
      currRound: 0,
      totalRound: 0,
      playerlist: [],
      matchlist: []
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
      'i-action-sheet': '../../../static/iview/action-sheet/index'
    }
  },
  onLoad () {
    mta.Page.init()
  },
  components: {
    mtHeader
  },
  methods: {
  },
  mounted () {
    console.log('mounted, ready to init')
  }
}
</script>

<style scope>

</style>
