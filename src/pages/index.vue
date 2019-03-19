<template>
  <div>
    <mtHeader></mtHeader>
  </div>  
</template>

<script>
import mta from '../utils/mta_analysis'
import mtHeader from '@/components/mtHeader'
export default {
  mpType: 'page',
  config: {
    'usingComponents': {
      'i-icon': '../static/iview/icon'
    }
  },
  onLoad () {
    mta.Page.init()
    console.log('page onload')
  },
  components: {
    mtHeader
  },
  data () {
    return {
    }
  }
}
</script>

<style scope>
</style>
