import { useRef } from 'react'
import Layout from '@/components/layout'
import Header from '@/components/header'
import Footer from '@/components/footer'
import FancyLink from '@/components/fancyLink'
import { fade } from '@/helpers/transitions'
import { LocomotiveScrollProvider } from 'react-locomotive-scroll'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { NextSeo } from 'next-seo'
import SanityPageService from '@/services/sanityPageService'
import BlockContent from '@sanity/block-content-to-react'
import Link from 'next/link'
import Image from '@/components/image'
import WorkCarousel from '@/components/work-carousel'

const query = `{
  "work": *[_type == "work"]{
    title,
    content,
    category,
    type,
    teaserImage {
      asset-> {
        ...,
      },
      caption,
      alt,
      hotspot {
        x,
        y
      },
    },
    teaserImageThumbnail {
      asset-> {
        ...,
      },
      caption,
      alt,
      hotspot {
        x,
        y
      },
    },
    slug {
      current
    },
    seo {
      ...,
      shareGraphic {
        asset->
      }
    }
  },
}`

const pageService = new SanityPageService(query)

export default function Work(initialData) {
  const { data: { work } } = pageService.getPreviewHook(initialData)()
  const containerRef = useRef(null)
  return (
    <Layout>
      <NextSeo title="Work" />

      <LocomotiveScrollProvider
        options={{ smooth: true, lerp: 0.1 }}
        containerRef={containerRef}
        watch={[]}
      >
        <div data-scroll-container ref={containerRef} id="scroll-container">
          <div data-scroll-section>
            <LazyMotion features={domAnimation}>
              <m.div
                initial="initial"
                animate="enter"
                exit="exit"
                id="sticky"
              >
                <m.main>
                  <WorkCarousel work={work} />
                </m.main>
              </m.div>
            </LazyMotion>
          </div>
        </div>
      </LocomotiveScrollProvider>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const cms = await pageService.fetchQuery(context)

  return {
    props: { ...cms }
  }
}