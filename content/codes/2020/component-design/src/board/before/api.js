export function fetchPosts(page) {
  const res = {
    posts: new Array(5)
      .fill(1)
      .map((_, idx) => `게시글 ${page}페이지-${idx + 1}번`),
    pagination: {
      page,
      totalPages: 5,
    },
  }

  return new Promise(resolve => setTimeout(() => resolve(res), 500))
}
