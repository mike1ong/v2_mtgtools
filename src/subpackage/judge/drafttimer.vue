<template>
  <div class="flex-fullheight">
    <mtHeader color="#353535" :showIcon="true"></mtHeader>
    <div class="bodyPage flex-fullheight">
      <div class="sceneMain flex-fullheight" v-if="stage=='main'">
        <div class="mainTitle">
          {{t.drafttimer.title}}
        </div>
        <div class="mainDesc">
          {{t.drafttimer.guide}}
        </div>
        <div class="mainSettingTitle">
          {{t.drafttimer.settings}}
        </div>
        <div class="mainSettings">
          <checkbox-group @change="checkBoxChange">
              <checkbox value="cb-cards" :checked="drafttimer.cardsPerPack==15" >{{t.drafttimer.setcard}}</checkbox>
              <checkbox value="cb-warn" :checked="drafttimer.warnSeconds==10">{{t.drafttimer.setwarn}}</checkbox>
          </checkbox-group>
        </div>
        <div class="flex-space"></div>
        <text class="mainInspired">
          Inspired by: \nDenis Sokolov—Level 2 judge from Lithuania\nhttps://tools.sokolov.cc/drafting/en.2.5.html
        </text>
        <i-button type="primary" size="default" shape="circle" @click="mainClick">Let's go</i-button>
      </div>

      <div class="sceneDraft flex-fullheight" v-if="stage=='draft'">
        <div class="sceneDraft_desc flex-fullheight" v-if="layout=='desc'">
          <text>
            {{desclist[step].text}}
          </text>
          <div class="flex-space"></div>
          <i-button type="primary" size="default" shape="circle" @click="descClick">{{desclist[step].btn}}</i-button>
        </div>

        <div class="flex-fullheight" v-if="layout=='timer'">
          <div class="btnGroup" v-if="!isCounting && countdown != 0">
            <i-button type="warning" inline="true" size="small" @click="prevClick">{{t.common.prev}}</i-button>
            <i-button type="primary" inline="true" size="small" @click="selectClick">{{t.common.select}}</i-button>
            <div class="flex-space"></div>
            <i-button type="error" inline="true" size="small" @click="resetClick">{{t.common.reset}}</i-button>
          </div>          
          <text class="timerText tipsBeforeTimer">
            {{tipsBefore}}
          </text>
          <text class="timerText countdown" :style="{color: countdown > drafttimer.warnSeconds ? 'black' : 'red',opacity: isCounting || countdown == 0 ? 1 : 0.3}">
            {{timer}}
          </text>
          <text class="timerText tipsAfterTimer">
            {{tipsAfter}}
          </text>
          <div class="flex-space"></div>
          <i-button type="success" size="default" shape="circle" @click="timerSuccess">{{counting_success}}</i-button>
          <i-button type="error" size="default" shape="circle" @click="timerError">{{counting_error}}</i-button>
        </div>
      </div>
      <i-action-sheet :visible="actVisible" :actions="actStep" show-cancel @cancel="actVisible=false" @clickitem="onClickItem" mask-closable>
      </i-action-sheet>      
      <i-modal :visible="resetModal" :actions="resetAct" @clickItem="handleReset">
        <div>{{t.drafttimer.exitConfirmation}}</div>
      </i-modal>
    </div>
  </div>  
</template>

<script>
import mta from '../../utils/mta_analysis'
import { mapState } from 'vuex'
import mtHeader from '@/components/mtHeader'
import { intToTime, $msg, format } from '../../utils/index'
let t
let seconds

