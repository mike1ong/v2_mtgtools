<template>
<div class="frameContainers">
    <header class="headNav" :style="{ paddingTop: sysinfo.statusBarHeight + 'px', height: sysinfo.navHeight + 'px' }">
      <section class="headArea" :style="{ height: sysinfo.headAreaHeight + 'px', marginTop: sysinfo.headAreaMarTop + 'px' }">
        <div class='leftBox'>
          <i-icon type="activity" size="28" color="#80848f" />
        </div>
        <div class='rightBox' :style="{ 'flex-basis': sysinfo.headRightBoxW + 'px' }"></div>
      </section>
    </header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  config: {
    'usingComponents': {
      'i-icon': '../../static/iview/icon/index'
    }
  },
  computed: {
    ...mapState([
      'sysinfo'
    ])
  },
  mounted () {
  }

}
</script>

<style scope>
.frameContainers {
  width: 100%;
  height: 100%;
}
.headNav {
  background-color: #9e2929;
  display: flex;
  align-items: center;
}
.headArea {
  width: 100%;
  display: flex;
  background-color: #46d381;
}
.leftBox {
  display: flex;
  flex-grow: 1;
  align-items: center;
  background-color: #3c49c2;
  padding: 0;
}
.rightBox {
  width: 18vh;
  height: 100%;
  
  float: right;
}
</style>
