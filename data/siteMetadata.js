const siteMetadata = {
  title: 'Blog | Tiansuy',
  author: 'Tiansuy Lee',
  headerTitle: "Tiansuy's space station",
  description: 'My personal blog where I share my shit',
  snippets: 'Reuseable code snippets collected by Tiansuy',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: '',
  siteRepo: '',
  siteLogo: '/static/images/logo.png',
  image: '/static/images/avatar.gif',
  socialBanner: '/static/images/twitter-card.png',
  email: 'tiansuy27@gmail.com',
  github: 'https://github.com/tiansuy',
  twitter: '',
  linkedin: '',
  website: 'https://parthdesai.vercel.app',
  locale: 'en-US',
  analytics: {
    plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    simpleAnalytics: false, // true or false
    umamiWebsiteId: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    googleAnalyticsId: 'G-F6V2QTJ628', // e.g. UA-000000-2 or G-XXXXXXX
  },
  newsletter: {
    provider: 'emailOctopus',
  },
  comment: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: 'light',
      inputPosition: 'bottom',
      lang: 'en',
      darkTheme: 'dark',
      themeURL: '',
    },
  },
  socialAccount: {
    twitter: 'none',
  },
}

module.exports = siteMetadata
