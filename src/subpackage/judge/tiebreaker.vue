<template>
  <div class="flex-fullheight">
    <mtHeader color="#353535" :showIcon="true"></mtHeader>
    <i-tabs :current="currentTab" @change="changeTab">
      <i-tab key="tabHome" :title="t.common.home"></i-tab>
      <i-tab key="tabPlayer" :title="t.tiebreaker.standing"></i-tab>
      <i-tab key="tabResult" :title="t.tiebreaker.pairing"></i-tab>
      <i-tab key="tabAbout" :title="t.common.about"></i-tab>
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
      >{{t.tiebreaker.fillplayer}}</i-button>
      <div class="flex-space"></div>
      <i-button type="primary" size="small" @click="onEnrollfinish">{{t.tiebreaker.endenroll}}</i-button>
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
              <div style="margin-top: 20px; margin-bottom: 20px;">
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
        style="justify-content: center"
      >
        <wux-prompt
          :visible="tiebreaker.playerlist.length==0"
          :title="t.tiebreaker.no_player_title"
          :text="t.tiebreaker.no_player_text"
        />
      </div>
      <i-swipeout v-for="(item, index) in tiebreaker.playerlist" :key="index" :operateWidth="70">
        <div slot="content">
          <div class="pmps">{{item.pmps}}</div>

          <div class="playerBlock">
            <div class="playerName">
              <div>{{item.playerName}}</div>
              <div class="flex-space"></div>
              <div
                style="color: #80848f"
              >{{item.games_won + ' / ' + (item.games - item.games_won - item.games_drawn) + ' / ' + item.games_drawn}}</div>
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
          <div
            style="color: #444;font-size: 16px"
          >{{tiebreaker.roundno == 0 ? t.tiebreaker.deleteConfirm : t.tiebreaker.dropConfirm}}</div>
          <div>{{t.tiebreaker.confirmText}}</div>
        </div>
      </i-action-sheet>
    </div>

    <div class="flex-fullheight tab-body" v-if="currentTab == 'tabResult'">
      
      
    </div>

    <div class="flex-fullheight tab-body" v-if="currentTab == 'tabAbout'">
      <div class="title">License</div>
      <div
        class="description"
      >Based on TiebreakerJS by Johannes Kühnel (https://www.kraken.at/), partial modified, licensed under CC BY-NC-SA 4.0. https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh</div>
    </div>

    <i-modal :visible="resetModal" :actions="resetAct" @clickItem="handleReset">
      <div>{{t.tiebreaker.resetDesc}}</div>
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
          class="_input"
          style="width: 80%"
          type="number"
          focus
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
import { $msg } from '../../utils/index'
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
    pmws: 0.0,
    pgws: 0.0,
    omw: 0.0,
    ogw: 0.0,
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
    player.pmws = parseFloat(
      Math.max(0.33, player.pmps / (3 * player.matches))
    )
    player.pgws = parseFloat(
      Math.max(
        0.33,
        (3 * player.games_won + player.games_drawn) / (3 * player.games)
      )
    )
  }
}

