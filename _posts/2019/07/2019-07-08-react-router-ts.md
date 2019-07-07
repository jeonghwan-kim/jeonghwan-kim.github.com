---
title: '리액트 라우터 사용하기 (타입스크립트 버전) '
layout: post
summary: '타입스크립트로 리액트 라우터 사용하는 방법을 정리합니다'
category: dev
tags: react typescript
date: 2019-07-07
---

지난 글 [리액트, 타입스크립트 시작하기](/dev/2019/06/25/react-ts.html)에 이어 타입스크립트로 리액트 라우터를 어떻게 사용하는지 정리해 보자.
패키지의 기본 사용법 위주의 설명 보다는 [메모장 예제](https://github.com/jeonghwan-kim/study-react-ts/tree/master/router)를 보면서 
웹 어플리케이션에 라우터를 어떤 방식으로 적용해야 하는지 알아보겠다.


## 설치 및 라우터 세팅

브라우저 라우터인 react-router-dom 패키지와 타입을 프로젝트에 다운로드 한다.

```
$ npm install react-router-dom @types/react-router-dom
```

루트 라우터를 만들기 위해 routes/index.tsx 파일을 추가한다.

```tsx
import * as React from 'react';

const Root: React.FC = () => (
  // TODO 루트 라우터를 반환한다
)

export default Root;
```

리액트 라우터에서 제공하는 몇 가지 기본 컴포넌트의 역할은 다음과 같다.

* `<BrowserRouter />`: HTML5 히스토리 API를 사용하여 주소를 관리하는 라우터 (해쉬뱅 모드 사용 안함)
* `<Route />`: 요청 경로와 렌더링할 컴포넌트를 설정한다 
* `<Switch />`: 하위에 라우터 중 하나를 선택한다
* `<Redirect />`: 요청 경로를 다른 경로로 리다이렉션한다 

이상 네 개 컴포넌트를 이용해서 메모장 어플리케이션의 페이지를 분기할 루트 라우터를 만들어 보자.

```tsx
const Root: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/memo" component={Memo} />
      <Route path="/trash" component={Trash} />
      <Redirect path="*" to="/" />
    </Switch>
  </BrowserRouter>
)
```

최상단에 BrowerRouter로 선언하고 요청에 따라 하위의 여러컴포넌트들 중 하나를 선택하기 위해 Swich 컴포넌트로 감쌌다. Route와 Redirect 컴포넌트로 설정한 라우팅 규칙은 다음과 같다.

* **/ 요청으로 들어오면**: Home 컴포넌트를 렌더링 한다 
* **/memo 요청으로 들어오면**: Memo 컴포넌트를 렌더링 한다
* **/trash 요청으로 들어오면**: Trash 컴포넌트를 렌더링 한다 
* **위 세개 규칙을 벗어나면**: 루트(/) 요청으로 리다이렉션 한다

위 라우팅 규칙을 통해 샘플로 만들 메모장 어플리케이션의 동작을 가늠할 수 있겠는가?

* 루트 경로로 접속하면 홈페이지 화면을 보여준다. 
* 이 화면에는 두 개의 링크가 있는데 /memo와 /trash 링크다.
* /memo는 메모장 화면을, /trash는 휴지통 화면으로 이동하는 링크다.
* 메모장 화면에서는 보유한 메모 목록을 보여준다. 
* 삭제한 메모는 휴지통 화면에서 확인할 수 있다.

그럼 홈 페이지 컴포넌트 부터 만들어 보자.


## 홈 페이지(HomePage) 컴포넌트 제작 

HomePage 컴포넌트를 만들기 위해 pages/home/index.tsx 파일을 만들어 컴포넌트 틀을 구성한다.

```tsx
import * as React from 'react';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import Main from '../../components/Main';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Sidebar>
        // 사이드바: 메모장, 휴지통 링크를 위치한다
      </Sidebar>
      <Main>
        // 메인: 메모 생성 버튼을 위치한다
      </Main>
    </Layout>
  );  )
}

export default HomePage;
```

어플리케이션 레이아웃을 잡는 Layout, Sidebar, Main 컴포넌트를 미리 만들어 두었다.
화면은 크게 좌/우로 나뉘는데
* **좌측**에는 메뉴나 목록 컴포넌트를
* **우측**에는 메모 생성버튼이나 메모 내용 같은 컴포넌트를 위치시킨다.

어플리케이션 진입점인 HomePage 컴포넌트에서는 **메뉴 목록**(좌측)과 **메모 생성 버튼**(우측)을 만든다.

```tsx
<Layout>
  <Sidebar>
    <SidebarTitle>폴더</SidebarTitle>
    <List>
      <ListItem>
        <Link to="/memo">메모</Link>
      </ListItem>
      <ListItem>
        <Link to="/trash">휴지통</Link>
      </ListItem>
    </List>
  </Sidebar>
  <Main>
    <Link to="/memo/add">새로운 메모</Link>
  </Main>
</Layout>
```

메뉴나 버튼은 모두 다른 페이지로 이동하는 하이퍼링크다. 
리액트 라우터의 Link 컴포넌트로 만들면 라우터가 해당 경로로 주소를 변경하고 해당하는 컴포넌트를 그려줄 것이다.

![홈 스크릿샷]()

다음은 메모 링크를 클릭하면 동작하는 MemoPage 컴포넌트를 만들 차례다.

## 메모 페이지(MemoPage) 컴포넌트 제작

pages/memo/index.tsx 파일을 만들어 MemoPage 컴포넌트 틀을 짠다.

```tsx
interface MemoPageState {
  memos: Memo[];
}

class MemoPage extends React.Component<RouteComponentProps, MemoPageState> {
  render() {
    return (
      <Layout>
        <Sidebar>
        </Sidebar>
        <Main>
        </Main>
      </Layout>
    );
  }
}

export default MemoPage;
```

HomePage 컴포넌트와 동일한 화면구조로 레이아웃을 만들었다. 
MemoPage 컴포넌튼는 좌측에 작성한 메모 목록을 출력하도록 하겠다. 

메모를 출력하려면 이를 상태값으로 가지고 있는것이 편리하겠다. 
컴포넌트 상태를 인터페이스로 정의한다.

```ts
interface MemoPageState {
  memos: Memo[];
}

interface Memo {
  id?: number;
  content: string;
  createdAt?: number;
  deleted?: boolean;
}
```

메모 타입의 값을 배열로 갖고 있는 MemoPageState 인터페이스를 만들었다. 
이 타입을 Component 제네릭의 두 번째 인자로 넘겨준다. 
생성자 함수에서는 이 상태를 초기값으로 설정한다.

```ts
class MemoPage extends React.Component<{}, MemoPageState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      memos: []
    }
  }
```

fetchData() 메소드는 메모 목록을 가져와 상태를 갱신한다.
컴포넌트가 마운트 되는 시점(componentDidMount)에 데이터를 가져오도록 한다.

```ts
  fetchData() {
    const memos = fetchMemoList();
    this.setState({ 
      memos: memos.map(memo => ({
        ...memo 
      }) 
    });
  }

  componentDidMount() {
    this.fetchData();
  }
```



불러온 메모데이터를 좌측에 메모 목록으로 출력해 보자.

```tsx
render() {
  const { memos } = this.state;

  return (
    <Layout>
      <Sidebar>
        <SidebarTitle>메모</SidebarTitle>
        {this.renderMemoList(memos)}
      </Sidebar>
      <Main>
      </Main>
    </Layout>
  );
}

renderMemoList(memos: Memo[]) {
  return (
    <ul>
      {memos.map((memo, idx) => 
        <li key={idx}>
          <Link to={`/memo/${memo.id}`}>
            {memoTitle(memo.content)}
          </Link>
        </li>
      )}
    </ul>
  )
}
```

메모 목록을 출력하는 용도로 renderMomoList 메소드를 분리했다.
메모 목록은 메모 타이틀만 출력하고 클릭하면 메모 경로인 /memo/:id 로 이동하는 링크를 설정했다.

![메모 화면 스크릿샷 1]()

이 링크를 클릭하면 메모 상세 주소(/memo/:id)로 이동하게 될 것이다.


## 서브 라우터

MemoPage는 Root 라우터가 /memo 경로에 등록한 컴포넌트다.
만약 MemoPage 컴포넌트의 일부 화면과 /memo/:id 같은 하위 라우팅을 연결하고 싶다면 MemoPage 내부에 라우터를 선언하면 된다. 
비어있는 Main 컴폰넌트 내부에 하위 라우터인 MemoRouter를 선언한다.

```tsx
  <Main>
    <MemoRouter />
  </Main>
```

여기까지 설정하면 어플리케이션은 다음과 같이 동작한다.

* **/memo 요청이 들어오면**: 좌측에 메모 목록을 보여준다
* **/memo/* 요청이 들어오면**: 우측에 뭔가를 표시한다. 이는 **MemoRouter**가 제어한다

routers/memo/index.tsx 파일을 만들어 우측 화면을 담당할 MemoRouter를 만들어 보자.

```tsx
import { 
  Switch, 
  Route, 
  RouteComponentProps, 
  withRouter,
} from 'react-router-dom';

const MemoRouter: React.FC<RouteComponentProps> = props => {
  const { match } = props;
  
  return (
    <Switch>
      <Route 
        exact 
        path={`${match.url}/add`} 
        component={AddMemo} />
      <Route 
        exact 
        path={`${match.url}/:id`} 
        component={Memo} />
      <Route 
        exact 
        path={`${match.url}/`} 
        component={() => <div>메모가 없습니다</div>} />
    </Switch>
  )
}

export default withRouter(MemoRouter);
```

루트 라우터와 비슷하게 Switch, Route 컴포넌트로 라우팅 규칙을 설정했다. 
* **/memo/add 요청시**: AddMemo 컴포넌트를 렌더링 한다 
* **/memo/:id 요청시**: Memo 컴포넌트를 렌더링 한다 
* **/ 요청시**: '메모가 없습니다'를 렌더링 한다

코드 하단에 보면 **withRouter** 고차함수로 MemoRouter를 감쌌다. 
이렇게 하면 MemoRouter 컴포넌트는 **RoueComponentProps** 정보를 갖게 된다.

```ts
export interface RouteComponentProps<
  Params extends { [K in keyof Params]?: string } = {}, 
  C extends StaticContext = StaticContext, 
  S = H.LocationState
> {
  history: H.History;
  location: H.Location<S>;
  match: match<Params>;
  staticContext?: C;
}
```

routeComponentProps는 history, location, match 정보를 가진 인터페이스로서 라우트 정보를 담고 있다.

props.match를 통해 요청 경로와 매칭된 라우트 정보를 얻어낼수 있다. 
여기에서 사용한 match.url은 현제 컴포넌트에 설정한 주소 정보인데 실제 값은 '/memo' 문자열이 된다.
실제 값을 사용하지 않고 match.url 변수를 사용하면 좀 더 유연한 코드를 만들 수 있겠다.

MemoRouter에서 정의한 라우팅 규칙대로 AddMemo나 Memo 컴포넌트가 우측에 렌더링되는 방식이다.


## 컴포넌트에 주입된 라우트 정보 활용 

withRouter 고차 함수에 의해 주입된 RouterComponentProps 타입은 match.url 외에도 라우트 정보에 접근할수 있는 여러가지 변수를 가지고 있다. 

메모 화면인 MemePage 컴포넌트의 렌더링 함수를 다시 보자.

```tsx
render() {
  return (
    <Layout>
      <Sidebar>
        {this.renderMemoList(memos)}
      </Sidebar>
      <Main>
        <MemoRouter />
      </Main>
    </Layout>
  );
}
```

/memo 요청이 오면 MemoPage는 좌측에 메모 목록만 표시할 것이다. 
좀 더 똑독한 컴포넌트라면 메모 목록중 첫번째 메모 화면 /memo/:id로 이동해야하지 않을까? 

RouterComponentProps match 객체의 isExact는 현재 컴포넌트와 연결된 경로가 정확히 일치하는지 여부를 알 수 있는 값이다. 이 값이 참일때, 즉 /memo 요청이 왔을때 첫 번째 메모 페이지를 이동하도록 리다이렉션한다.

```tsx
render() {
  const { match } = this.props;
  const { memos } = this.state;

  if (match.isExact ) {
    return <Redirect to={`${match.url}/${memos[0].id}`} />
  }

  return (
    <Layout>
}
```

![메모 화면 스크릿샷 2]()

뿐만 아니라 데이터 url 변화를 감지하고 이에 대한 로직이 필요한 경우가 있다. 
가령 /memo/:id 에 연결된 Memo 컴포넌트는 id 값에 따라 데이터를 패치해 와서 컴포넌트를 그린다.

```tsx
interface MemoState {
  memo?: Memo;
}

class MemoComponent extends React.Component{any, MemoState} {
  constructor(props: any) {
    super(props);

    this.state = {
      memo: undefined,
    }
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.fetchData(params.id);
  }

  fetchData(id: string) {
    const memoId = parseInt(id || '0', 10);
    const memo = fetchMemo(memoId);
    this.setState({ 
      memo: { ..memo },
     });
  }

  render() {
    const { memo } = this.state;
    
    if (!memo) {
      return null;
    }

    return // 메모를 그린다.
  }
```

MemoState 타입을 상태로 갖는 메모 컴포넌트는 마운트 시점(componentDidMount)에 데이터를 가져와(fetchData)
상태 변수로 담는다. render 함수는 이 데이터를 가지고 화면을 그린다.

이때 좌측 메모목록중 하나를 클릭하여 /memo/1 에서 memo/2로 주소가 변경된다면 어떻게 될가? 
주소만 변경될뿐 우측 화면은 변함없다.

따라서 주소를 감지하여 fetchData 를 실행해야만 화면을 다시 그릴것이다. 
라우터에 연결된 MemoComponent는 props로 라우트 정보를 받는다. 
따라서 componentWillReceiveProps 훅을 이용해 주소 변경을 감지할 수 있다.

```ts
interface MemoMatchProps {
  id: string;
}

class MemoComponent extends React.Component<
  RouteComponentProps<MemoMatchProps>,
  MemoState
> {

  componentWillReceiveProps(nextProps: RouteComponentProps<MemoMatchProps>) {
    const { match: { params }} = this.props;
    const id = nextProps.match.params.id;
    const urlChanged = id !== params.id;
    if (urlChanged) {
      this.fetchData(id);
    }
  }
```

RouteComponentProps는 제네릭으로 사용할수 있어서 주소 매칭 정보를 의미하는 MemoMatchProps 인터페이스를 만들었다.
이 타입을 제네릭 인자로 전달하면 컴포넌트에서는 match의 params 객체로 접근할 수있다.
즉 /memo/:id에 연결된 MemoComponent는 this.props.match.params.id로 동적 id 값을 획득할 수 있는 것이다.

변경된 프롭스 정보를 받는 시점(componentWillReceiveProps)에서 이 정보를 비교하여 주소가 변경되면(urlChanged) 메모 데이터를 새로 불러오는(fetchData) 코드다.


## 정리 

타입스크립트에서 리액트 라우터를 사용하려면 react-router-dom 뿐만아니라 타입정보가 있는 @types/react-router-dom 패키지도 필요하다.

BrowserRouter, Switch, Router, Redirect 컴포넌트를 이용해 라우터 컴포넌트를 만들 수 있다.

Route의 component 속성에 연결한 컴포넌트는 라우트 정보를 전달받는데 RouteComponentProps 인터페이스 형식의 데이터가 넘어온다. 이 정보를 가지고 세부 라우팅 로직이나 컴포넌트를 제어할 수 있다.

라우터에 연결되지 않은 컴포넌는 withRouter 고차함수로 직접 RouteComponentProps 값이 주입할 수 있다.

메모자 예제의 완성본은 다음 코드에서 확인할 수 있다.
* [https://github.com/jeonghwan-kim/study-react-ts/tree/master/router](https://github.com/jeonghwan-kim/study-react-ts/tree/master/router)