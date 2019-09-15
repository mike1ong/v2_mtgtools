<template>
  <div class="bodydiv">
    <mtHeader color="#353535" :showIcon="false">
      <template slot="body">
        <div class="logodiv">
          <img class="logopic" src="../../static/img/logo.png"/>
        </div>
      </template>      
    </mtHeader>
    <div style="display:flex; justify-content: center;">
      <input class="searchbar" :placeholder="t.index.searchBarHint" />
    </div>
    <div style="background-color: #fff; margin-top:10px;">
      <i-grid>
        <i-grid-item @click.stop="test1">
            <i-grid-icon @click.stop="test1">
              <span class="iconfont gridicon icon-user" @click.stop="test1">
              </span>
            </i-grid-icon>
            <i-grid-label @click.stop="test1">Grid</i-grid-label>
        </i-grid-item>
        <i-grid-item @click.stop="test">
            <i-grid-icon @click.stop="test">
              <span class="iconfont gridicon icon-user" @click.stop="test"></span>
            </i-grid-icon>
            <i-grid-label @click.stop="test">Grid</i-grid-label>
        </i-grid-item>
        <i-grid-item @click.stop="test2">
            <i-grid-icon @click.stop="test2">
              <span class="iconfont gridicon icon-user" @click.stop="test2"></span>
            </i-grid-icon>
            <i-grid-label @click.stop="test2">Grid</i-grid-label>
        </i-grid-item>
      </i-grid>

      <i-grid>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
      </i-grid>

      <i-grid>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
      </i-grid>

      <i-grid>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
      </i-grid>
      <i-grid>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
      </i-grid>
      <i-grid>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
        <i-grid-item>
            <i-grid-icon>
              <span class="iconfont gridicon icon-user"></span>
            </i-grid-icon>
            <i-grid-label>Grid</i-grid-label>
        </i-grid-item>
      </i-grid>
    </div>

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
      'i-action-sheet': '../../static/iview/action-sheet/index',
      'i-grid': '../static/iview/grid/index',
      'i-grid-item': '../static/iview/grid-item/index',
      'i-grid-icon': '../static/iview/grid-icon/index',
      'i-grid-label': '../static/iview/grid-label/index'
    }
  },
  onLoad () {
    mta.Page.init()
  },
  components: {
    mtHeader
  },
  methods: {
    test1 () {
      wx.navigateTo({url: '/subpackage/judge/drafttimer'})
    },
    test () {
      wx.navigateTo({url: '/subpackage/judge/tiebreaker'})
    },
    test2 () {
      wx.navigateTo({url: '/subpackage/cards/cards'})
    }
  }
}
</script>

<style scope>
.bodydiv {
  display: flex;
  flex-direction: column;
  background-color: #353535;
}
.logodiv {
  display: flex;
  background-color: #353535;
  justify-content: center;
  padding-top: 10px;
}
.logopic {
  width: 240px;
  height: 120px;
}
.searchbar {
  background-color: #fff;
  height: 40px;
  width: 80%;
  border-radius: 5px;
  padding-left: 10px;
  margin-bottom: 10px;
}
.gridicon {
  font-size: 30px;
  color: #353535;
}
</style>
