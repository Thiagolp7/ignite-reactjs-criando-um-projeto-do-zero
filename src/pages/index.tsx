import { GetStaticProps } from 'next';
import Link from 'next/link'
import Header from '../components/Header';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { AiOutlineCalendar } from 'react-icons/ai'
import { BiUser } from 'react-icons/bi'

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

export const getStaticProps = async () => {
  return {
    props: {}
  }
};
