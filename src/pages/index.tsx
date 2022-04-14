import { GetStaticProps } from 'next';
import Link from 'next/link'

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiUser, FiCalendar } from 'react-icons/fi'
import { RichText } from 'prismic-dom';
import { useState } from 'react';

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

  return (
    <main className={styles.container}>
      {posts.map(post => {
        return (
          <Link
            href={`/post/${post.uid}`}
            key={post.uid}
          >
            <a className={styles.links}>
              <h2>{post.data.title}</h2>
              <p>{post.data.subtitle}</p>
              <div>
                <span>
                  <FiCalendar/>
                  {post.first_publication_date}
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

      <button>Carregar mais posts</button>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query(
    [
      Prismic.predicates.at('document.type', 'posts')
    ],
    {
      fetch: ['posts.title','posts.subtitle', 'posts.author', 'posts.content'],
      pageSize: 2
    }
  )

  // console.log(JSON.stringify(response, null, 2))

  const posts = response.results.map(post => {

    return {
      uid: post.uid,
      first_publication_date: format(new Date(post.last_publication_date), 'dd MMM yyyy'  ,{
        locale: ptBR
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.title,
        author: post.data.author
      }
    }
  })

  console.log(posts)

  return {
    props: {
      postsPagination: {
        results: posts
      }
    },
    revalidate: 300
  }
};
