import Vue from 'vue'
import VueI18n from 'vue-i18n'

import cn from './cn'
import en from './en'

Vue.use(VueI18n)
export default new VueI18n({
  locale: 'en',
  messages: {
    'en': en,
    'cn': cn
  }
})
