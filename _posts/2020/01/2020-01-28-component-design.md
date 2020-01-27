---
title: 컴포넌트의 역할 분리
layout: post
category: dev
tags: webpack
---

리액트로 프론트엔드 일을 하면서 지난 1년간 가장 많이 사용한 관련 기술이 리덕스다.
최근 Mobx를 사용하면서 구조가 다소 바뀌긴 했지만 컴포넌트를 구성하는 방식은 여전히 리덕스를 사용했던 방식이 남아있다.

몇 년 전 플룩스 아키텍처가 나올 즈음 이 글([Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0))을 읽고 컴포넌트 설계 방식을 많이 참고하였다. 
[번역글](https://blueshw.github.io/2017/06/26/presentaional-component-container-component/)도 있다.
여러가지 내용이 있지만 나는 두 가지 점을 잘 활용했던것 같다. 

- 컨테이너는 어떻게 움직이는지를 담당한다
- 프리젠터는 어떻게 보여지는지를 담당한다
- 상태가 없는 프리젠터는 재활용 가능하다

이런 관점에서 컴포넌트를 만들고 동료가 만든 코드에 대해서도 의견을 제시했는데 이제와서 생각해보면 코드를 유지보수 하는데 있어서는 꽤 편리했던 것 같다. 
이러한 컴포넌트 제작 방식이 어떤 방식으로 좋았는지 두 가지 예제를 들어서 정리해 보겠다.

# 버튼 예제

화면 하단에 고정된 저장 버튼은 모바일 화면에서 많이 사용하는 레이아웃이다. 
먼저 FooterSaveButton 컴포넌트로 구현해 보자.

![FooterSaveButton](/assets/imgs/2020/01/27/SaveFooterButton.gif)

## 단일 컴포넌트로 만들기

```js
// FooterSaveButton.js
import './FooterSaveButton.css'; 

export default class FooterSaveButton  extends React.Component {
  constructor() {
    super();
    this.state = { fetching: false };
  }

  render() {
    const { fetching } = this.state;
  
    return (
      <button 
        className="FooterSaveButton" 
        disabled={fetching} 
        onClick={() => this.onClick()} 
      >
        {fetching ? "저장중..." : "저장"}
      </button>
    )
  }

  onClick() {
    this.setState({ fetching: true });
    this.save(() => this.setState({ fetching: false }));
  }

  save(callback) {
    setTimeout(callback, 1000);
  }
}
```

처음 컴포넌트를 만들게 되면 컨테이너와 프린젠터를 구분하는게 쉽지 않다. 
그럴 땐 그냥 하나의 컴포넌트로 "돌아가는 버전"을 먼저 만드는게 우선이다. 
버튼은 잘 동작한다. 

이제 시간이 좀 되고 코드를 다시 볼 여유가 생기면 리팩토링할 부분을 찾을 수 있다. 
먼저 이 컴포넌트의 역할을 하나씩 나열해 보자.

FooterSaveButton 컴포넌트는 다음과 같은 역할을 한다.

1. fetching 상태를 가지고 있어 상태에 따라 버튼 텍스트와 disabled를 제어한다 (동작)
1. 버튼 클릭 이벤트를 처리하는데, fetching 상태를 갱신하고 save() 메소드 호출한다 (동작)
1. CSS 파일을 불러와 버튼의 UI를 만든다 (모습)

역할을 동작과 모습으로 나누면 컴포넌트를 분리하는게 좀 수월해진다.

## 개선 

사실 컴포넌트 이름에서부터 냄새가 난다. 
FooterSaveButton이라는 이름 안에 동작(Save)과 표현(Footer)이 섞여있기 때문이다.

### FooterButton 

UI를 담당하는 세 번째 역할을 FooterButton 컴포넌트로 분리해 보자.

```js
// FooterButton.js
import './FooterButton.css'; 

const FooterButton = props => 
  <button className="FooterButton" {...props}>
    {props.children}
  </button>

export default FooterButton;
```

보여지는 것을 담당하기 때문에 스타일 시트를 가져오고 컴포넌트에 CSS 클래스명을 지정한다. 
프롭스(Props)로 넘어온 값을 단순히 버튼 요소에 전달만해서 disabled 값과 onClick 콜백함수를 설정한다.
특히 넘어온 자식요소(children)를 버튼의 하위 요소로 지정했는데 이 컴포넌트를 재활용하도록 하기 위해서다.

### SaveButton 

이제 동작을 담당하는 SaveButton 컴포넌트를 만들어 보자.

```js
// SaveButton.js
import FooterButton from './FooterButton';

export default class SaveButton extends React.Component {
  constructor() {
    super();
    this.state = { fetching: false };
  }

  render() {
    const { fetching } = this.state;

    return (
      <FooterButton disabled={fetching} onClick={this.onClick.bind(this)}>
        {fetching ? '저장중...' : '저장'}
      </FooterButton>
    )
  }
  
  onClick() {
    this.setState({ fetching: true });
    this.save(() => this.setState({ fetching: false }));
  }
  
  save(callback) {
    setTimeout(callback, 1000);
  }
}
```

데이터 요청 상태를 갖고 있는 fetching 상태를 두었고 이것으로 버튼 메세지와 클릭 가능 여부를 제어한다. 
onClick() 메소드는 클릭 이벤트를 처리하는 역할을 하는데 비동기 행동이 발생하는 동안 컴포넌트의 fetching 상태를 업데이트 한다. 

fetching 상태를 기반으로 버튼의 메세지와 클릭 여부를 제어하는 것은 동작과 관련되기 때문에 컨테이너의 역할을 맞다.

컨테이너에서 UI 요소는 모두 사라졌는데 전부 FooterButton에게 위임하려고 프롭스로 전달했다.

## 효과

이런 식의 리팩토링이 어떤 효과가 있을까? 먼저는 **기능과 로직을 컴포넌트 단위로 나눈 점**이다. 
코드가 읽기 쉬워서 유지보수 할 때 문제의 원인을 빠르게 찾을 수 있다. 
UI 버그라면 프리젠터인 FooterButton를 보면되고 기능 버그라면 컨테이너인 SaveButton을 찾으면 된다.

게다가 FooterButton은 **재활용이 가능**하다. 
SaveFooterButton은 버튼 이름이 정해져 있고 상태와 이벤트를 제어하는 로직이 하나의 컴포넌트로 강하게 엮여 있어서 재활용할 수 없었다. 
하지만 disabled와 onClick 그리고 children을 컴포넌트 외부에서 제어하도록 여지를 주었기 대문에 푸터에 위치할 버튼은 모두 이것을 재활용해서 만들 수 있다.


# 게시판 페이지 예제

버튼처럼 작은 규모는 이렇게 수월하게 나눌 수 있을 거다. 
좀 더 큰 예제를 보자. 
게시판 화면을 만든다고 해보자. API로 데이터 목록을 가져와서 출력한다. 
한 화면에 모든 데이터를 보여줄 수 없기 때문에 하단에 페이지네이션을 둔다. 
각 게시물을 클릭하면 모달이 떠서 상세 내용을 출력한다. 

![BoardPage 컴포넌트 결과](/assets/imgs/2020/01/27/BoardPage.gif)


## 단일 컴포넌트로 만들기 

이것도 처음엔 하나의 컴포넌트로 "돌아가는 버전"을 먼저 만든다. 
아래 BoardPage 컴포넌트처럼 말이다. 

```js
// BoardPage.js
import { fetchPosts } from './api';
import './BoardPage.css'

export default class BoardPage extends React.Component {
  constructor() {
    super();
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
    this.setState({ fetching: true });

    fetchPosts(page).then(data => {
      this.setState({
        posts: [...data.posts],
        pagination: {...data.pagination},
        fetching: false
      });
    })
  }

  render() {
```

코드가 길어서 중간에 끊었다. 상단에 보이듯이 관리하는 상태가 무척 많다. 
게시물 목록을 저장한 posts 배열, 페이지네이션 상태를 위한 pagination 객체, api 요청 상태를 나타내는 fetching, 
모달 상태를 제어하는 modalShown, 마지막으로 모달에 띄울 포스트 객체인 post다. 

렌더링 후 컴포넌트가 마운트 되면 데이터를 가져온다. 
fetching 상태를 활성화하고 api로 가져온 뒤 응답 데이터로 상태를 갱신한다. 

이어서 렌더 함수도 보자.

```js
// BoardPage.js 계속 
  render() {
    const { posts, pagination, modalShown, post, fetching } = this.state;

    return (
      <div className="BoardPage">
        // 1) 게시물 목록 
        <ul className="posts">
          {posts.map((post, idx) => {
            return (
              <li 
                key={idx} 
                onClick={() => this.toggleModal(post)}
              >
                {post}
              </li>
            );
          })}
        </ul>

        // 2) 페이지네이션 
        <ul className={`pagination ${fetching ? 'disabled' : ''}`}>
          {new Array(pagination.totalPages).fill(1).map((_, idx) => {
            const className = `${idx + 1 === pagination.page ? 'active' : ''} `;
            const page = idx + 1;
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

        // 3) 모달 
        {modalShown && 
        <>
          <div className="Modal-backdrop" onClick={() => this.toggleModal()}></div>
          <div className="Modal">
            <div className="Modal-body">{post}</div>
            <div className="Modal-footer">
              <button 
                onClick={() => this.toggleModal()}
              >
                닫기
              </button>
            </div>
          </div>
        </>
        }
      </div>
    );
  }

  toggleModal(post) {
    this.setState({
      post,
      modalShown: !!post
    })
  }
}
```

렌더 함수가 좀 길지만  총 3개로 나눠 볼 수 있다. 
목록을 출력하는 부분과 페이지네이션을 출력하는 부분 모달을 띄우는 부분이 있는데 모두 컴포넌트 상태에 따라서 렌더링한다. 

마지막으로 모달을 토글하는 toogleModal() 함수는 모달 관련 상태를 갱신한다. 

이 컴포넌트는 잘 동작한다. 하지만 역할이 섞여있어서 읽기 힘들다.

리팩토링에 앞서 BoardPage 컴포넌트의 역할을 나열해 보자.

1. API를 호출하여 응답값을 상태로 가진다 (동작) 
1. 포스트 목록을 그린다 (모습) 
1. 포스트를 클릭하면 모달을 띄운다 (동작)
1. 모달에서는 포스트 상세 정보를 그린다 (모습)
1. 하단의 페이지네이션을 그린다 (모습) 
1. 페이지 네이션을 클릭하면 데이터를 다시 불러온다 (동작) 

버튼 예제와 마찬가지로 동작과 모습을 나누면 수월하게 개선할 수 있다.

## 개선

모습만 다시 추려보면 이렇다

1. 포스트 목록을 그린다 (모습)
1. 모달에서는 포스트 상세 정보를 그린다 (모습)
1. 하단의 페이지네이션을 그린다 (모습)

1번은 게시판 목록을 출력하는 BoardPage 로 만들고 2번은 Modal 그리고 3번은 Pagination 컴포넌트로 만들면 되겠다. 

### Pagination

먼저 Pagination 부터 만들어보자

```js
// Pagination.js
import './Pagination.css';

const Pagination = ({pagination, disabled, onPaginate}) => {
  return (
    <ul className={`Pagination ${disabled ? 'disabled' : ''}`}>
      {new Array(pagination.totalPages).fill(1).map((_, idx) => {
        const page = idx + 1;

        return (
          <li key={idx} 
            className={`${page === pagination.page ? 'active' : ''} `} 
            onClick={() => onPaginate(page)}
          >
            {page}
          </li>
        )
      })}
    </ul>
  )
}

export default Pagination;
```

기존에 BoardPage.css 하나로 관리하던 스타일 코드를 Pagination.css로 분리했다. 
pagination 객체를 외부로부터 받아 페이지네이션을 그리는데만 사용한다.

disabled는 클릭을 방지하기 위한 속성으로 받았는데 사용하는 측에서 제어하도록 했다. 
페이지 번호를 클릭하면 동작하는 onPaginate() 함수도 사용하는 측에서 처리하도록 했다. 

Pagination 컴포넌트는 단순히 페이징과 관련된 UI만 그리는 컴포넌트다.

### Modal

그럼 모달 컴포넌트는 어떻까? 

```js
// Modal.js
import './Modal.css';

const Modal = ({children, onClose}) => {

  React.useEffect(()=> {
    document.body.style.overflowY = 'hidden';
    return () => document.body.style.overflowY = 'auto';
  }, []);

  return (
    <>
      <div className="Modal-backdrop" onClick={onClose}></div>
      <div className="Modal">
        <div className="Modal-body">{children}</div>
        <div className="Modal-footer"><button onClick={onClose}>닫기</button></div>
      </div>  
    </>
  )
}

export default Modal;
```

마찬가지로 BoardPage.css로 관리하던 스타일 코드를 Modal.css로 분리해 냈다. 
컴포넌트는 모달과 그 뒤에 있는 백드랍을 그리는 역할만 한다.
백드랍을 그릴때 스크롤 방지를 위해 body 스타일을 변경해야 하는데 리액트 훅스를 이용해서 처리했다. 
최소한의 프리젠터 상태를 갖고 있다.

백드랍이나 닫기 버트을 클릭하면 외부에서 받은 onClose() 함수를 호출하는데 이건 모달을 사용하는 측에서 제어하도록 했다. 

이 역시 페이지네이션 컴포넌트와 마찬가지로 모달의 모습만 그리는 컴포넌트다. 

### BoardPage

마지막 프리젠터인 BoardPage.js 컴포넌트를 보자.

```js
// BoardPage.js
import Pagination from './Pagination';
import './BoardPage.css'

const BoardPage = props => {
  const { posts, fetching, onClickPost } = props;

  return (
    <div className="BoardPage">
      <h1>게시글</h1>
      <ul className="posts">
        {posts.map((post, idx) => {
          return <li key={idx} onClick={() => onClickPost(post)}>{post}</li>
        })}
      </ul>
      <Pagination {...props} disabled={fetching} />
    </div>
  )
}

export default BoardPage;
```

이미 두 개의 CSS로 분리하고 남은 코드인 BoardPage.css를 가져와 컴포넌트의 스타일에 적용했다.
외부에서 받은 포스트 배열 데이터를 이용해 화면을 그리는 역할을 한다.

각 포스트를 클릭하면 콜백함수를 호출하는데 이것도 BoardPage를 사용하는 측에서 처리하도록 역할을 위임했다. 
이전의 두 프리젠터와 마친가지로 이 컴포넌트는 모습만 그리기 때문이다. 
하단에는 Pagination 컴포넌트를 사용했다.

이렇게 세 개 컴포넌트는 **모습만을 담당하는 프리젼터 컴포넌트**다. 

### BoardContainer

그럼 동작을 담당하는 BoardContainer 컴포넌트를 보자.

```js
// BoardContainer.js
import { fetchPosts } from '../before/api'
import BoardPage from './BoardPage';
import Modal from './Modal';

export default class BoardContainer extends React.Component {
  constructor() {
    super();
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
    this.setState({ fetching: true });
  
    fetchPosts(page || 1).then(data => {
      this.setState({
        posts: [...data.posts],
        pagination: {...data.pagination},
        fetching: false,
      })
    })
  }

  render() {
    const { modalShown, post } = this.state;

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
```

동작과 관련된 상태는 모두 이 컨테이너가 가지고 있다. 
마운트 되었을 때 데이터를 가져오는 로직도 여전하다. 

렌더 함수 부분이 좀다른데 프리젠터인 BoardPage 컴포넌트를 사용했다. 
컨테이너의 상태와 메소드를 프롭스로 전달하는데 UI와 관련된 것을 이 컴포넌트로 위임한다는 의도다.

대신 BoarPage에서 발생한 이벤트를 BoardContainer의 메소드가 처리하도록 했다.
페이징 이벤트가 발생하면 페이지 번호를 받아 데이터를 다시 패치한다(fetchData()). 
포스트 클릭 이벤트가 발생하면 모달 토글 함수를 호출한다(toggleModal()). 

모달 컴포넌트의 동작도 컨테이가 제어한다.
모달이 토글되면 컨테이너의 modalShown 상태가 바뀌는데 이것에 따라 이미 만들어둔 Modal 컴포넌트가 그려진다. 
모달에서 close 이벤트가 발생하면 모달 상태를 변경하는 toggleModal() 함수를 동작하도록 했다. 

이처럼 **컨테이너는 수시로 변하는 상태를 관리하면서 하위 컴포넌트들을 제어**하는 역할을 한다.

## 효과

이것도 효과는 비슷하다. 우선 **동작과 UI가 분리**되어 있다는 장점이 크다. 
하나의 거대한 컴포넌트일 경우는 동작과 모습이 섞여있기 때문에 코드를 읽는 것부터 힘들다. 
코드가 추가되면 더 읽기 어려워지고 유지보수하는 시간이 그만큼 늘어난다.

동작과 표현을 분리함으로써 이러한 문제를 예방할 수 있었다.
동작을 살펴보려면 BoardContainer를 보면되고 모습을 살펴보려면 각 프리젠터 컴포넌트를 보면된다.
간단하다.

**재활용** 측면에서는 훨씬 효과적이다. 
상태가 없는 Pagination과 Modal 컴포넌트는 필요한 다른 곳에서도 사용할 수 있다. 
그러한 이유는 모든 값과 동작을 프롭스로 넘기거나 children으로 전달하기 때문이다. 
onPaginate에 이미지 목록 조회 함수를 넘기면 이미지 게시판의 페이지네이션이 될 수도 있다. 
Modal 컴포넌트로 이미지나 동영상 엘레먼트를 감싸면 갤러리 모달이 될 수도 있는건 당연하다.


# 지금도 유효할까?

서두에 언급한 글은 리덕스 나올때 읽었던 글이다. 
리액트 훅스와 나오고 Mobx가 나오면서 컴포넌트를 굳이 이렇게 나눌 필요가 없다는 말들도 한다.
Mobx를 사용하다보면 정말 그런것 같기도 한데 아직 머릿 속에 정리된 수준은 아니다.

전체코드: [https://github.com/jeonghwan-kim/post-component-design](https://github.com/jeonghwan-kim/post-component-design)