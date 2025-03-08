/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "1970/01/01/flutter快速开始/index.html",
    "revision": "7f413cf6924ce24ec739fb20de42153c"
  },
  {
    "url": "1970/01/01/indexeddb/index.html",
    "revision": "7bd5f17c2c47467469e4951daac082fa"
  },
  {
    "url": "1970/01/01/markdown/index.html",
    "revision": "1e1815b86ad59be2b49ec47a79a833a8"
  },
  {
    "url": "1970/01/01/nuxt简介/index.html",
    "revision": "b6ad6cc1d4ab8eb4de6b41e11eb137d4"
  },
  {
    "url": "1970/01/01/rails启动分析-续/index.html",
    "revision": "4a2e407fd9351130eb4c8ddf10306b54"
  },
  {
    "url": "1970/01/01/rails启动分析/index.html",
    "revision": "2fe0d6c3eae95a805ade42dfab016546"
  },
  {
    "url": "1970/01/01/tmux/index.html",
    "revision": "f81bd4f32e8865d21903ffe440250b23"
  },
  {
    "url": "1970/01/01/vue组件/index.html",
    "revision": "f9d533b8803f8b1e5a1b20cb6d8a1208"
  },
  {
    "url": "1970/01/01/一次readable-code实践/index.html",
    "revision": "9bbd77c445edcddccd5ab5ea87dafd2b"
  },
  {
    "url": "1970/01/01/手写一个简易版的react/index.html",
    "revision": "dd8fa5a6d4a18679b132c784c1830ba3"
  },
  {
    "url": "1970/01/01/数据库压测/index.html",
    "revision": "df49c3ae0c41400786c146d9f58409f2"
  },
  {
    "url": "1970/01/01/来-学scala/index.html",
    "revision": "1c34e7c6c50b2ef72279cf9213845669"
  },
  {
    "url": "1970/01/01/算法/index.html",
    "revision": "a94539c13da52cdbb2321c934b19ecb9"
  },
  {
    "url": "1970/01/01/解决跨越问题的几种方法/index.html",
    "revision": "408f6ea3f47b485d2906e1b90c061e90"
  },
  {
    "url": "2021/09/30/pm2部署/index.html",
    "revision": "1f14a15080ee29bbefa7475fa1215696"
  },
  {
    "url": "2021/10/16/容器部署/index.html",
    "revision": "8a1fecd23f3b496cd574348606cdf96f"
  },
  {
    "url": "2021/10/27/pg查询优化/index.html",
    "revision": "5a1a8fff557f42b1ac64f49bf0304ea9"
  },
  {
    "url": "2021/10/28/webhook部署/index.html",
    "revision": "569876ecd1ed5092dc9cd4feb73c3a20"
  },
  {
    "url": "2021/11/01/oauth实践/index.html",
    "revision": "74b46f848c4f3c1ace8967b0aee3127d"
  },
  {
    "url": "2021/11/02/nextjs/index.html",
    "revision": "d615100e5639a10fa0b7f5664880d76d"
  },
  {
    "url": "2022/01/16/use-rust-in-rails-project/index.html",
    "revision": "0261bb97e73bb172473fd4147c7576e4"
  },
  {
    "url": "2023/11/05/基于-phaser-tutorial-改造的一个h5小游戏/index.html",
    "revision": "d02fe084714ab8d261e2bba82c9d6b3f"
  },
  {
    "url": "404.html",
    "revision": "f16c9216b3d91c862a363d6200c899dc"
  },
  {
    "url": "assets/css/0.styles.db20579b.css",
    "revision": "ff6c264c3d5b148c55b32bafd1d09bf5"
  },
  {
    "url": "assets/fonts/EJRVQgYoZZY2vCFuvAFbzr-_dSb_nco.9738e026.woff2",
    "revision": "9738e026c7397b4e3b543ae7f1cf4b6c"
  },
  {
    "url": "assets/fonts/EJRVQgYoZZY2vCFuvAFWzr-_dSb_.b450bfca.woff2",
    "revision": "b450bfca16a8beb05580180de7b678f0"
  },
  {
    "url": "assets/img/acr.9eb62de8.png",
    "revision": "9eb62de82ae04a3cbe5d6c3acace4965"
  },
  {
    "url": "assets/img/cross-origin-error-ajax.8c3651e1.png",
    "revision": "8c3651e113a35ab94c211b853d47b479"
  },
  {
    "url": "assets/img/cross-origin-error-subdomain.3b68510a.png",
    "revision": "3b68510ad8c4ae1a4661bed463936cee"
  },
  {
    "url": "assets/img/flutter-demo.2ccedd65.png",
    "revision": "2ccedd65eed69389131b89f3668de5db"
  },
  {
    "url": "assets/img/flutter-doc-about-android-monitor.b44cc5fd.png",
    "revision": "b44cc5fdf5d80706668c2b86e94cd2ff"
  },
  {
    "url": "assets/img/github-action.134703be.png",
    "revision": "134703be90bc7a80ef51d32c478d27f2"
  },
  {
    "url": "assets/img/jsonp-alert.0ebaa9de.png",
    "revision": "0ebaa9de41bb3548ed5c8ed3650e5413"
  },
  {
    "url": "assets/img/k8s-pod-roll-update.52b233fc.png",
    "revision": "52b233fca8449f7d9c0b4bf794394bbf"
  },
  {
    "url": "assets/img/myreact.3e2853b2.gif",
    "revision": "3e2853b26ed584b9b336c99a45f5b421"
  },
  {
    "url": "assets/img/nuxt-modern-generate.96d13b03.png",
    "revision": "96d13b03aa092c741117e5ea83996b1e"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/img/ssr-architect.08daea42.png",
    "revision": "08daea42db8838ab4762f25b68dc743a"
  },
  {
    "url": "assets/img/vue-lifecycle.6f2c97f0.png",
    "revision": "6f2c97f045ba988851b02056c01c8d62"
  },
  {
    "url": "assets/js/10.aa1dac21.js",
    "revision": "1310e82726d812a2982ecff4806f3955"
  },
  {
    "url": "assets/js/11.70c977ba.js",
    "revision": "0195c12ffa1995341fe662533a1dde47"
  },
  {
    "url": "assets/js/12.bca8c580.js",
    "revision": "01ccd7785c34ca1cc8d2a72152b5553c"
  },
  {
    "url": "assets/js/13.b618ec97.js",
    "revision": "4b59084e1809c8ff0c531d3da1148fc4"
  },
  {
    "url": "assets/js/14.80ae0e92.js",
    "revision": "d168759e8313ec2b4183048843933543"
  },
  {
    "url": "assets/js/15.1e8d5c02.js",
    "revision": "a4d664fa2ed167e69cb951a28a3c990d"
  },
  {
    "url": "assets/js/16.9fcef108.js",
    "revision": "f25673c28716d9c8156ce143b0cf2f1b"
  },
  {
    "url": "assets/js/17.60290ab1.js",
    "revision": "fa453161bb7c06329fa46158eb5999ad"
  },
  {
    "url": "assets/js/18.bd9b53f4.js",
    "revision": "fa9e2dca93adff4f16d245252442f8c9"
  },
  {
    "url": "assets/js/19.bf170d35.js",
    "revision": "3fc4d21b72edb6433f251dfd23111983"
  },
  {
    "url": "assets/js/20.76d2073a.js",
    "revision": "7c65a56ffffdb085631a7b7b4090f186"
  },
  {
    "url": "assets/js/21.84e35001.js",
    "revision": "d8b20ddfa14e22a1fe018774fb20335d"
  },
  {
    "url": "assets/js/22.9a77eca9.js",
    "revision": "3f36adc5e14ef3d2147f6ac9dcc04543"
  },
  {
    "url": "assets/js/23.eee85973.js",
    "revision": "6ab7148f2993adb82c2133fdd963943f"
  },
  {
    "url": "assets/js/24.af56bcfb.js",
    "revision": "2e509fae35ee1b6c5b658b25441246fa"
  },
  {
    "url": "assets/js/25.b9c14c5d.js",
    "revision": "53787e813282f999dcb2bee09e362877"
  },
  {
    "url": "assets/js/26.31632e5f.js",
    "revision": "9d95852c906ee415343580b386065696"
  },
  {
    "url": "assets/js/27.b62c171d.js",
    "revision": "59397c39703ef1dab807c02bfdacbc13"
  },
  {
    "url": "assets/js/28.c6fdb267.js",
    "revision": "c9eba9f979e6ce0ba0dc976c51f7fad9"
  },
  {
    "url": "assets/js/29.c3073e06.js",
    "revision": "42eb55df4ab5b8d162d78f2fabd1e5e3"
  },
  {
    "url": "assets/js/3.749e8baa.js",
    "revision": "3f706c90c6867224202cca2e3b1bbda6"
  },
  {
    "url": "assets/js/30.8fd564e6.js",
    "revision": "47d4363647f797cb5b034e41fb33bb03"
  },
  {
    "url": "assets/js/31.2d770bc9.js",
    "revision": "08311e79c0ef31065acac018f98f78d5"
  },
  {
    "url": "assets/js/32.a63a63d2.js",
    "revision": "a462f3038223c40a72e978488800825c"
  },
  {
    "url": "assets/js/33.8bc5dfef.js",
    "revision": "b8afbc3138fbe4598373bc61a757607d"
  },
  {
    "url": "assets/js/34.768a88f4.js",
    "revision": "b63056c6d24f267268c453a0b05107e9"
  },
  {
    "url": "assets/js/35.07c0faed.js",
    "revision": "6382760b28816f448edc1f332f70da57"
  },
  {
    "url": "assets/js/36.91bb844e.js",
    "revision": "4381ae8807e3ff0fcf93c2ace5b4854e"
  },
  {
    "url": "assets/js/4.c95f156b.js",
    "revision": "76a206aa6124d49c8b25e05591ad17ff"
  },
  {
    "url": "assets/js/5.1b5f68e5.js",
    "revision": "144b865c5d0614c5cabc417dc503653f"
  },
  {
    "url": "assets/js/6.b5d332af.js",
    "revision": "21e16e517986522d1ec268ad869150c2"
  },
  {
    "url": "assets/js/7.833de25a.js",
    "revision": "dc8d895e928116b07f91ec5c8fd97337"
  },
  {
    "url": "assets/js/8.050f5748.js",
    "revision": "3a14aa1b07d547f28978ff099d24f2b4"
  },
  {
    "url": "assets/js/9.5e1c757e.js",
    "revision": "bd3774e2ccc2cca893def0592e734e51"
  },
  {
    "url": "assets/js/app.c616dceb.js",
    "revision": "c8eec26cbbbc40299127637dc2d38f18"
  },
  {
    "url": "assets/js/vuejs-paginate.c4247c5c.js",
    "revision": "39eed8c320f250eb94cf91410d2f5835"
  },
  {
    "url": "images/app_icon/app_icon48.jpeg",
    "revision": "cfc337edacf7b835e14ce9d92c5e054d"
  },
  {
    "url": "images/other/weixin_souyisou.png",
    "revision": "9cb777c1f1ae4fbbab9465049d095746"
  },
  {
    "url": "index.html",
    "revision": "9898951e679b498ca05d5344a009edef"
  },
  {
    "url": "page/2/index.html",
    "revision": "96ca3afa46c0b9a2954ced92ac7112fd"
  },
  {
    "url": "page/3/index.html",
    "revision": "18d4f74cf50fdc7fa9501a17ab89acbe"
  },
  {
    "url": "page/4/index.html",
    "revision": "5ee33bd24e769a5e5a2e5a6015d24a55"
  },
  {
    "url": "page/5/index.html",
    "revision": "a28e0654d67cb05544046348a54a4679"
  },
  {
    "url": "page/6/index.html",
    "revision": "0b953bf89923e25846a9838b779aae03"
  },
  {
    "url": "tag/algorithm/index.html",
    "revision": "b3941acd05814033e80041cd18b0493a"
  },
  {
    "url": "tag/command-line-tool/index.html",
    "revision": "d150c964f41893c0ca78a69d0cc4d91d"
  },
  {
    "url": "tag/deploy/index.html",
    "revision": "0a0869ab302a16c0c0cf053d7d59c429"
  },
  {
    "url": "tag/docker/index.html",
    "revision": "37bb2399280f69de4e09ed2ce766baad"
  },
  {
    "url": "tag/fastify/index.html",
    "revision": "3aafe191c6463e27825a42e2239e9ca9"
  },
  {
    "url": "tag/flutter/index.html",
    "revision": "16b3ebef0a10a92a3f5b445487fa6591"
  },
  {
    "url": "tag/h5游戏/index.html",
    "revision": "4cfe4317db95ecae1d78805a99d16d49"
  },
  {
    "url": "tag/index.html",
    "revision": "d049382e6e79fd30ef38bf7c7ba00085"
  },
  {
    "url": "tag/indexedDB/index.html",
    "revision": "04a65ccc4cb0ec749b8c45377c25cde5"
  },
  {
    "url": "tag/k8s/index.html",
    "revision": "a608f319149a0937c67e05d7cc25c298"
  },
  {
    "url": "tag/markdown/index.html",
    "revision": "eba8401d53e9c8581ab36df697025ab8"
  },
  {
    "url": "tag/nextjs/index.html",
    "revision": "a16779ab63e6385722b487ddef411589"
  },
  {
    "url": "tag/nuxt/index.html",
    "revision": "ada7d3999598dba6190474e89d2f61c9"
  },
  {
    "url": "tag/oauth/index.html",
    "revision": "d5049e6a82d1702a54d795577b8da9a2"
  },
  {
    "url": "tag/phaser/index.html",
    "revision": "922e771116c95db6bed3a1c21df05e0f"
  },
  {
    "url": "tag/pm2/index.html",
    "revision": "0eaf99dbc2101a6d60e9fd33f0a9e3d3"
  },
  {
    "url": "tag/postgres/index.html",
    "revision": "203ce625d4a9bc03b3b5ac7649805769"
  },
  {
    "url": "tag/rails/index.html",
    "revision": "b1a76f01fc47c6a6bb166c7aa7b02ec7"
  },
  {
    "url": "tag/react/index.html",
    "revision": "09f35036219ff99012f757ed502bc6d2"
  },
  {
    "url": "tag/rust/index.html",
    "revision": "a406492522216f8c95d5122172aa44b4"
  },
  {
    "url": "tag/scala/index.html",
    "revision": "2d20f593a9bfecd952c25f29adeed909"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "8fb65d422a852c90384dac5853965263"
  },
  {
    "url": "tag/webhook/index.html",
    "revision": "f9ab98ec3844759ea0990c7a605e19aa"
  },
  {
    "url": "tag/代码规范/index.html",
    "revision": "9b08938f789efcacd6a8fc09b132762e"
  },
  {
    "url": "tag/跨域/index.html",
    "revision": "1c7fd3e8ed86106f014ab841fbb3c9b2"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
