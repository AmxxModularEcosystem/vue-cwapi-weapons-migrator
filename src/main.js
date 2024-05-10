import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import {
    createVuesticEssential,
    VaLayout,
    VaNavbar,
    VaNavbarItem,
    VaAlert,
    VaCard,
    VaCardTitle,
    VaCardContent,
    VaFileUpload,
    VaCardActions,
    VaButton,
    VaDivider,
    VaList,
    VaListItem,
    VaListItemSection,
} from "vuestic-ui";
import "vuestic-ui/styles/essential.css";

const app = createApp(App)
app.use(createVuesticEssential({
    components: {
        VaLayout,
        VaNavbar,
        VaNavbarItem,
        VaAlert,
        VaCard,
        VaCardTitle,
        VaCardContent,
        VaFileUpload,
        VaCardActions,
        VaButton,
        VaDivider,
        VaList,
        VaListItem,
        VaListItemSection,
    },
    config: {
        colors: {
            currentPresetName: 'dark',
            presets: {
                dark: {
                    primary: "#3472F0",
                    secondary: "#818992",
                    success: "#66BE33",
                    info: "#3EAAF8",
                    danger: "#F34030",
                    warning: "#FFD952",
                    backgroundPrimary: "#050A10",
                    backgroundSecondary: "#1F262F",
                    backgroundElement: "#131A22",
                    backgroundBorder: "#3D4C58",
                    textPrimary: "#F1F1F1",
                    textInverted: "#0B121A",
                    shadow: "rgba(255, 255, 255, 0.12)",
                    focus: "#49A8FF",
                    transparent: "rgba(0, 0, 0, 0)",
                    backgroundLanding: "#070d14",
                    backgroundLandingBorder: "rgba(43, 49, 56, 0.8)",
                },
            },
        },
    },
}));
app.mount('#app')
