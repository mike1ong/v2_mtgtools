<template>
  <div class="bodydiv">
    <mtHeader color="#353535" :showIcon="true">
    </mtHeader>
  </div>  
</template>

<script>
import mta from '../utils/mta_analysis'
import mtHeader from '@/components/mtHeader'
export default {
  mpType: 'page',
  data () {
    return {

    }
  },
  computed: {
    t () {
      return this.$t('pub')
    }
  },
  config: {
    'usingComponents': {
      'i-drawer': '../../static/iview/drawer/index',
      'i-action-sheet': '../../static/iview/action-sheet/index'
    }
  },
  onLoad () {
    mta.Page.init()
    console.log('page onload')
  },
  components: {
    mtHeader
  },
  methods: {
  }
}
</script>

<style scope>
.bodydiv {
  display: flex;
  flex-direction: column;
  background-color: #353535;
  height: 100%;
}
</style>
