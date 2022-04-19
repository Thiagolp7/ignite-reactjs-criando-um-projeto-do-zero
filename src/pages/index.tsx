import { GetStaticProps } from 'next';
import Link from 'next/link'
import { useEffect, useState } from 'react';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiUser, FiCalendar } from 'react-icons/fi'
import Head from 'next/head';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({postsPagination}: HomeProps) {
  const [posts, setPosts] = useState(postsPagination.results)
  const [nextPageUrl, setNextPageUrl] = useState('')

  useEffect( () => {
    setNextPageUrl(postsPagination.next_page)
  } , [])

  async function handleNextPage(){
    const response = await fetch(nextPageUrl)
    .then(res =>  res.json())
    .then(data => data)

    const newNextPageUrl = response.next_page
    const newPostsApi = response.results

    const newPostsFormatted = postsFormatted(newPostsApi)
    const postsUpdated = [...posts, ...newPostsFormatted]

    setPosts(postsUpdated)
    setNextPageUrl(newNextPageUrl)
  }

  function postsFormatted(newPosts: Post[]){
    const posts = newPosts.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author
        }
      }
    })

    return posts
  }

  return (
    <>
      <Head>
        <title>Spacetraveling</title>
      </Head>

      <main className={`${styles.postLinks} ${commonStyles.container}`}>
        {posts.map(post => {
          return (
            <Link
              href={`/post/${post.uid}`}
              key={post.uid}
            >
              <a className={styles.links}>
                <h2>{post.data.title}</h2>
                <p>{post.data.subtitle}</p>
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
                </div>
              </a>
            </Link>
          )
        })}

        { nextPageUrl &&
          <button onClick={() => {handleNextPage()}} >
            Carregar mais posts
          </button> }
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title','posts.author','posts.subtitle'],
      pageSize: 2
    }
  )

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }
  })

  const postsPagination = { next_page: response.next_page , results: posts}

  return {
    props: {
      postsPagination
    },
    revalidate: 60 * 30 // 30 minutes
  }
};
