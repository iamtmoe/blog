module.exports = {
  title: 'TMOE\'S BLOG',
  description: 'tmoe\'s blog',
  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name:'baidu-site-verification', content:'41GlPEeYTk'}],
    ['meta', { name:'keywords', content:'vuepress, blog, tmoe'}],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/images/app_icon/app_icon48.jpeg' }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/images/app_icon/app_icon48.jpeg' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  locales: {
    '/': {
      lang: 'en-US',
    },
    '/zh-CN/': {
      lang: 'zh-CN',
    }
  },
  theme: '@vuepress/blog',
  themeConfig: {
      pwa: true,
      nav: [
          {
              text: 'Home',
              link: '/',
          },
          {
              text: 'Tags',
              link: '/tag/',
          },
      ],
      footer: {
        contact: [
          {
            type: 'github',
            link: 'https://github.com/iamtmoe',
          },
        ],
        copyright: [
          {
            text: 'Privacy Policy',
            link: 'https://policies.google.com/privacy?hl=en-US',
          },
          {
            text: 'MIT Licensed | Copyright © tmoe',
            link: '',
          }
        ],
      },
      directories: [
        {
          id: 'post',
          dirname: 'articles',
          path: '/',
          pagination: {
            lengthPerPage: 4
          }
        },
      ],
      sitemap: {
        hostname: 'https://blog.cunzaizhimi.top'
      },
      comment: {
        service: 'vssue',
        owner: 'iamtmoe',
        repo: 'articles',
        clientId: 'd862fa61879084c09bb6',
        clientSecret: '5dccd872d7ecb35fb274cdf5b60f2eed2ed405a7',
        proxy: (url) => `https://cors-anywhere.azm.workers.dev/${url}`,
      }
  }
}