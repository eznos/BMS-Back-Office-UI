import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);
import th from 'vuetify/lib/locale/th'
export default new Vuetify({
    lang: {
        locales: { th },
        current: 'th',
      },
      icons: {
        iconfont: 'md',
      },
    theme: {
        themes: {
            light: {
                primary: '#FFAB97',
                secondary: '#b0bec5',
                accent: '#8c9eff',
                warning: '#F9F071',
                error: '#b71c1c',
                background: 'rgba(215, 215, 215, 0.4)',
            },
            options: {
                customProperties: true
            },
        },
    },
});
