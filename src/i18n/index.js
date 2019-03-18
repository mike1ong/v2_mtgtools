import Vue from 'vue'
import VueI18n from 'vue-i18n'
import store from '../store'

import cn from './cn'
import en from './en'

Vue.use(VueI18n)
console.log(store.state)
let lang = store.state.lang
if (!lang) {
  lang = 'cn'
}
export default new VueI18n({
  locale: lang,
  messages: {
    'en': en,
    'cn': cn
  }
})
