import Head from "next/head";
import Image from 'next/image'
import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom';

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { FiUser, FiCalendar, FiClock} from 'react-icons/fi'
import { useRouter } from 'next/router';


interface Post {
  first_publication_date: string | null;
  data: {
    uid: string;
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  readTime: string;
}

export default function Post({ post, readTime }: PostProps) {
  const router  = useRouter()

  function getPostReadTime(post: Post){
    const allText = post.data.content.reduce((acc, contentItem) => {
      const heading = contentItem.heading
      const bodyText= RichText.asText(contentItem.body)
      const contentItemText = `${heading} ${bodyText}`

      return acc + ' ' + contentItemText
    }, '')

    const totalWords = allText.split(' ')
    const readTime = Math.ceil(totalWords.length / 200) // 200 words per minute

    return `${readTime} min`
  }

  if(router.isFallback) {
    return (
      <h2>Carregando...</h2>
    )
  }

  console.log(post.data.banner.url)

  return (
    <>
      <Head>
        <title>{post.data.title}</title>
        <meta name="description" content={post.data.title + ' ' + post.data.subtitle} />
      </Head>
      <main className={styles.container}>
        <div className={styles.postBanner}>
          <Image
            src={post.data.banner.url}
            width={1440}
            height={400}
            className={styles.postImage}
          />
        </div>
        <article className={`${commonStyles.container}
          ${styles.postContent}
        `}>
          <h1>{post.data.title}</h1>
          <div className={commonStyles.postInfos}>
            <span>
            <FiCalendar/>
              { format(new Date(post.first_publication_date), 'dd MMM yyyy'  ,{
                locale: ptBR
              })}
            </span>
            <span>
              <FiUser/>
              {post.data.author}
            </span>
            <span>
              <FiClock/>
              {getPostReadTime(post)}
            </span>
          </div>

          {post.data.content.map(content => {
            return (
              <div key={content.heading}>
                <h2>{content.heading}</h2>
                <div dangerouslySetInnerHTML={{__html: RichText.asHtml(content.body)}}/>
              </div>
            )
          })}

        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.uid'],
      pageSize: 2
    }
  );

  const paths = posts.results.map((post) => {
    return { params: { slug: post.uid }}
  })

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return { heading: content.heading, body: content.body }
      })
    },
  }

  return {
    props: {
      post
    },
    revalidate: 60 // 1 minutes
  }
};
