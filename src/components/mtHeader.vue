<template>
  <div class="frameContainers">    
    <header class="headNav" :style="{ paddingTop: sysinfo.statusBarHeight + 'px', height: sysinfo.navHeight + 'px', 'background-color': color }">
      <section class="headArea" :style="{ height: sysinfo.headAreaHeight + 'px', marginTop: sysinfo.headAreaMarTop + 'px', 'background-color': color }">
        <div class='leftBox' :style="{ 'background-color': color }">
          <span v-if="hasReturn" @click="doReturn" class="iconfont avataricon icon-return"></span>
          <span v-if="showIcon" @click="showMenu" class="iconfont avataricon icon-menu1"></span>
          <span class="iconfont avataricon icon-user"></span>
          <span class="iconfont avataricon icon-xinxi-fill"></span>
          <span class="iconfont avataricon icon-svgglobalselect" @click="showLang"></span>      
        </div>
        <div class='rightBox' :style="{ 'flex-basis': sysinfo.headRightBoxW + 'px' }"></div>
      </section>
    </header>
    <slot name="body"></slot>
    <i-drawer mode="left" :visible="vismenu" @close="vismenu=false">
      <div class="demo-container">
          单击遮罩层关闭
      </div>
    </i-drawer>
    <i-action-sheet :visible="vislang" :actions="lstLang" show-cancel @cancel="vislang=false" @clickitem="onClickItem" mask-closable>
    <view slot="header" style="padding: 16px">
        <view style="color: #444;font-size: 16px">{{ t.index.switchLang }}</view>
    </view>
    </i-action-sheet>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['color', 'showIcon'],
  data () {
    return {
      vislang: false,
      vismenu: false,
      lstLang: [{name: '中文'}, {name: 'English'}]
    }
  },
  computed: {
    ...mapState([
      'sysinfo'
    ]),
    hasReturn () {
      return getCurrentPages().length > 1
    },
    t () {
      return this.$t('pub')
    }
  },
  methods: {
    showLang () {
      this.vislang = true
    },
    showMenu () {
      this.vismenu = true
    },
    onClickItem (e) {
      let value = e.mp.detail.index || 0
      if (value === 1) {
        value = 'en'
      } else {
        value = 'zh'
      }
      this.vislang = false
      this.$store.commit('switchLang', value)
      this.$i18n.locale = value
    },
    doReturn (e) {
      wx.navigateBack({delta: 1})
    }
  },
  mounted () {
    console.log(this.color)
  }
}
</script>

<style scope>
.frameContainers {
  width: 100%;
  height: 100%;
}

.headNav {
  display: flex;
  align-items: center;
}
.headArea {
  width: 100%;
  display: flex;
}
.leftBox {
  display: flex;
  flex-grow: 1;
  align-items: center;
  padding: 0;
}
.rightBox {
  width: 18vh;
  height: 100%;
  
  float: right;
}
.slogo {
  width:24px;
  height:24px;
  border-radius: 12px;
}
.demo-container{
	width:50vw;
	height: 100vh;
	background:rgb(255, 255, 255);
}
</style>
