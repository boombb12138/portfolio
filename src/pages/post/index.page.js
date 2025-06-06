export { postMarkdown } from './post-markdown';
import { Section } from 'components/Section';
import styles from '../../layouts/Home/Profile.module.css';

import { Text } from 'components/Text';
import { Link } from 'components/Link';

const posts = () => {
  return (
    <Section className={styles.contact}>
      <Text className={styles.description} size="l" as="p" data-visible="true">
        <Link href="https://juejin.cn/user/2107109724924174">Bug Records</Link>
        <br />
        <Link href="https://boombb12138.notion.site/Rust-7268c7bf4616440aaf2053f064224b2d?pvs=4">
          Rust Blog
        </Link>
        <br />
        <Link href="https://boombb12138.notion.site/DeFi-1af5c09726d34488ba08acb89d8f89f7?pvs=74">
          DeFi Blog
        </Link>
        <br />
        <Link href="https://artela.network/blog/announcing-the-winners-of-artela-aspect-buildathon">
          Artela hackathon（Idea Runner Up+Honorable Mentions）
        </Link>
      </Text>
    </Section>
  );
};
export default posts;
