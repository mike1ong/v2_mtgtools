<template>
  <div class="frameContainers">
    <!-- 顶部占位 -->
    <div class="headArea" :style="{ height: sysinfo.headAreaMarTop + sysinfo.statusBarHeight +'px', 'background-color': color }"></div>
    <!-- 全局header -->
    <section class="headArea" :style="{ height: sysinfo.headAreaHeight + 10 + 'px', marginTop: sysinfo.headAreaMarTop + sysinfo.statusBarHeight+ 'px', 'background-color': color }">
      <div class='leftBox' :style="{ 'background-color': color }">
        <span v-if="hasReturn" @click="doReturn" class="iconfont avataricon icon-return"></span>
        <span v-if="showIcon" @click="showMenu" class="iconfont avataricon icon-menu1"></span>
        <span class="iconfont avataricon icon-user"></span>
        <span v-if="isLogin" class="iconfont avataricon icon-xinxi-fill"></span>
        <span class="iconfont avataricon icon-svgglobalselect" @click="showLang"></span>      
      </div>
      <div class='rightBox' :style="{ 'flex-basis': sysinfo.headRightBoxW + 'px' }"></div>
    </section>
    <!-- 顶部扩充器 -->
    <div :style="{ height: sysinfo.headAreaHeight + 10 +'px', marginTop: sysinfo.headAreaMarTop + sysinfo.statusBarHeight+ 'px', 'background-color': color }"></div>
    <!-- 实际内容开始部分 -->
    <slot name="body"></slot>
    <!-- 抽屉部分 -->
    <i-drawer mode="left" :visible="vismenu" @close="vismenu=false">
      <div class="demo-container">
          单击遮罩层关闭
      </div>
    </i-drawer>
    <!-- 语言切换部分 -->
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
      'sysinfo', 'userinfo'
    ]),
    hasReturn () {
      return getCurrentPages().length > 1
    },
    isLogin () {
      return this.userinfo.dci !== ''
    },
    t () {
      return this.$t('pub')
    }
  },
  methods: {
    showLang () {
      this.vismenu = false
      this.vislang = !this.vislang
    },
    showMenu () {
      this.vislang = false
      this.vismenu = !this.vismenu
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
    // if (!this.userinfo.openid || !this.userinfo.sessionid || new Date().getTime() - this.userinfo.expireAt > 0) {
    //   true || wx.login({
    //     success: function (res) {
    //       console.log(res)
    //     }
    //   })
    // }
  }
}
</script>

<style scope>
.headNav {
  display: flex;
  align-items: center;
  position:fixed;
}
.headArea {
  width: 100%;
  display: flex;
  position:fixed;
  z-index: 1000;
}
.headerSpace {
  background-color: #fff;
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
