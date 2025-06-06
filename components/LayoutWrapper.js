import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import { navigation } from '@/data/nav'
import CommandPalette from './CommandPalette'
import ThemeSwitch from './ThemeSwitch'
import Typewriter from 'typewriter-effect'
import { useRouter } from 'next/router'
import DropMenu from './DropMenu.js'
import { memo, useMemo } from 'react'
// import Logo from '@/data/logo.svg'
// import MobileNav from './MobileNav'

// Memoize the header links to prevent unnecessary re-renders
const HeaderLinks = memo(({ links }) => (
  <>
    {links.map((link) => (
      <Link
        key={link.title}
        href={link.href}
        className="link-underline rounded py-1 px-2 text-gray-900 hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700 sm:py-2 sm:px-3"
      >
        {link.title}
      </Link>
    ))}
  </>
))

HeaderLinks.displayName = 'HeaderLinks'

const LayoutWrapper = ({ children }) => {
  const router = useRouter()

  // Memoize the decoded and truncated path
  const pathDisplay = useMemo(() => {
    const decodedPath = decodeURIComponent(router.asPath)
    const maxLength = '~/admin/posts/edit/中文测试测试测试'.length
    return decodedPath.length > maxLength
      ? decodedPath.slice(0, maxLength - 3) + '...'
      : decodedPath
  }, [router.asPath])

  return (
    <SectionContainer>
      <div className="flex h-screen flex-col justify-between">
        <header className="flex items-center justify-between py-10">
          <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              {/* <div className="flex items-center justify-between">
                <div className="mr-1">
                  <Logo />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="hidden h-6 text-2xl font-semibold sm:block">
                    {siteMetadata.headerTitle}
                  </div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div> */}
              <div className="text-primary-color dark:text-primary-color-dark flex items-center justify-between text-xl font-semibold">
                <span className="transition-colors hover:text-pink-500">{`~${pathDisplay}`}</span>
                <Typewriter
                  options={{
                    strings: [],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              <HeaderLinks links={headerNavLinks} />
            </div>
            <CommandPalette navigation={navigation} />
            <ThemeSwitch />
            <DropMenu />
            {/* <MobileNav /> */}
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default memo(LayoutWrapper)
