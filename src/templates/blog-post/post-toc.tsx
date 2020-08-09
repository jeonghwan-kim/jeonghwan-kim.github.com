import React, { useEffect } from 'react';
import ScrollSpy from './scroll-spy';
import './post-toc.scss';


interface P {
  tableOfContents: string;
}

const PostToc: React.FC<P> = ({tableOfContents}) => {
  useEffect(()=> {
    const post = document.querySelector('.post-content');
    const headings = Array.from(post.querySelectorAll("h1,h2,h3,h4,h5,h6")).filter((h: HTMLElement) => h.id);
    const toc = document.querySelector('.post-toc')
    new ScrollSpy(toc as HTMLElement, headings as HTMLElement[]);
  }, [])

  return (
    <div className="post-toc" dangerouslySetInnerHTML={{__html: tableOfContents}} />
  )
}

export default PostToc;
