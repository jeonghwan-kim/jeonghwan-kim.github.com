export interface Site {
  siteMetadata: SiteMetadata;
}

export interface SiteMetadata {
  title: string;
  description: string;
  author: string;
  url: string;
  social: {
    email: string;
    twitterUsername: string;
    githubUsername: string;
  }
  videos: Video[];
  series: Series[];
}

export interface Video {
  id: string | number;
  thumb: string;
  url: string;
  title: string;
}

export interface Series {
  id: number;
  title: string;
}