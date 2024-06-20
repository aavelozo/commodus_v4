import { I18nManager, Settings, Platform } from 'react-native';
import en from './en';
import pt_BR from './pt_BR'

class Trans {
    static getDeviceLanguage(){
        let currentLocale = 'en';

        if (Platform.OS === 'ios') {
            const settings = Settings.get('AppleLocale');
            const locale = settings || settings?.[0]
            if (locale) currentLocale = locale;
        } else {
            const locale = I18nManager.getConstants().localeIdentifier;
            if (locale) currentLocale = locale;
        }

        return currentLocale
    }

    static langs = {
        en,
        pt_BR
    }

    static t(v) {
        return (Trans.langs[Trans.getDeviceLanguage()]||{})[v] || v;
    }
}


export default Trans; 