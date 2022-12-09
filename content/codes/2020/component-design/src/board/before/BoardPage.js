import * as React from "react"
import { fetchPosts } from "./api"
import "./BoardPage.css"

export default class BoardPage extends React.Component {
  constructor() {
    super()
    this.state = {
      posts: [],
      pagination: {
        page: 0,
        totalPages: 0,
      },
      fetching: false,
      modalShown: false,
      post: undefined,
    }
  }
  componentDidMount() {
    this.fetchData(1)
  }
  fetchData(page) {
    this.setState({ fetching: true })
    fetchPosts(page).then(data => {
      this.setState({
        posts: [...data.posts],
        pagination: { ...data.pagination },
        fetching: false,
      })
    })
  }
  render() {
    const { posts, pagination, modalShown, post, fetching } = this.state

    return (
      <div className="BoardPage">
        <ul className="posts">
          {posts.map((post, idx) => {
            return (
              <li key={idx} onClick={() => this.toggleModal(post)}>
                {post}
              </li>
            )
          })}
        </ul>
        <ul className={`pagination ${fetching ? "disabled" : ""}`}>
          {new Array(pagination.totalPages).fill(1).map((_, idx) => {
            const className = `${idx + 1 === pagination.page ? "active" : ""} `
            const page = idx + 1
            return (
              <li
                key={idx}
                className={className}
                onClick={() => this.fetchData(page)}
              >
                {page}
              </li>
            )
          })}
        </ul>
        {modalShown && (
          <>
            <div
              className="Modal-backdrop"
              onClick={() => this.toggleModal()}
            ></div>
            <div className="Modal">
              <div className="Modal-body">{post}</div>
              <div className="Modal-footer">
                <button onClick={() => this.toggleModal()}>닫기</button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }
  toggleModal(post) {
    this.setState({
      post,
      modalShown: !!post,
    })
  }
}
