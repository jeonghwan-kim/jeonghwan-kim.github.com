import * as React from "react"
import BoardPage from "./BoardPage"
import Modal from "./Modal"
import { fetchPosts } from "../before/api"

export default class BoardContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      posts: [],
      pagination: {
        page: 0,
        size: 0,
        totalPages: 0,
      },
      modalShown: false,
      post: undefined,
    }
  }
  componentDidMount() {
    this.fetchData()
  }
  fetchData(page) {
    this.setState({ fetching: true })
    fetchPosts(page || 1).then(data => {
      this.setState({
        posts: [...data.posts],
        pagination: { ...data.pagination },
        fetching: false,
      })
    })
  }
  render() {
    const { modalShown, post } = this.state
    return (
      <>
        <BoardPage
          {...this.state}
          onPaginate={page => this.fetchData(page)}
          onClickPost={post => this.toggleModal(post)}
        />
        {modalShown && <Modal onClose={() => this.toggleModal()}>{post}</Modal>}
      </>
    )
  }
  toggleModal(post) {
    this.setState({
      post,
      modalShown: !!post,
    })
  }
}