export default {
  mpType: 'page',
  data () {
    return {
      stage: 'main',
      layout: 'desc',
      step: 0,
      pack: 0,
      pick: 0,
      countdown: 0,
      isCounting: false,
      breakTime: 0,
      resetModal: false,
      actVisible: false
    }
  },
  computed: {
    ...mapState(['drafttimer']),
    t () {
      return this.$t('pub')
    },
    desclist () {
      return [{
        text: this.t.drafttimer.text_welcome_page1,
        btn: this.t.common.continue
      }, {
        text: this.t.drafttimer.text_welcome_page2,
        btn: this.t.drafttimer.they_got_it
      }, {
        text: format(this.t.drafttimer.open_first_booster, this.drafttimer.cardsPerPack),
        btn: this.t.drafttimer.begin_the_draft
      }, {
        text: format(this.t.drafttimer.open_second_booster, this.drafttimer.cardsPerPack),
        btn: this.t.drafttimer.begin_the_draft
      }, {
        text: format(this.t.drafttimer.open_third_booster, this.drafttimer.cardsPerPack),
        btn: this.t.drafttimer.begin_the_draft
      }, {
        text: this.t.drafttimer.draft_is_over,
        btn: this.t.common.finish
      }]
    },
    resetAct () {
      return [{
        name: this.t.common.cancel
      }, {
        name: this.t.common.confirm,
        color: '#ed3f14'
      }]
    },
    tipsBefore () {
      if (this.breakTime > 0) {
        if (this.breakTime === 3) {
          return this.countdown > 0 ? this.t.drafttimer.construct : this.t.drafttimer.draft_is_over
        } else {
          return this.countdown > 0 ? format(this.t.drafttimer.review, (this.breakTime + 1) * 30) : this.t.drafttimer.put_back_cards
        }
      } else {
        if (this.countdown > 0) {
          return this.pick === 1 ? this.t.drafttimer.look : format(this.t.drafttimer.look_n_pass, this.drafttimer.cardsPerPack - this.pick + 1)
        } else {
          return format(this.t.drafttimer.look_n_pass, this.drafttimer.cardsPerPack - this.pick)
        }
      }
    },
    tipsAfter () {
      if (this.breakTime > 0) {
        return ''
      } else {
        return format(this.t.drafttimer.booster_n_pick, this.pack, this.pick)
      }
    },
    counting_success () {
      if (this.countdown === 0) {
        return this.t.common.next
      } else {
        return this.isCounting ? this.t.common.skip : this.t.common.restart
      }
    },
    counting_error () {
      if (this.countdown === 0) {
        return this.t.common.restart
      } else {
        return this.isCounting ? this.t.common.pause : this.t.common.continue
      }
    },
    timer () {
      return intToTime(this.countdown)
    },
    actStep () {
      return [{name: this.t.common.home}, {name: format(this.t.drafttimer.packs, 1)}, {name: format(this.t.drafttimer.packs, 2)}, {name: format(this.t.drafttimer.packs, 3)}]
    }
  },
  config: {
    'usingComponents': {
      'i-drawer': '../../../static/iview/drawer/index',
      'i-action-sheet': '../../../static/iview/action-sheet/index',
      'i-button': '../../../static/iview/button/index',
      'i-modal': '../../../static/iview/modal/index',
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
    checkBoxChange (e) {
      let res = {
        cardsPerPack: 14,
        warnSeconds: 5
      }
      if (e.mp.detail.value.length > 0) {
        let arr = e.mp.detail.value
        if (arr.indexOf('cb-cards') >= 0) {
          res.cardsPerPack = 15
        }
        if (arr.indexOf('cb-warn') >= 0) {
          res.warnSeconds = 10
        }
      }
      this.$store.commit('setDraftTimer', res)
    },
    format (str, args) {
      let result = str
      if (arguments.length <= 1) {
        return result
      }
      let data = arguments // 如果模板参数是数组
      for (let key in data) {
        if (key > 0) {
          let value = data[key]
          key -= 1
          if (undefined !== value) {
            result = result.replace('{' + key + '}', value)
          }
        }
      }
      return result
    },
    mainClick () {
      this.stage = 'draft'
      this.layout = 'desc'
      this.step = 0
      seconds = [40, 35, 30, 25, 25, 20, 20, 15, 10, 10, 5, 5, 5]
      if (this.drafttimer.cardsPerPack === 15) {
        seconds = [40].concat(seconds)
      }
    },
    descClick () {
      if (this.step < 2) {
        this.step += 1
      } else if (this.step === 5) {
        clearTimeout(t)
        this.stage = 'main'
      } else {
        this.pack = this.step - 1
        this.pick = 1
        this.countdown = seconds[this.pick - 1]
        this.layout = 'timer'
        this.beginTimer()
      }
    },
    beginTimer () {
      clearTimeout(t)
      this.isCounting = true
      t = setTimeout(() => {
        this.doTimer()
      }, 1000)
    },
    doTimer () {
      this.countdown -= 1
      if (this.countdown > 0) {
        if (this.countdown === this.drafttimer.warnSeconds) {
          if (wx.vibrateLong) {
            wx.vibrateLong()
          }
          $msg({
            content: format(this.t.drafttimer.timeleft, this.drafttimer.warnSeconds),
            type: 'warning'
          })
        }
        clearTimeout(t)
        t = setTimeout(() => {
          this.doTimer()
        }, 1000)
      } else {
        this.isCounting = false
      }
    },
    timerSuccess () {
      clearTimeout(t)
      if (this.countdown > 0 && !this.isCounting) {

      } else {
        if (this.breakTime > 0) {
          this.step = this.breakTime + 2
          this.stage = 'draft'
          this.layout = 'desc'
          this.breakTime = 0
          return
        } else {
          this.pick += 1
        }
        if (this.pick >= this.drafttimer.cardsPerPack) {
          this.breakTime = this.pack
        }
      }
      if (this.breakTime === 0) {
        this.countdown = seconds[this.pick - 1]
      } else {
        if (this.breakTime === 3) {
          this.countdown = 1500
        } else {
          this.countdown = (this.breakTime + 1) * 30
        }
      }
      this.beginTimer()
    },
    timerError () {
      if (this.countdown > 0) {
        clearTimeout(t)
        this.isCounting = !this.isCounting
        if (this.isCounting) {
          t = setTimeout(() => {
            this.doTimer()
          }, 1000)
        }
      } else {
        this.countdown = seconds[this.pick - 1]
        this.beginTimer()
      }
    },
    resetClick () {
      this.resetModal = true
    },
    selectClick () {
      this.actVisible = true
    },
    onClickItem (e) {
      this.actVisible = false
      let value = e.mp.detail.index || 0
      if (value === 0) {
        clearTimeout(t)
        this.stage = 'main'
      } else {
        this.state = 'draft'
        this.layout = 'timer'
        this.pack = value
        this.pick = 1
        this.breakTime = 0
        this.countdown = seconds[this.pick - 1]
        this.beginTimer()
      }
    },
    prevClick () {
      clearTimeout(t)
      if (this.stage === 'draft') {
        if (this.layout === 'desc') {
          if (this.step > 0 && this.step <= 2) {
            this.step -= 1
          } else if (this.step > 2) {
            this.breakTime = this.step - 2
            this.layout = 'timer'
            this.countdown = this.breakTime === 3 ? 1500 : (this.breakTime + 1) * 30
            this.beginTimer()
          }
        } else if (this.layout === 'timer') {
          if (this.breakTime === 0) {
            if (this.pick === 1) {
              this.layout = 'desc'
              this.step = this.pack + 1
            } else {
              this.pick -= 1
              this.countdown = seconds[this.pick - 1]
              this.beginTimer()
            }
          } else {
            this.breakTime = 0
            this.pick = this.drafttimer.cardsPerPack - 1
            this.countdown = seconds[this.pick - 1]
            this.beginTimer()
          }
        }
      }
    },
    handleReset (e) {
      if (e && e.target.index) {
        clearTimeout(t)
        this.stage = 'main'
      }
      this.resetModal = false
    }
  }
}
</script>

<style scope>
page {
  background-color: #fff;
}
.bodyPage {
  padding: 20px;
}
.mainTitle {
  margin-top: 10px;
  font-size: 32px;
}
.mainDesc {
  margin-top: 20px;
  font-size: 14px;
}
.mainSettingTitle {
  margin-top: 20px;
  font-weight: bold;
}
checkbox {
  margin-top: 10px;
}
.mainInspired {
  font-size: 12px;
  color: silver;
}
.timerText {
  text-align: center;
  width: 100%;
}
.countdown {
  font-size: 96px;
}
.btnGroup {
  display: flex;
}
</style>
