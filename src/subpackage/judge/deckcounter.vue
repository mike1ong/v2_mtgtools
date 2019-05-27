<template>
  <div class="flex-fullheight">
    <mtHeader color="#353535" :showIcon="true"></mtHeader>
    <div class="upText">
      <scroll-view id="s_view" scroll-y="true" :scroll-top="scrolltop" >
        <div v-for="(item, index) in operList" :key="index" >
          <div v-if="index>=operList.length-10">
            {{index + 1}}:   + {{item}}
          </div>
        </div>
      </scroll-view>
      <div id="s_total">{{operTotal}}</div>
    </div>
    <div class="btnGroup">
      <button data-func="reset" @click="doFunc" class="btnFunc">{{t.common.reset}}</button>
      <button data-func="undo" @click="doFunc" class="btnFunc">{{t.common.revert}}</button>
      <button data-num="1" @click="addNum" class="btnNum">+1</button>
      <button data-num="2" @click="addNum" class="btnNum">+2</button>
      <button data-num="3" @click="addNum" class="btnNum">+3</button>
      <button data-num="4" @click="addNum" class="btnNum">+4</button>
    </div>
  </div>
</template>

<script>
import mta from '../../utils/mta_analysis'
import mtHeader from '@/components/mtHeader'

export default {
  mpType: 'page',
  data () {
    return {
      operTotal: 0,
      operList: [],
      scrolltop: 0
    }
  },
  computed: {
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
    addNum (event) {
      var i = parseInt(event.mp.detail.num, 10)
      this.operTotal += i
      this.operList.push(i)
      if (this.operTotal === 60) {
        wx.vibrateLong({})
      }
      this.scrolltop = this.operList.length * 100
    },
    doFunc (event) {
      if (event.mp.detail.func === 'reset') {
        this.operTotal = 0
        this.operList = []
      } else {
        if (this.operList.length > 0) {
          let i = this.operList.pop()
          this.operTotal -= i
          this.scrolltop = this.operList.length * 100
        }
      }
    }
  }
}
</script>

<style scope>
.btnGroup{
  display: flex;
  align-self: flex-end;
  flex-wrap: wrap;
  flex-direction: row;
  width:100%;
}
button{
  margin-bottom: 1rpx;
}
.btnNum{
  width: 374rpx;
  height: 200rpx;
  font-size: 42px;
}
.btnFunc{
  width: 374rpx;
  height: 100rpx;
}
.upText{
  width: 750rpx;
  flex-grow: 1;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  background-color: #353535;
  padding-bottom: 20px;
}
#s_total{
  color: #fff;
  font-size: 72px;
  padding-right: 10px;
}
#s_view{
  padding:10px;
  color: #fff;
  font-size: 20px;
  flex:1;
}
</style>
