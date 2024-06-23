import { I18nManager, Settings, Platform } from 'react-native';
import en from './en';
import pt_BR from './pt_BR'

class Trans {
    static defaultLang = 'en';
    static langs = {
        en,
        pt_BR
    };
    static langsKeys = Object.keys(this.langs);
    static currencies = {
        [this.langsKeys[0]]:'USD',
        [this.langsKeys[1]]:'BRL'
    };
    static getDeviceLocale(){
        let currentLocale = 'en';

        if (Platform.OS === 'ios') {
            const settings = Settings.get('AppleLocale');
            const locale = settings || settings?.[0]
            if (locale) currentLocale = locale;
        } else {
            const locale = I18nManager.getConstants().localeIdentifier;
            if (locale) currentLocale = locale;
        }
        return currentLocale || this.defaultLang;
    }

    static getLocaleCurrency(locale){
        return this.currencies[locale || this.getDeviceLocale()] || this.currencies[this.defaultLang];
    }
    
    static getCurrencySymbol (locale, currency) {
        return (0).toLocaleString(
          locale || this.getDeviceLocale().replace("_","-"),
          {
            style: 'currency',
            currency: currency || this.getLocaleCurrency(),
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }
        ).replace(/\d/g, '').trim()
      }

    

    static t(v) {
        return (this.langs[this.getDeviceLocale()]||this.langs[this.defaultLang]||{})[v] || v;
    }
}


export default Trans; 