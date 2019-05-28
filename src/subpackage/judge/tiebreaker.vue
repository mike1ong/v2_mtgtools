<template>
  <div class="flex-fullheight">
    <mtHeader color="#353535" :showIcon="true"></mtHeader>
    <i-tabs :current="currentTab" @change="changeTab">
      <i-tab key="tabHome" :title="'　  ' + t.common.home + '  　'"></i-tab>
      <i-tab key="tabPlayer" :title="'　  ' + t.tiebreaker.standing + '  　'" :count="tiebreaker.playerlist.length"></i-tab>
      <i-tab key="tabResult" :title="'　  ' + t.tiebreaker.pairing + '  　'"></i-tab>
      <i-tab key="tabAbout" :title="'　  ' + t.common.about + '  　'"></i-tab>
    </i-tabs>

    <div class="flex-fullheight tab-body" v-if="currentTab == 'tabHome'">
      <div class="title">{{t.tiebreaker.title}}</div>
      <div class="description">{{t.tiebreaker.description}}</div>
      <div class="midtitle">
        <div class="addplayer">{{t.tiebreaker.addplayer}}</div>
        <div class="activeplayers">{{t.tiebreaker.activeplayers}}: {{tiebreaker.playerlist.length}}</div>
        <div class="addhis" @click="onAddhis">{{t.tiebreaker.addhis}}</div>
      </div>
      <input
        class="_input input_playername"
        :placeholder="t.tiebreaker.placeholder"
        :value="playerName"
        @input="onInput"
      >
      <i-button
        type="primary"
        shape="circle"
        size="small"
        @click="onAddPlayer"
      >{{t.tiebreaker.enroll}}</i-button>
      <i-button
        type="ghost"
        shape="circle"
        size="small"
        @click="onFillRandom"
        :disabled="tiebreaker.roundno>0"
      >{{t.tiebreaker.fillplayer}}</i-button>
      <div class="flex-space"></div>
      <i-button type="primary" size="small" @click="onMainButton">{{tiebreaker.roundno==0 ? t.tiebreaker.endenroll : tiebreaker.totalrounds == tiebreaker.roundno ? t.tiebreaker.endgame : t.tiebreaker.nextround}}</i-button>
      <i-button type="error" size="small" @click="onReset">{{t.tiebreaker.reset}}</i-button>
      <i-drawer mode="right" :visible="visDrawer" :mask-closable="false">
        <div
          class="flex-fullheight drawer-container"
          :style="{width: '80vw', 'padding-top': (sysinfo.headAreaHeight + 10 + sysinfo.headAreaMarTop + sysinfo.statusBarHeight) * sysinfo.pixelRatio + 'px'}"
        >
          <scroll-view scroll-y :style="{height: sysinfo.containersHeight + 'px'}">
            <div class="flex-fullheight">
              <i-checkbox-group :current="hisplayer" @change="onHischange">
                <i-checkbox
                  v-for="(item, index) in listHisplayer"
                  :key="index"
                  position="left"
                  :value="item.name"
                  :disabled="item.disabled"
                ></i-checkbox>
              </i-checkbox-group>
              <div class="flex-space"></div>
              <i-button
                type="primary"
                shape="circle"
                size="small"
                :disabled="hisplayer.length==0"
                @click="onAddSelectedHis"
              >{{t.tiebreaker.addSelected}}</i-button>
              <i-button
                type="ghost"
                shape="circle"
                size="small"
                @click="visDrawer=false; hisplayer=[]"
              >{{t.common.cancel}}</i-button>
              <div class="div_space">
                <i-button
                  type="error"
                  shape="circle"
                  size="small"
                  :disabled="hisplayer.length==0"
                  @click="onDelSelectedHis"
                >{{t.tiebreaker.delSelected}}</i-button>
              </div>
            </div>
          </scroll-view>
        </div>
      </i-drawer>
    </div>

    <div class="flex-fullheight" v-if="currentTab == 'tabPlayer'">
      <div
        v-if="tiebreaker.playerlist.length==0"
        class="flex-fullheight"
        style="justify-content: center">
        <wux-prompt
          :visible="tiebreaker.playerlist.length==0"
          :title="t.tiebreaker.no_player_title"
          :text="t.tiebreaker.no_player_text"
        />
      </div>

      <div style="margin-top: 10px;">
        <wux-segmented-control theme="positive" v-if="tiebreaker.playerlist.length>0" :values="ordertype" :default-current="tiebreaker.ordertype" @change="onChangeOrder" />
      </div>      
      <i-swipeout v-for="(item, index) in tiebreaker.playerlist" :key="index" :operateWidth="70" :disabled="item.isdrop == 1">
        <div slot="content">
          <div :class="item.isdrop === 1 ? 'pmps grey':'pmps'">{{item.pmps}}</div>

          <div class="playerBlock">
            <div class="playerName">
              <div>{{item.playerName}}</div>
              <div class="flex-space"></div>
              <div
                style="color: #80848f"
              >{{item.matches_won + ' / ' + (item.matches - item.matches_won - item.matches_drawn) + ' / ' + item.matches_drawn}}</div>
            </div>
            <div
              class="playerDetail"
            >{{'#'+ (index < 9 ? '0' + (index + 1) : (index + 1)) + ' OMW:' + item.omw + ' | PGW:' + item.pgws + ' | OGW:' + item.ogw}}</div>
          </div>
        </div>
        <div slot="button" class="btngroup">
          <div class="floatbtn" :data-id="item.id" @click="onDeletePlayer">
            <i-icon size="32" type="delete_fill"></i-icon>
          </div>
        </div>
      </i-swipeout>
      <i-action-sheet
        :visible="visDeletePlayer"
        :actions="actDeletePlayer"
        show-cancel
        @cancel="visDeletePlayer=false"
        @clickitem="onClickItem"
        mask-closable
      >
        <div slot="header" style="padding: 16px">
          <div style="color: #444;font-size: 16px">{{tiebreaker.roundno == 0 ? t.tiebreaker.deleteConfirm : t.tiebreaker.dropConfirm}}</div>
          <div>{{t.tiebreaker.confirmText}}</div>
        </div>
      </i-action-sheet>
    </div>

    <div class="flex-fullheight tab-body" v-if="currentTab == 'tabResult'">
      <div v-if="tiebreaker.matchlist.length==0" class="flex-fullheight" style="justify-content: center">
        <wux-prompt :visible="tiebreaker.matchlist.length==0" :title="t.tiebreaker.no_match_title" :text="t.tiebreaker.no_match_text"/>
      </div>      

      <div class="flex-fullheight" v-if="tiebreaker.matchlist.length>0">
        <div class="roundTitle">{{currRound}}</div>
        <div>
          <div v-for="(item, index) in tiebreaker.matchlist" :key="index" class="cardMain">
            <wux-card v-if="item.roundno === tiebreaker.roundno" :title="t.tiebreaker.table + ': ' + (item.counter + 1)" :extra="item.games_player1 + ' / ' + item.games_player2 + ' / ' + item.games_drawn">
              <div slot="body" class="cardBody">
                <div class="cardBody_item">
                  <div class="winnerLogo" v-if="item.games_player1 > item.games_player2">
                      <img src="../../../static/img/winner.png" mode="widthFix" class="winnerLogo_img"/>                   
                  </div>
                  <div :class="item.games_player1 > item.games_player2 ? 'player_no player_no_scale' : 'player_no'">
                      {{t.common.player + ' 1'}}
                  </div>
                  <div class="player_name">
                    {{item.player1}}
                  </div>
                </div>

                <div class="cardBody_item">
                  <div class="winnerLogo" v-if="item.games_player1 < item.games_player2">
                      <img src="../../../static/img/winner.png" mode="widthFix" class="winnerLogo_img"/>                   
                  </div>
                  <div :class="item.games_player1 < item.games_player2 ? 'player_no player_no_scale' : 'player_no'">
                    {{t.common.player + ' 2'}}
                  </div>
                  <div class="player_name">
                    {{item.player2}}
                  </div>
                </div>
              </div>
            </wux-card>
          </div>
        </div>
        <div class="flex-space"></div>
        <i-button type="primary" size="small" @click="onMainButton">{{tiebreaker.roundno == tiebreaker.totalrounds ? t.tiebreaker.endgame : t.tiebreaker.nextround}}</i-button>
        <i-button type="ghost" size="small" @click="onAdjustPairing">{{t.tiebreaker.adjust_pairing}}</i-button>
        <div class="div_space">
          <i-button type="error" size="small" @click="onDeletePairing">{{t.tiebreaker.delete_pairing}}</i-button>
        </div>
      </div>
    </div>

    <div class="flex-fullheight tab-body" v-if="currentTab == 'tabAbout'">
      <div class="title">License</div>
      <div
        class="description"
      >Based on TiebreakerJS by Johannes Kühnel (https://www.kraken.at/), partial modified, licensed under CC BY-NC-SA 4.0. https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh</div>
    </div>

    <i-modal :visible="visModal" :actions="actModal" @clickItem="handleModal" :action-mode="modalType == 2 ? 'vertical' : 'horizontal'">
      <div>{{modalType == 0 ? t.tiebreaker.resetDesc : modalType == 2 ? t.tiebreaker.enroll_type : t.tiebreaker.deletePairingDesc}}</div>
    </i-modal>

    <i-modal
      :title="t.tiebreaker.total_round_title"
      :visible="beginModal"
      :actions="beginAct"
      @clickItem="handleBegin"
    >
      <div>{{t.tiebreaker.total_round_desc}}</div>
      <div style="display: flex; width: 100%; justify-content: center;">
        <input
          class="_input _input_modal"
          style="margin-top: 5px;"
          type="number"
          :focus="beginModal"
          :placeholder="t.tiebreaker.total_round_desc"
          :value="totalrounds"
          @input="onInputTotalRounds"
        >
      </div>
    </i-modal>
  </div>
</template>

<script>
import mta from '../../utils/mta_analysis'
import { mapState } from 'vuex'
import mtHeader from '@/components/mtHeader'
import { $msg, format } from '../../utils/index'
import { doRequest } from '../../utils/websocket'
// import { createPlayer } from './js/tiebreaker.js'
let playerid = 100

// 创建结构
function createPlayer (playerName) {
  playerid += 10
  return {
    id: playerid,
    playerName: playerName,
    op: [],
    matches: 0,
    matches_won: 0,
    matches_drawn: 0,
    games: 0,
    games_won: 0,
    games_drawn: 0,
    pmps: 0,
    pmws: '0.000',
    pgws: '0.000',
    omw: '0.000',
    ogw: '0.000',
    isdrop: 0
  }
}

function createMatch (roundno, counter, A, B) {
  let ident = roundno + '_' + counter
  return {
    ident: ident,
    roundno: roundno,
    counter: counter,
    games_player1: 0,
    games_player2: 0,
    games_drawn: 0,
    player1: A,
    player2: B
  }
}

// 常规
function calcData (player) {
  if (player) {
    player.pmps = player.matches_won * 3 + player.matches_drawn
    if (player.matches === 0) {
      player.pmws = '0.000'
    } else {
      player.pmws = parseFloat(Math.max(0.33, player.pmps / (3 * player.matches))).toFixed(3)
    }
    if (player.games === 0) {
      player.pgws = '0.000'
    } else {
      player.pgws = parseFloat(Math.max(0.33, (3 * player.games_won + player.games_drawn) / (3 * player.games))).toFixed(3)
    }
  }
}

function shuffleArray (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

function getNumberOfRounds (players) {
  if (players.length <= 8) {
    return 3
  } else if (players.length <= 16) {
    return 4
  } else if (players.length <= 32) {
    return 5
  } else if (players.length <= 64) {
    return 6
  } else {
    return 7
  }
}

function sortByMatchPointsWithTiebreakers (a, b) {
  if (a.pmps !== b.pmps) {
    return b.pmps - a.pmps
  } else if (a.omw !== b.omw) {
    return b.omw - a.omw
  } else if (a.pgws !== b.pgws) {
    return b.pgws - a.pgws
  } else if (a.ogw !== b.ogw) {
    return b.ogw - a.ogw
  } else {
    return a.id - b.id
  }
}

function sortByName (a, b) {
  let A = a.playerName.toLowerCase()
  var B = b.playerName.toLowerCase()
  if (A < B) { return -1 } else if (A > B) { return 1 } else { return 0 }
}

export default {
  mpType: 'page',
  data () {
    return {
      currentTab: 'tabHome',
      playerName: '',
      visModal: false,
      beginModal: false,
      visDeletePlayer: false,
      visDrawer: false,
      selectedId: 0,
      modalType: 0,
      hisplayer: [],
      totalrounds: ''
    }
  },
  computed: {
    ...mapState(['sysinfo', 'tiebreaker', 'userinfo']),
    t () {
      return this.$t('pub')
    },
    currRound () {
      return format(this.t.tiebreaker.rounds, this.tiebreaker.roundno)
    },
    ordertype () {
      return [this.t.tiebreaker.order_by_rank, this.t.tiebreaker.order_by_name]
    },
    actModal () {
      if (this.modalType === 2) {
        return [
          {name: this.t.tiebreaker.add_with_bye, color: '#2d8cf0'},
          {name: this.t.tiebreaker.add_with_lose, color: '#2d8cf0'},
          {name: this.t.common.cancel}
        ]
      } else {
        return [
          {name: this.t.common.cancel}, {name: this.t.common.confirm, color: '#ed3f14'}
        ]
      }
    },
    beginAct () {
      return [
        {
          name: this.t.common.cancel
        },
        {
          name: this.t.common.confirm,
          color: '#2d8cf0'
        }
      ]
    },
    actDeletePlayer () {
      if (this.tiebreaker.roundno === 0) {
        // delete
        return [{ name: this.t.common.delete, color: '#ed3f14' }]
      } else {
        // drop
        return [{ name: this.t.common.drop, color: '#ed3f14' }]
      }
    },
    listHisplayer () {
      let id = 1
      let result = []
      for (let i = 0; i < this.tiebreaker.historylist.length; i++) {
        if (this.tiebreaker.historylist[i]) {
          let flag = false
          for (let j = 0; j < this.tiebreaker.playerlist.length; j++) {
            if (
              this.tiebreaker.historylist[i].toLowerCase() ===
              this.tiebreaker.playerlist[j].playerName.toLowerCase()
            ) {
              flag = true
              break
            }
          }
          if (flag) {
            result.push({
              id: id,
              name: this.tiebreaker.historylist[i],
              disabled: true
            })
          } else {
            result.push({
              id: id,
              name: this.tiebreaker.historylist[i],
              disabled: false
            })
          }
          id += 1
        }
      }
      return result
    }
  },
  config: {
    usingComponents: {
      'i-drawer': '../../../static/iview/drawer/index',
      'i-action-sheet': '../../../static/iview/action-sheet/index',
      'i-tabs': '../../../static/iview/tabs/index',
      'i-tab': '../../../static/iview/tab/index',
      'i-button': '../../../static/iview/button/index',
      'i-modal': '../../../static/iview/modal/index',
      'i-message': '../../../static/iview/message/index',
      'i-swipeout': '../../../static/iview/swipeout/index',
      'i-icon': '../../../static/iview/icon/index',
      'i-cell': '../../../static/iview/cell/index',
      'i-cell-group': '../../../static/iview/cell-group/index',
      'i-checkbox': '../../../static/iview/checkbox/index',
      'i-checkbox-group': '../../../static/iview/checkbox-group/index',
      'wux-prompt': '../../../static/wux/prompt/index',
      'wux-segmented-control': '../../../static/wux/segmented-control/index',
      'wux-card': '../../../static/wux/card/index'
    }
  },
  onLoad (options) {
    console.log(options)
    mta.Page.init()
    if (options && options.source) {
      doRequest('tiebreaker/getdata', {source: options.source}, (result) => {
        if (result && result.playerlist && result.matchlist && result.playerlist.length > 0) {
          if (result.openid && result.openid === this.userinfo.openid) {
            return
          }
          this.tiebreaker.roundno = result.roundno
          this.tiebreaker.playerlist = result.playerlist
          this.tiebreaker.matchlist = result.matchlist
          this.tiebreaker.totalrounds = result.totalrounds
          this.tiebreaker.ordertype = result.ordertype
        }
      })
    }
  },
  components: {
    mtHeader
  },
  methods: {
    changeTab (e) {
      this.currentTab = e.mp.detail.key
    },
    onAddhis (e) {
      if (this.tiebreaker.historylist.length > 0) {
        this.visDrawer = true
      } else {
        $msg({
          content: this.t.tiebreaker.nohis,
          type: 'error'
        })
      }
    },
    onFillRandom (e) {
      if (this.tiebreaker.roundno > 0) {
        return
      }
      let name = this.t.common.player
      for (let sno = 1; sno <= 8; sno++) {
        let flag = false
        let sname = name + ' ' + sno
        for (let i = 0; i < this.tiebreaker.playerlist.length; i++) {
          if (
            this.tiebreaker.playerlist[i].playerName.toLowerCase() ===
            sname.toLowerCase()
          ) {
            flag = true
            break
          }
        }
        if (!flag) {
          this.tiebreaker.playerlist.push(createPlayer(sname))
        }
      }
      this.$store.commit('setTiebreaker', this.tiebreaker)
      $msg({
        content: this.t.common.success,
        type: 'info'
      })
    },
    onAddPlayer (e) {
      if (this.playerName) {
        this.playerName = this.playerName.trim()
        try {
          // reserved name
          if (this.playerName.toLowerCase() === 'bye' || this.playerName.toLowerCase() === 'lose') {
            $msg({
              content: this.t.tiebreaker.reservedname,
              type: 'error'
            })
            return
          }
          // duplicated name
          let flag = false
          for (let i = 0; i < this.tiebreaker.playerlist.length; i++) {
            if (
              this.tiebreaker.playerlist[i].playerName.toLowerCase() ===
              this.playerName.toLowerCase()
            ) {
              flag = true
              break
            }
          }
          if (flag) {
            $msg({
              content: this.t.tiebreaker.duplicatedname,
              type: 'error'
            })
            return
          }
          // add player
          if (this.tiebreaker.roundno > 0) {
            this.modalType = 2
            this.visModal = true
            return
          }
          this.tiebreaker.playerlist.push(createPlayer(this.playerName))
          flag = false
          for (let i = 0; i < this.tiebreaker.historylist.length; i++) {
            if (
              this.tiebreaker.historylist[i].toLowerCase() ===
              this.playerName.toLowerCase()
            ) {
              flag = true
              break
            }
          }
          if (!flag) {
            this.tiebreaker.historylist.push(this.playerName)
          }
          this.$store.commit('setTiebreaker', this.tiebreaker)
          $msg({
            content: this.t.common.success,
            type: 'info'
          })
        } finally {
          if (this.tiebreaker.roundno === 0) {
            this.playerName = ''
          }
        }
      }
    },
    onInput (e) {
      this.playerName = e.mp.detail.value
    },
    onInputTotalRounds (e) {
      this.totalrounds = e.mp.detail.value
    },
    onReset (e) {
      this.modalType = 0
      this.visModal = true
    },
    handleBegin (e) {
      try {
        if (e && e.target.index) {
          // 校验总局数
          if (!this.totalrounds || isNaN(parseInt(this.totalrounds, 10))) {
            $msg({
              content: this.t.tiebreaker.invalid_total_round,
              type: 'error'
            })
            return
          }
          this.tiebreaker.totalrounds = parseInt(this.totalrounds, 10)
          if (this.tiebreaker.totalrounds > 20) {
            this.tiebreaker.totalrounds = 20
          } else if (this.tiebreaker.totalrounds < 1) {
            this.tiebreaker.totalrounds = 1
          }
          this.tiebreaker.matchlist = []
          this.tiebreaker.roundno = 1
          this.getPairings()
          this.$store.commit('setTiebreaker', this.tiebreaker)
          $msg({
            content: this.t.tiebreaker.pairing_created,
            type: 'info'
          })
          this.currentTab = 'tabResult'
        }
      } finally {
        this.beginModal = false
      }
    },
    handleModal (e) {
      if (e) {
        let idx = e.target.index
        if (this.modalType === 0 && idx === 1) {
          this.tiebreaker.playerlist = []
          this.tiebreaker.matchlist = []
          this.tiebreaker.roundno = 0
          this.$store.commit('setTiebreaker', this.tiebreaker)
          $msg({
            content: this.t.common.success,
            type: 'info'
          })
        } else if (this.modalType === 1 && idx === 1) {
          // delete pairing
          this.delPairings()
        } else if (this.modalType === 2) {
          if (!this.playerName) return
          try {
            if (idx === 0) {
              // grant bye
              this.tiebreaker.playerlist.push(createPlayer(this.playerName))
              let flag = false
              for (let i = 0; i < this.tiebreaker.historylist.length; i++) {
                if (this.tiebreaker.historylist[i].toLowerCase() === this.playerName.toLowerCase()) {
                  flag = true
                  break
                }
              }
              if (!flag) {
                this.tiebreaker.historylist.push(this.playerName)
              }

              let roundno = this.tiebreaker.roundno
              for (let i = this.tiebreaker.matchlist.length - 1; i >= 0; i--) {
                let match = this.tiebreaker.matchlist[i]
                if (roundno === match.roundno) {
                  let bye = createMatch(
                    roundno,
                    match.counter + 1,
                    this.playerName,
                    'BYE'
                  )
                  this.tiebreaker.matchlist.splice(i + 1, 0, bye)
                  this.addMatchResult(bye, 2, 0, 0)
                  roundno--
                }
              }
              this.$store.commit('setTiebreaker', this.tiebreaker)
              $msg({
                content: this.t.common.success,
                type: 'info'
              })
            } else if (idx === 1) {
              // grant loss
              this.tiebreaker.playerlist.push(createPlayer(this.playerName))
              let flag = false
              for (let i = 0; i < this.tiebreaker.historylist.length; i++) {
                if (this.tiebreaker.historylist[i].toLowerCase() === this.playerName.toLowerCase()) {
                  flag = true
                  break
                }
              }
              if (!flag) {
                this.tiebreaker.historylist.push(this.playerName)
              }
              this.$store.commit('setTiebreaker', this.tiebreaker)
              $msg({
                content: this.t.common.success,
                type: 'info'
              })
            }
          } finally {
            this.playerName = ''
          }
        }
      }
      this.visModal = false
    },
    onDeletePairing (e) {
      this.modalType = 1
      this.visModal = true
    },
    onDeletePlayer (e) {
      if (e.mp.currentTarget.dataset.id) {
        this.selectedId = e.mp.currentTarget.dataset.id
        for (let i = 0; i < this.tiebreaker.playerlist.length; i++) {
          if (this.selectedId === this.tiebreaker.playerlist[i].id) {
            if (this.tiebreaker.playerlist[i].isdrop === 0) {
              this.visDeletePlayer = true
              break
            }
          }
        }
      }
    },
    onClickItem (e) {
      if (this.selectedId) {
        if (this.tiebreaker.roundno === 0) {
          // delete
          for (let i = 0; i < this.tiebreaker.playerlist.length; i++) {
            if (this.selectedId === this.tiebreaker.playerlist[i].id) {
              this.tiebreaker.playerlist.splice(i, 1)
              this.$store.commit('setTiebreaker', this.tiebreaker)
              break
            }
          }
        } else {
          // drop
          for (let i = 0; i < this.tiebreaker.playerlist.length; i++) {
            let player = this.tiebreaker.playerlist[i]
            if (this.selectedId === player.id) {
              if (player.isdrop === 0) {
                for (let j = 0; j < this.tiebreaker.matchlist.length; j++) {
                  let match = this.tiebreaker.matchlist[j]
                  if (match.roundno === this.tiebreaker.roundno && ((match.player1 === player.playerName) || (match.player2 === player.playerName))) {
                    if (match.games_player1 + match.games_player2 + match.games_drawn === 0) {
                      // let op win
                      if (match.player1 === player.playerName) {
                        this.addMatchResult(match, 0, 2, 0)
                      } else {
                        this.addMatchResult(match, 2, 0, 0)
                      }
                    }
                    break
                  }
                }
                player.isdrop = 1
                this.$store.commit('setTiebreaker', this.tiebreaker)
              }
              break
            }
          }
        }
      }
      this.visDeletePlayer = false
    },
    onHischange (e) {
      if (e.mp.detail.value) {
        console.log(e.mp.detail.value)
        let name = e.mp.detail.value
        let idx = this.hisplayer.indexOf(name)
        if (idx === -1) {
          this.hisplayer.push(name)
        } else {
          this.hisplayer.splice(idx, 1)
        }
      }
    },
    onAddSelectedHis () {
      for (let i = 0; i < this.hisplayer.length; i++) {
        let sname = this.hisplayer[i]
        let flag = false
        for (let j = 0; j < this.tiebreaker.playerlist.length; j++) {
          if (
            this.tiebreaker.playerlist[j].playerName.toLowerCase() ===
            sname.toLowerCase()
          ) {
            flag = true
            break
          }
        }
        if (!flag) {
          this.tiebreaker.playerlist.push(createPlayer(sname))
        }
      }
      this.$store.commit('setTiebreaker', this.tiebreaker)
      this.hisplayer = []
      this.visDrawer = false
    },
    onDelSelectedHis () {
      for (let i = 0; i < this.hisplayer.length; i++) {
        let idx = this.tiebreaker.historylist.indexOf(this.hisplayer[i])
        if (idx >= 0) {
          this.tiebreaker.historylist.splice(idx, 1)
        }
      }
      this.$store.commit('setTiebreaker', this.tiebreaker)
      this.hisplayer = []
      this.visDrawer = false
    },
    onMainButton () {
      if (this.tiebreaker.roundno === 0) {
        // remove droped
        for (let i = this.tiebreaker.playerlist.length - 1; i >= 0; i--) {
          let player = this.tiebreaker.playerlist[i]
          if (player.isdrop === 1) {
            this.tiebreaker.playerlist.splice(i, 1)
          }
        }
        //
        if (this.tiebreaker.playerlist.length < 4) {
          $msg({
            content: this.t.tiebreaker.player_not_enough,
            type: 'error'
          })
          return
        }
        // 创建比赛
        this.totalrounds = '' + getNumberOfRounds(this.tiebreaker.playerlist)
        this.beginModal = true
      } else {
        let flag = this.resultsReady()
        if (!flag) {
          $msg({
            content: this.t.tiebreaker.needscore,
            type: 'error'
          })
          return
        }
        if (this.tiebreaker.roundno === this.tiebreaker.totalrounds) {
          // switchTab
          this.currentTab = 'tabPlayer'
        } else {
          // getPairing
          this.tiebreaker.roundno += 1
          this.getPairings()
          this.$store.commit('setTiebreaker', this.tiebreaker)
          $msg({
            content: this.t.tiebreaker.pairing_created,
            type: 'info'
          })
          this.currentTab = 'tabResult'
        }
      }
    },
    onChangeOrder (e) {
      let ordertype = 0
      if (e.mp.detail.key) {
        ordertype = 1
      }
      if (ordertype !== this.tiebreaker.ordertype) {
        this.tiebreaker.ordertype = ordertype
        if (this.tiebreaker.ordertype) {
          this.tiebreaker.playerlist.sort(sortByName)
        } else {
          this.tiebreaker.playerlist.sort(sortByMatchPointsWithTiebreakers)
        }
        this.$store.commit('setTiebreaker', this.tiebreaker)
      }
    },
    calcOpData (player) {
      let omw = 0.0
      let ogw = 0.0
      let foes = player.op.length
      if (foes > 0) {
        for (let i = 0; i < foes; i++) {
          let op = this.findPlayerByName(player.op[i])
          if (op) {
            omw += parseFloat(op.pmws)
            ogw += parseFloat(op.pgws)
          }
        }
        omw = omw / foes
        ogw = ogw / foes
      }
      player.omw = omw.toFixed(3)
      player.ogw = ogw.toFixed(3)
    },
    resultsReady () {
      var results = 0
      let roundno = this.tiebreaker.roundno
      this.tiebreaker.matchlist.forEach(function (entry) {
        if (roundno === entry.roundno) {
          if (
            entry.games_player1 === 0 &&
            entry.games_player2 === 0 &&
            entry.games_drawn === 0
          ) {
            results++
          }
        }
      })
      return results === 0
    },
    addMatchResult (match, winsA, winsB, draws) {
      winsA = parseInt(winsA, 10)
      winsB = parseInt(winsB, 10)
      draws = parseInt(draws, 10)
      let games = winsA + winsB + draws
      if (winsA > 2 || winsA < 0 || winsB > 2 || winsB < 0 || draws < 0 || winsA + winsB > 3 || games < 1) {
        return
      }
      let A = this.findPlayerByName(match.player1)
      let B = null
      if (match.player2 !== 'BYE' && match.player2 !== 'LOSE') {
        B = this.findPlayerByName(match.player2)
      }
      if (match.games_player1 + match.games_player2 + match.games_drawn > 0) {
        A.games = A.games - (match.games_player1 + match.games_player2 + match.games_drawn) + games
        A.games_won = A.games_won - match.games_player1 + winsA
        A.games_drawn = A.games_drawn - match.games_drawn + draws
        if (B) {
          B.games = B.games - (match.games_player1 + match.games_player2 + match.games_drawn) + games
          B.games_won = B.games_won - match.games_player2 + winsB
          B.games_drawn = B.games_drawn - match.games_drawn + draws
        }
        if (match.games_player1 > match.games_player2) {
          A.matches_won--
        } else if (match.games_player1 < match.games_player2) {
          if (B) {
            B.matches_won--
          }
        } else {
          A.matches_drawn--
          if (B) {
            B.matches_drawn--
          }
        }
        if (winsA > winsB) {
          A.matches_won++
        } else if (winsA < winsB) {
          if (B) {
            B.matches_won++
          }
        } else {
          A.matches_drawn++
          if (B) {
            B.matches_drawn++
          }
        }
      } else {
        A.matches++
        A.games += games
        A.games_won += winsA
        A.games_drawn += draws
        if (B) {
          B.matches++
          B.games += games
          B.games_won += winsB
          B.games_drawn += draws

          if (winsA > winsB) {
            A.matches_won++
          } else if (winsA < winsB) {
            B.matches_won++
          } else {
            A.matches_drawn++
            B.matches_drawn++
          }
        } else {
          A.matches_won++
        }
      }
      calcData(A)
      calcData(B)

      let set = new Set()
      for (let i = 0; i < A.op.length; i++) {
        set.add(A.op[i])
      }
      if (B) {
        for (let i = 0; i < B.op.length; i++) {
          set.add(B.op[i])
        }
      }
      for (let item of set) {
        let player = this.findPlayerByName(item)
        this.calcOpData(player)
      }
      match.games_player1 = winsA
      match.games_player2 = winsB
      match.games_drawn = draws

      if (!this.tiebreaker.ordertype) {
        this.tiebreaker.playerlist.sort(sortByMatchPointsWithTiebreakers)
      }
      this.$store.commit('setTiebreaker', this.tiebreaker)
    },
    findPlayerByName (playerName) {
      if (playerName) {
        for (let i = 0; i < this.tiebreaker.playerlist.length; i++) {
          if (this.tiebreaker.playerlist[i].playerName === playerName) {
            return this.tiebreaker.playerlist[i]
          }
        }
      }
      return null
    },
    getPairings () {
      if (!this.resultsReady()) return
      let needPairing = []
      this.tiebreaker.playerlist.forEach(function (p) {
        if (p.isdrop === 0) {
          needPairing.push(p)
        }
      })
      if (needPairing.length === 0) {
        return
      }
      let counter = 0
      if (this.tiebreaker.roundno === 1) {
        shuffleArray(needPairing)
        while (needPairing.length > 0) {
          let a = needPairing.pop()
          let b = null
          if (needPairing.length > 0) {
            b = needPairing.pop()
            this.tiebreaker.matchlist.push(
              createMatch(
                this.tiebreaker.roundno,
                counter,
                a.playerName,
                b.playerName
              )
            )
            a.op.push(b.playerName)
            b.op.push(a.playerName)
          } else {
            let bye = createMatch(
              this.tiebreaker.roundno,
              counter,
              a.playerName,
              'BYE'
            )
            this.tiebreaker.matchlist.push(bye)
            this.addMatchResult(bye, 2, 0, 0)
          }
          counter++
        }
      } else {
        needPairing.sort(sortByMatchPointsWithTiebreakers)

        let retry = 0
        while (needPairing.length > 1) {
          let a = needPairing[0]
          let b = null
          let retryFlag = false

          let offset = 0
          let played = false
          do {
            played = false
            offset++
            if (needPairing.length > offset) {
              b = needPairing[offset]
              for (var j = 0; j < a.op.length; j++) {
                if (a.op[j] === b.playerName) {
                  played = true
                  break
                }
              }
            } else {
              if (needPairing.length === 2 && counter > 0 && retry < 3) {
                let m = this.tiebreaker.matchlist.pop()
                let ma = this.findPlayerByName(m.player1)
                let mb = this.findPlayerByName(m.player2)
                ma.op.pop()
                mb.op.pop()
                counter--
                retry++
                needPairing.splice(1, 0, ma, mb)
                retryFlag = true
                break
              } else {
                offset = 1
                b = needPairing[1]
              }
            }
          } while (played === true)

          if (retryFlag) {
            continue
          }

          this.tiebreaker.matchlist.push(
            createMatch(
              this.tiebreaker.roundno,
              counter,
              a.playerName,
              b.playerName
            )
          )
          a.op.push(b.playerName)
          b.op.push(a.playerName)
          needPairing.splice(offset, 1)
          needPairing.splice(0, 1)
          counter++
        }
        if (needPairing.length === 1) {
          let a = needPairing.pop()
          let bye = createMatch(
            this.tiebreaker.roundno,
            counter,
            a.playerName,
            'BYE'
          )
          this.tiebreaker.matchlist.push(bye)
          this.addMatchResult(bye, 2, 0, 0)
        }
      }
      this.$store.commit('setTiebreaker', this.tiebreaker)
    },
    delPairings () {
      if (this.tiebreaker.roundno === 0) return
      while (
        this.tiebreaker.matchlist.length > 0 &&
        this.tiebreaker.matchlist[this.tiebreaker.matchlist.length - 1].roundno === this.tiebreaker.roundno
      ) {
        let match = this.tiebreaker.matchlist.pop()
        let a = this.findPlayerByName(match.player1)
        a.op.pop()

        let b = null
        if (match.player2 !== 'BYE' && match.player2 !== 'LOSE') {
          b = this.findPlayerByName(match.player2)
          b.op.pop()
        }
        if (match.games_player1 + match.games_player2 + match.games_drawn > 0) {
          a.matches--
          a.games = a.games - (match.games_player1 + match.games_player2 + match.games_drawn)
          a.games_won = a.games_won - match.games_player1
          a.games_drawn = a.games_drawn - match.games_drawn
          if (b) {
            b.matches--
            b.games = b.games - (match.games_player1 + match.games_player2 + match.games_drawn)
            b.games_won = b.games_won - match.games_player2
            b.games_drawn = b.games_drawn - match.games_drawn
          }
          if (match.games_player1 > match.games_player2) {
            a.matches_won--
          } else if (match.games_player1 < match.games_player2) {
            if (b) {
              b.matches_won--
            }
          } else {
            a.matches_drawn--
            if (b) {
              b.matches_drawn--
            }
          }
        }
        calcData(a)
        calcData(b)
      }
      // 重算omw, ogw
      for (let i = 0; i < this.tiebreaker.playerlist.length; i++) {
        this.calcOpData(this.tiebreaker.playerlist[i])
      }
      this.tiebreaker.roundno--
      if (!this.tiebreaker.ordertype) {
        this.tiebreaker.playerlist.sort(sortByMatchPointsWithTiebreakers)
      }
      this.$store.commit('setTiebreaker', this.tiebreaker)
    }
  },
  mounted () {},
  onShareAppMessage (obj) {
    let randomid = Math.random().toString(36).substr(2)
    let result = {
      title: '',
      path: '/subpackage/judge/teibreaker'
    }
    if (this.tiebreaker.roundno === 0) {
      this.currentTab = 'tabPlayer'
      result.title = 'MtgTools - ' + this.t.tiebreaker.standing
    } else {
      this.currentTab = 'tabResult'
      result.title = 'MtgTools - ' + format(this.t.tiebreaker.rounds, this.tiebreaker.roundno) + ' ' + this.t.tiebreaker.pairing
    }
    if (this.tiebreaker.playerlist.length > 0 || this.tiebreaker.matchlist.length > 0) {
      result.path += '?source=' + randomid
      // doReq
      let param = {
        source: randomid,
        openid: this.userinfo.openid,
        roundno: this.tiebreaker.roundno,
        totalrounds: this.tiebreaker.totalrounds,
        ordertype: this.tiebreaker.ordertype,
        playerlist: this.tiebreaker.playerlist,
        matchlist: this.tiebreaker.matchlist
      }
      doRequest('tiebreaker/setdata', param)
    }
    return result
  }
}
</script>

<style scope>
.midtitle {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
}
.addplayer {
  font-weight: bold;
  flex-grow: 2;
}
.activeplayers {
  flex-grow: 1;
}
.addhis {
  color: #2d8cf0;
  font-weight: bold;
  text-decoration: underline;
}
.input_playername {
  padding-left: 10px;
  margin-top: 10px;
}
.pmps {
  float: left;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 40px;
  background: #ed3f14;
  color: #fff;
  font-size: 20px;
}
.playerBlock {
  margin-left: 50px;
}
.playerName {
  display: flex;
  font-weight: bold;
  font-size: 18px;
}
.playerDetail {
  font-size: 12px;
  word-break: break-all;
  color: #80848f;
}
.btngroup {
  height: 100%;
  width: 100%;
  background: #2db7f5;
}
.floatbtn {
  width: 70px;
  float: left;
  display: flex;
  height: 100%;
  justify-content: center;
  background: #2d8cf0;
  color: #fff;
  align-items: center;
}
.cardMain {
  margin-bottom: 20px;
}
.cardBody {
  display: flex;
}
.cardBody_item {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.player_no {
  font-size: 14px;
  color: #888888;
}
.player_no_scale {
  margin-top: -50rpx;
}
.player_name {
  font-weight: bold;
  text-align: center;
  font-size: 20px;
}
.winnerLogo {
  float: left;
  margin-left: 150rpx;
}
.winnerLogo_img {
  width: 50rpx;
  height: 40rpx;
}
.roundTitle {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
}
.grey {
  background: #80848f;
}
</style>
