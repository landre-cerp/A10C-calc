import { createI18n } from 'vue-i18n'
import en from './en-US/index'
import fr from './fr-FR/index'

export default createI18n({
  locale: 'en',
  messages: { en, fr }
})
