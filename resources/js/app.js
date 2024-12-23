import './bootstrap';
import '../css/app.css';
import 'primeicons/primeicons.css';
import 'paper-css/paper.min.css'

import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { createPinia } from "pinia";
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';

// liff.init({
//     liffId: "2001165902-JR5Z95AG", // Use own liffId
//     withLoginOnExternalBrowser: true
// })
//     .then(() => {
//         if (!liff.isLoggedIn()) {
//             liff.login();
//         }

//         console.log("LIFF Started");
//         console.log(liff.getLanguage());
//         console.log(liff.getVersion());
//         console.log(liff.isInClient());
//         console.log(liff.isLoggedIn());
//         console.log(liff.getOS());
//         console.log(liff.getLineVersion());

//         console.log(liff.getAccessToken());
//         console.log('getIDToken', liff.getIDToken());
//         console.log(liff.getDecodedIDToken());
//         console.log(liff.getContext());
//         liff.getProfile().then(res => console.log(res))


//         // // scanCodeV2 call
//         // liff.scanCodeV2()
//         //     .then((result) => {
//         //         console.log(result)
//         //         // e.g. result = { value: 'Hello LIFF app!' }
//         //     })
//         //     .catch((err) => {
//         //         console.log(err);
//         //     });

//         // // openWindow call
//         // liff.openWindow({
//         //     url: 'https://line.me',
//         //     external: true,
//         // });

//         // // Logout when login ??
//         // if (liff.isLoggedIn()) {
//         // liff.logout();
//         //     window.location.reload();
//         // }

//         // // get access token
//         // if (!liff.isLoggedIn() && !liff.isInClient()) {
//         //     window.alert('To get an access token, you need to be logged in. Tap the "login" button below and try again.');
//         // } else {
//         //     const accessToken = liff.getAccessToken();
//         //     console.log(accessToken);
//         // }

//         // // get id token
//         // const idToken = liff.getIDToken();
//         // console.log(idToken); // print raw idToken object

//         // // get decoded id token
//         // const idToken = liff.getDecodedIDToken();
//         // console.log(idToken); // print decoded idToken object

//         // // get friend ship
//         // liff.getFriendship().then((data) => {

//         //     // error : There is no login bot linked to this channel

//         //     console.log(data)

//         //     if (data.friendFlag) {
//         //         // something you want to do
//         //     }
//         // });

//         // // For example, if the endpoint URL of the LIFF app is https://example.com/path1?q1=v1 and its LIFF ID is 1234567890-AbcdEfgh
//         // liff.permanentLink
//         //     .createUrlBy("https://badmintonparty.test/path1?q1=v1")
//         //     .then((permanentLink) => {
//         //         // https://liff.line.me/1234567890-AbcdEfgh
//         //         console.log(permanentLink);
//         //     });

//         // liff.permanentLink
//         //     .createUrlBy("https://badmintonparty.test/path1/path2?q1=v1&q2=v2")
//         //     .then((permanentLink) => {
//         //         // https://liff.line.me/1234567890-AbcdEfgh/path2?q=2=v2
//         //         console.log(permanentLink);
//         //     });

//         // Sending messages to the current chat room
//         // liff.sendMessages([
//         //     {
//         //         type: "text",
//         //         text: "Hello, World!",
//         //     },
//         // ])
//         //     .then(() => {
//         //         console.log("message sent");
//         //     })
//         //     .catch((err) => {
//         //         console.log("error", err);
//         //     });

//         // liff.shareTargetPicker(
//         //     [
//         //         {
//         //             type: "text",
//         //             text: "Hello, World!",
//         //         },
//         //     ],
//         //     {
//         //         isMultiple: true,
//         //     }
//         // )
//         //     .then(function (res) {
//         //         if (res) {
//         //             // succeeded in sending a message through TargetPicker
//         //             console.log(`[${res.status}] Message sent!`);
//         //         } else {
//         //             // sending message canceled
//         //             console.log("TargetPicker was closed!");
//         //         }
//         //     })
//         //     .catch(function (error) {
//         //         // something went wrong before sending a message
//         //         console.log("something wrong happen");
//         //     });
//     })
//     .catch((err) => {
//         // Error happens during initialization
//         console.log(err.code, err.message);
//     });

// liff.logout()
// liff.getOS()
// liff.getLanguage()
// liff.getVersion()
// liff.getLineVersion()
// liff.isInClient()
// liff.isLoggedIn()
// liff.isApiAvailable()
// liff.getAccessToken()
// liff.getIDToken()
// liff.getDecodedIDToken()
// liff.getContext()
// liff.getProfile()
// liff.getFriendship()
// liff.permanentLink.setExtraQueryParam()

// liff.line.me
// liff.sendMessages
// liff.openWindow
// liff.shareTargetPicker
// liff.scanCodeV2
// liff.closeWindow
// liff.permanentLink.createUrlBy
// liff.line.me
// liff.i18n.setLang
// LINE LIFF

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {

        const pinia = createPinia();

        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(pinia)
            .use(ZiggyVue)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
