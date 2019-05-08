import { $Message, $Toast } from '../../static/iview/base/index'
function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function getCurrentPageUrl () {
  var pages = getCurrentPages() // 获取加载的页面
  var currentPage = pages[pages.length - 1] // 获取当前页面的对象
  var url = currentPage.route // 当前页面url
  return url
}

function intToTime (i) {
  var s = parseInt(i, 10)
  var m = 0
  var h = 0
  var flag = s < 0
  s = Math.abs(s)

  if (s >= 60) {
    m = parseInt(s / 60, 10)
    s = parseInt(s % 60, 10)
  }

  if (m >= 60) {
    h = parseInt(m / 60, 10)
    m = parseInt(m % 60, 10)
  }

  var result = h > 0 ? formatNumber(h) + ':' : ''
  result = result + formatNumber(m) + ':' + formatNumber(s)
  return flag ? '-' + result : result
}

function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export {
  formatNumber,
  formatTime,
  getCurrentPageUrl,
  intToTime,
  $Message as $msg,
  $Toast as $toast
}
