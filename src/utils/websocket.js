let socketOpen = false
let retryCount = 0
let retryTimer = null
let heartTimer = null
let socketTask = null
let funclist = {}

function openSocket (cb) {
  if (socketOpen) { return }
  socketTask = wx.connectSocket({
    // url: 'wss://data.mtgtools.cn',
    url: 'ws://127.0.0.1:6001',
    method: 'GET'
  })

  wx.onSocketOpen(() => {
    socketOpen = true
    retryCount = 0

    heartbeat()
    cb && cb()
  })

  wx.onSocketError(function (err) {
    console.log(err)
    socketOpen = false

    reconnect(cb)
  })

  wx.onSocketMessage(function (res) {
    console.log('<== ', res.data)
    doResponse(res.data)
  })

  wx.onSocketClose(function (res) {
    console.log(res)
    socketOpen = false

    if (res.code > 0) {
      reconnect(cb)
    }
  })
}

function reconnect (cb) {
  clearTimeout(retryTimer)
  retryCount += 1
  retryTimer = setTimeout(() => {
    openSocket(cb)
  }, 3000 * retryCount)
}

function heartbeat () {
  clearTimeout(heartTimer)
  heartTimer = setTimeout(() => {
    heartbeat()
  }, 600 * 1000)
  if (!socketOpen || !socketTask) {
    return
  }
  doRequest('ping', null, () => {})
}

function sendMessage (obj) {
  if (!socketOpen || !socketTask) {
    obj.complete && obj.complete()
    obj.fail && obj.fail({
      code: -1
    })
    return
  }
  if (obj.data) {
    let data = obj.data
    if (typeof obj.data === 'object') {
      data = JSON.stringify(obj.data)
    }
    console.log(' ==> ' + data)
    socketTask.send({
      data: data,
      success: obj.success,
      fail: obj.fail,
      complete: obj.complete
    })
  }
}

function doRequest (act, param, cb) {
  let path = 'root'
  let cmd = act
  if (act.indexOf('/') >= 0) {
    [path, cmd] = act.split('/')
  }
  let req = {
    path, cmd
  }
  if (param) {
    req.param = param
  }
  if (cb) {
    funclist[path + '.' + cmd] = cb
  }
  sendMessage({data: req})
}

function doResponse (result) {
  try {
    if (!result) {
      throw new Error('doResponse: invalid result')
    }
    result = JSON.parse(result)
    if (!funclist[result.path + '.' + result.cmd]) {
      console.log('doResponse hits unimplemented')
      return
    }
    funclist[result.path + '.' + result.cmd](result.result)
  } catch (e) {
    console.log('doResponse execute failed ', e)
  }
}

export {
  openSocket,
  sendMessage,
  doRequest
}
