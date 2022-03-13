import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);
import th from 'vuetify/lib/locale/th'

Vue.component('my-component', {
    methods: {
        changeLocale() {
            this.$vuetify.lang.current = 'th'
        },
    },
})
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
                // primary: '#FFAB97',
                // secondary: '#b0bec5',
                // accent: '#8c9eff',
                // warning: '#F9F071',
                // error: '#b71c1c',
                // background: 'rgba(215, 215, 215, 0.4)',
                // agree: '#32FFA3',
                primary: '#A23333',
                secondary: '#C98888',
                error: '#B72F2F',
                warning: '#FFB14F',
                agree: '#1AB202',
                // cancel: '#F7E742',
                background: '#DFDDDD',
            },
            options: {
                customProperties: true
            },
        },
    },
    font: {
        family: 'Sarabun',
    }
});
