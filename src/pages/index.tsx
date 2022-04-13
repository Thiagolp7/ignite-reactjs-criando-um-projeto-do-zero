import { GetStaticProps } from 'next';
import Link from 'next/link'

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { AiOutlineCalendar } from 'react-icons/ai'
import { BiUser } from 'react-icons/bi'
import { RichText } from 'prismic-dom';

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

export default function Home() {
  return (
    <main className={styles.container}>
      <Link
        href="/post/como-utilizar-hooks"
      >
        <a className={styles.links}>
          <h2>Como utilizar hooks</h2>
          <p>Pensando em sicronização em vez de ciclos de vida.</p>
          <div>
            <span>
              <AiOutlineCalendar/>
              19 Mar 2021
            </span>
            <span>
              <BiUser/>
              Joseph Oliveira
            </span>
          </div>
        </a>
      </Link>
      <Link href="/">
        <a>
          <h2>Como utilizar hooks</h2>
          <p>Pensando em sicronização em vez de ciclos de vida.</p>
          <div>
            <span>
              <AiOutlineCalendar/>
              19 Mar 2021
            </span>
          </div>
        </a>
      </Link>
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
      fetch: ['posts.title', 'posts.content'],
      pageSize: 2
    }
  )

  console.log(JSON.stringify(response, null, 2))

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: RichText.asText(post.data.title),
        subtitle: RichText.asText(post.data.title),
        author: RichText.asText(post.data.author)
      }
    }
  })


  return {
    props: {}
  }
};
