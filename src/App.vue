<script>
import mta from './utils/mta_analysis'
export default {
  created () {
    console.log('app created and cache logs by setStorageSync')
  },
  beforeCreate () { console.log('beforeCreate') },
  beforeMount () { console.log('beforeMount') },
  mounted () { console.log('mounted') },
  beforeUpdate () { console.log('beforeUpdate') },
  updated () { console.log('updated') },
  activated () { console.log('activated') },
  deactivated () { console.log('deactivated') },
  beforeDestroy () { console.log('beforeDestroy') },
  destroyed () { console.log('destroyed') },
  onLaunch (opt) {
    mta.App.init({
      'appID': '500674033',
      'eventID': '500674678',
      'statPullDownFresh': true,
      'lauchOpts': opt,
      'statShareApp': true,
      'statReachBottom': true
    })
    console.log('launch')
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
