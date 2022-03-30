import Image from 'next/image'
import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { AiOutlineCalendar } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
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
}

export default function Post() {
  return (
    <main className={styles.container}>
      <div className={styles.banner}>
        <Image src="/images/banner.png" width="1440px"
          height="500px"
        />
      </div>
      <div className={styles.content}>
        <h1>Criando um app CRA do zero</h1>
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

      </div>
    </main>
  )
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
