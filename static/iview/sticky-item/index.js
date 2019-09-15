Component({
  externalClasses: ['i-class'],
  properties: {
    fixedTop: {
      type: String,
      value: '0'
    }
  },
  options: {
    multipleSlots: true
  },
  relations: {
    '../sticky/index': {
      type: 'parent'
    }
  },
  data: {
    top: 0,
    height: 0,
    isFixed: false,
    index: -1
  },
  methods: {
    updateScrollTopChange (scrollTop) {
      const data = this.data
      let top = data.top

      let fixed = parseFloat(this.data.fixedTop)
      if (isNaN(fixed)) {
        fixed = 0
      }
      const height = data.height
      this.setData({
        isFixed: !!((scrollTop >= top - fixed + 10 && scrollTop < top - fixed + height + 10))
      })
    },
    updateDataChange (index) {
      const className = '.i-sticky-item'
      const query = wx.createSelectorQuery().in(this)
      query.select(className).boundingClientRect((res) => {
        if (res) {
          console.log(res)
          this.setData({
            top: res.top,
            height: res.height,
            index: index
          })
        }
      }).exec()
    }
  }
})
