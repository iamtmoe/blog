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
    "revision": "42b8f211e12c967672e3ee9706f738ba"
  },
  {
    "url": "1970/01/01/indexeddb/index.html",
    "revision": "49d69ec29e0de8a828ef68a87610bbe7"
  },
  {
    "url": "1970/01/01/markdown/index.html",
    "revision": "e99b1cbfc387065bf00aba0b7842d1db"
  },
  {
    "url": "1970/01/01/nuxt简介/index.html",
    "revision": "a0616aa61f74dc22cb5b554e0a91ccc8"
  },
  {
    "url": "1970/01/01/rails启动分析-续/index.html",
    "revision": "f91459ef91862dadf9db23eb54898a25"
  },
  {
    "url": "1970/01/01/rails启动分析/index.html",
    "revision": "acb85c6b89209062222988cfa914aadf"
  },
  {
    "url": "1970/01/01/tmux/index.html",
    "revision": "e678b1b421f8b3c78bf85460ae41a496"
  },
  {
    "url": "1970/01/01/vue组件/index.html",
    "revision": "e3882f969b5d600fc93698f721e16a9e"
  },
  {
    "url": "1970/01/01/一次readable-code实践/index.html",
    "revision": "7fe826a98c20bdb438092c670ae8ac0b"
  },
  {
    "url": "1970/01/01/手写一个简易版的react/index.html",
    "revision": "ff64e804edc5f2a6db616c9f31f5e946"
  },
  {
    "url": "1970/01/01/数据库压测/index.html",
    "revision": "3b039455cbc2eb49ed7134d4e1455590"
  },
  {
    "url": "1970/01/01/来-学scala/index.html",
    "revision": "03be8dcea642e30faf240fabbb102770"
  },
  {
    "url": "1970/01/01/算法/index.html",
    "revision": "3acf35e6bb1caf31e0076be5a56db48d"
  },
  {
    "url": "1970/01/01/解决跨越问题的几种方法/index.html",
    "revision": "3b6e4ed49135ef94d7c65651f42b6205"
  },
  {
    "url": "2021/09/30/pm2部署/index.html",
    "revision": "9873aa522966f6b93f31da0c90aa4dff"
  },
  {
    "url": "2021/10/16/容器部署/index.html",
    "revision": "1d9e26058cc4abe6234552a2bae4644d"
  },
  {
    "url": "2021/10/27/pg查询优化/index.html",
    "revision": "b754e2caadb2b1475306d011b23c24b8"
  },
  {
    "url": "2021/10/28/webhook部署/index.html",
    "revision": "f06361721f9d141cf96e16575ac4dff5"
  },
  {
    "url": "2021/11/01/oauth实践/index.html",
    "revision": "56b660282bf7fbdf819fcd155f9ea59c"
  },
  {
    "url": "2021/11/02/nextjs/index.html",
    "revision": "a82514679f27046f746b80524863a7a2"
  },
  {
    "url": "2022/01/16/use-rust-in-rails-project/index.html",
    "revision": "e5a3bb64bd73652b19fb7fb63f648063"
  },
  {
    "url": "404.html",
    "revision": "6aa06e3b0495881c4985c6675d274d4e"
  },
  {
    "url": "assets/css/0.styles.b1a81329.css",
    "revision": "14d162b3681b8752e5389d70156dca9b"
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
    "url": "assets/js/11.c94438dc.js",
    "revision": "138924df7c722d2fc19d11201d85ef4d"
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
    "url": "assets/js/14.c2aaa784.js",
    "revision": "406dda57482ee47ac61a03c60cada4d8"
  },
  {
    "url": "assets/js/15.2371a98a.js",
    "revision": "eaf10a9819a54bd422adfd0ce07aa9a0"
  },
  {
    "url": "assets/js/16.5d638ec6.js",
    "revision": "56b6f748050b2897b0d5858bf053a484"
  },
  {
    "url": "assets/js/17.064775cd.js",
    "revision": "5a69e87f921ea3ac4d419ca3c7ad369d"
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
    "url": "assets/js/22.ae59b7fe.js",
    "revision": "30388b527884d49ec4d97f8d63c33ce4"
  },
  {
    "url": "assets/js/23.6769ccc9.js",
    "revision": "0828914fa15874abc2b4805b99b4d6de"
  },
  {
    "url": "assets/js/24.bf31fd6d.js",
    "revision": "b77e36b74565e3ef7eee59354257264a"
  },
  {
    "url": "assets/js/25.1c016174.js",
    "revision": "74da536387ffe9c0e7f97a52fa505e05"
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
    "url": "assets/js/30.c61472a2.js",
    "revision": "93da8cedc3d2611faf762c4f4d662a23"
  },
  {
    "url": "assets/js/31.2d770bc9.js",
    "revision": "08311e79c0ef31065acac018f98f78d5"
  },
  {
    "url": "assets/js/32.f5194d27.js",
    "revision": "fcb9a46dce43432980702470bb4c2622"
  },
  {
    "url": "assets/js/33.7fdf41f0.js",
    "revision": "bf087d1b8e93059a4189d70b3a9467e3"
  },
  {
    "url": "assets/js/34.0662a615.js",
    "revision": "9f3417b18198d7431371b06a2c702825"
  },
  {
    "url": "assets/js/35.52316120.js",
    "revision": "37d7faf0d74e0591236385269b208616"
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
    "url": "assets/js/7.f0cc61a0.js",
    "revision": "4c4676402f6313d0c3cd0b63cf795a8b"
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
    "url": "assets/js/app.589cd0b4.js",
    "revision": "e845ce1cc6cfe0b44351b85bc500a2f6"
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
    "revision": "c75feba5a2318028a95b55ebd491ae5a"
  },
  {
    "url": "page/2/index.html",
    "revision": "2b31edc874f7dfe472acf17840e5b629"
  },
  {
    "url": "page/3/index.html",
    "revision": "4287098985ea5f0d2b930aec63b12d04"
  },
  {
    "url": "page/4/index.html",
    "revision": "9455bacc002851aaafab89ef2beb67dd"
  },
  {
    "url": "page/5/index.html",
    "revision": "74e43bd31a3495bd4e51370b36b755dd"
  },
  {
    "url": "page/6/index.html",
    "revision": "6c9425effa19284cd2cd888ffc7ee278"
  },
  {
    "url": "tag/algorithm/index.html",
    "revision": "94777bf82aa7e0d9f745d862c08dd2a7"
  },
  {
    "url": "tag/command-line-tool/index.html",
    "revision": "40244a563057ae186f8bd24f9f8b9260"
  },
  {
    "url": "tag/deploy/index.html",
    "revision": "340824b2d1ba81eac29db21d906d54d5"
  },
  {
    "url": "tag/docker/index.html",
    "revision": "949067d1ce74906196d021171b94b07d"
  },
  {
    "url": "tag/fastify/index.html",
    "revision": "5acb114f6b32480cd8ed9ca366595682"
  },
  {
    "url": "tag/flutter/index.html",
    "revision": "89db73a6c7be5403619e2cc3e353fd43"
  },
  {
    "url": "tag/index.html",
    "revision": "23a4d240758ed7050f40008fbb00de0e"
  },
  {
    "url": "tag/indexedDB/index.html",
    "revision": "232165e6570808f172fc8ac316e4ac36"
  },
  {
    "url": "tag/k8s/index.html",
    "revision": "30ff87d484881d88abfc50f806809b17"
  },
  {
    "url": "tag/markdown/index.html",
    "revision": "1e98f1fa958b0e6f3b1a172abb1f0151"
  },
  {
    "url": "tag/nextjs/index.html",
    "revision": "a56fc282c331e6cd252cacee9c786d26"
  },
  {
    "url": "tag/nuxt/index.html",
    "revision": "0bb066e024bca8322b876ff78906c334"
  },
  {
    "url": "tag/oauth/index.html",
    "revision": "cfd6dcfca2b67d68ed2e3b7dc0f71bc5"
  },
  {
    "url": "tag/pm2/index.html",
    "revision": "61d26f324176841d31720fa335dede23"
  },
  {
    "url": "tag/postgres/index.html",
    "revision": "84ede83cc42735b0614b852ff77321fd"
  },
  {
    "url": "tag/rails/index.html",
    "revision": "dc83d3b0f2065e6975898c10bd72f7a5"
  },
  {
    "url": "tag/react/index.html",
    "revision": "7e0af738b132c48e211fa00fa01132a3"
  },
  {
    "url": "tag/rust/index.html",
    "revision": "02f6b08e59a6a16cf75dba58cdeabc09"
  },
  {
    "url": "tag/scala/index.html",
    "revision": "f28c68f8d58c1727ab6268aa9b21d4a7"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "375eab663903df29cf952a2dd050e5ba"
  },
  {
    "url": "tag/webhook/index.html",
    "revision": "f3bda9f3c2f0cd51f6affab108b9fe91"
  },
  {
    "url": "tag/代码规范/index.html",
    "revision": "f91effde6676a3e2290868b282b3e939"
  },
  {
    "url": "tag/跨域/index.html",
    "revision": "b0b0705896ff97bec00fe1873399c664"
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
