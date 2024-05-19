import { Suspense, useState } from "react"

function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>

      {/* <head>에 마운트될 것이다 */}
      <title>{post.title}</title>

      {/* <head>에 마운트될 것이다 */}
      <meta name="author" content="Josh" />

      {/* <head>에 마운트될 것이다 */}
      <link rel="author" href="https://twitter.com/joshcstory/" />

      {/* <head>에 마운트될 것이다 */}
      <meta name="keywords" content={post.keywords} />

      <p>Eee equals em-see-squared...</p>
    </article>
  )
}

function PrimaryButton() {
  return (
    <Suspense fallback="loading...">
      {/* <head>에 마운트될 것이다 */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        precedence="default"
      />

      {/* <head>에 마운트될 것이다 */}
      <script
        async={true}
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"
      />

      <button className="btn btn-primary">
        Twitter Bootstrap Primary Button
      </button>
    </Suspense>
  )
}

export default () => {
  const [value, setValue] = useState(1)

  return (
    <>
      <BlogPost
        post={{
          title: `Title ${value}`,
          keywords: `Keywords ${value}`,
        }}
      />
      <button onClick={() => setValue(value + 1)}>+1</button>
      <hr />
      <PrimaryButton />
    </>
  )
}