function calcOpData (player) {
  let omw = 0
  let ogw = 0
  let foes = player.op.length
  if (foes > 0) {
    for (let i = 0; i < foes; i++) {
      let op = findPlayerByName(player.op[i])
      if (op) {
        omw += op.pmws
        ogw += op.pgws
      }
    }
    omw = omw / foes
    ogw = ogw / foes
  }
  player.omw = omw
  player.ogw = ogw
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

function resultsReady () {
  var results = 0
  this.tiebreaker.matchlist.forEach(function (entry) {
    if (this.tiebreaker.roundno === entry.roundno) {
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
}

function findPlayerByName (playerName) {
  if (playerName) {
    for (let i = 0; i < this.tiebreaker.playerlist.length; i++) {
      if (this.tiebreaker.playerlist[i].playerName === playerName) {
        return players[i]
      }
    }
  }
  return null
}

function getPairings () {
  if (!resultsReady()) return
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
        addMatchResult(bye, 2, 0, 0)
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
            let ma = findPlayerByName(m.player1)
            let mb = findPlayerByName(m.player2)
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
      addMatchResult(bye, 2, 0, 0)
    }
  }
}

function delPairings () {
  while (
    this.tiebreaker.matchlist.length > 0 &&
    this.tiebreaker.matchlist[this.tiebreaker.matchlist.length - 1].roundno ===
      this.tiebreaker.roundno
  ) {
    let match = this.tiebreaker.matchlist.pop()
    let a = findPlayerByName(match.player1)
    a.op.pop()

    let b = null
    if (match.player2 !== 'BYE') {
      b = findPlayerByName(match.player2)
      b.op.pop()
    }
    if (match.games_player1 + match.games_player2 + match.games_drawn > 0) {
      a.matches--
      a.games =
        a.games -
        (match.games_player1 + match.games_player2 + match.games_drawn)
      a.games_won = a.games_won - match.games_player1
      a.games_drawn = a.games_drawn - match.games_drawn
      if (b) {
        b.matches--
        b.games =
          b.games -
          (match.games_player1 + match.games_player2 + match.games_drawn)
        b.games_won = b.games_won - match.games_player2
        b.games_drawn = b.games_drawn - match.games_drawn
      }
      if (match.games_player1 > match.games_player2) {
        a.matches_won--
      } else if (match.games_player1 < match.games_player2) {
        b.matches_won--
      } else {
        a.matches_drawn--
        b.matches_drawn--
      }
    }
    calcData(a)
    calcData(b)
  }
  // 重算omw, ogw
  for (let i = 0; i < this.tiebreaker.playerlist.length; i++) {
    calcOpData(this.tiebreaker.playerlist[i])
  }
}

function addMatchResult (match, winsA, winsB, draws) {
  winsA = parseInt(winsA)
  winsB = parseInt(winsB, 10)
  draws = parseInt(draws, 10)
  let games = winsA + winsB + draws
  if (
    winsA > 2 ||
    winsA < 0 ||
    winsB > 2 ||
    winsB < 0 ||
    draws < 0 ||
    winsA + winsB > 3 ||
    games < 1
  ) {
    return
  }
  let A = findPlayerByName(match.player1)
  let B = null
  if (match.player2 !== 'BYE') {
    B = findPlayerByName(match.player2)
  }
  if (match.games_player1 + match.games_player2 + match.games_drawn > 0) {
    A.games =
      A.games -
      (match.games_player1 + match.games_player2 + match.games_drawn) +
      games
    A.games_won = A.games_won - match.games_player1 + winsA
    A.games_drawn = A.games_drawn - match.games_drawn + draws
    if (B) {
      B.games =
        B.games -
        (match.games_player1 + match.games_player2 + match.games_drawn) +
        games
      B.games_won = B.games_won - match.games_player2 + winsB
      B.games_drawn = B.games_drawn - match.games_drawn + draws
    }
    if (match.games_player1 > match.games_player2) {
      A.matches_won--
    } else if (match.games_player1 < match.games_player2) {
      B.matches_won--
    } else {
      A.matches_drawn--
      B.matches_drawn--
    }
    if (winsA > winsB) {
      A.matches_won++
    } else if (winsA < winsB) {
      B.matches_won++
    } else {
      A.matches_drawn++
      B.matches_drawn++
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
    let player = findPlayerByName(item)
    calcOpData(player)
  }
}

export default {
  mpType: 'page',
  data () {
    return {
      currentTab: 'tabHome',
      playerName: '',
      resetModal: false,
      beginModal: false,
      visDeletePlayer: false,
      visDrawer: false,
      selectedId: 0,
      hisplayer: [],
      totalrounds: ''
    }
  },
  computed: {
    ...mapState(['sysinfo', 'tiebreaker']),
    t () {
      return this.$t('pub')
    },
    resetAct () {
      return [
        {
          name: this.t.common.cancel
        },
        {
          name: this.t.common.confirm,
          color: '#ed3f14'
        }
      ]
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
      'wux-prompt': '../../../static/wux/prompt/index'
    }
  },
  onLoad () {
    mta.Page.init()
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
          if (this.playerName.toLowerCase() === 'bye') {
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
          this.playerName = ''
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
      this.resetModal = true
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
          getPairings()
          this.$store.commit('setTiebreaker', this.tiebreaker)
        }
      } finally {
        this.beginModal = false
      }
    },
    handleReset (e) {
      if (e && e.target.index) {
        this.tiebreaker.playerlist = []
        this.tiebreaker.matchlist = []
        this.tiebreaker.roundno = 0
        this.$store.commit('setTiebreaker', this.tiebreaker)
        $msg({
          content: this.t.common.success,
          type: 'info'
        })
      }
      this.resetModal = false
    },
    onDeletePlayer (e) {
      if (e.mp.currentTarget.dataset.id) {
        this.selectedId = e.mp.currentTarget.dataset.id
        this.visDeletePlayer = true
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
            if (this.selectedId === this.tiebreaker.playerlist[i].id) {
              this.tiebreaker.playerlist[i].isdrop = 1
              this.$store.commit('setTiebreaker', this.tiebreaker)
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
    onEnrollfinish () {
      console.log(this.tiebreaker)
      if (this.tiebreaker.roundno === 0) {
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
      }
    }
  },
  mounted () {}
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
</style>
