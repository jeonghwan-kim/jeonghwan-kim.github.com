---
title: 리액트 라우터 활용한 권한별 라우팅 제어
layout: post
category: dev
tags: react
---

라우팅 로직을 만들때 매번 필수로 들어가는 것이 인증과 인가이다. 
이 둘은 비슷하면서 엄연히 다른데 인증(Authentication)은 사용자를 식별하는 것이고 인가(Authorization)은 식별된 사용자의 권한을 의미한다.
인증과 인가에 따라서 분기처리하는 라우팅 로직을 작성하는 것은 대부분의 어플리케이션에서 제공되어야할 필수 기능 중 하나이다.

이것은 프레임웍과 무관해서 비단 리액트 뿐만아니라 뷰js, 그리고 서버를 만드는 노드js에서도 마찬가지다. 

# 인증과 인가

그렇기 때문에 인증/인가에 대한 표준을 따르는 것이 중요한데, 난 오히려 이 표준이 더 헷갈리는 것 같다. 
HTTP 상태코드를 보면 401과 403이 그렇다.

- 401: Unauthrized
- 403: Forbidden

비인가 요청일 경우 401을 사용했었는데 문서에는 Unauthrozied 즉 "미승인"으로 말하기 때문이다.
MDN 문서에 보면 "의미상 비인증을 의미한다"라고 나와 있다. 

인가는 로그인 과정을 쳐서 부여하는 작업인데 로그인 실패시 서버는 401 상태 코드를 응답하고, 클라이언트는 로그인 실패 화면을 그린다.

로그인이 완료된 이후 특정 리소스에 접근할 때, 권한 체크를 하는데 이것이 인가 Authorization 이다. 
권한이 있으면 리소스를 응답하고 그렇지 않은 경우 서버는 403 상태코드를 응답한다. 
클라이언트는 사용자에게 리소스에 대한 접근 권한이 없다는 피드백을 한다.

이글에서는 리액트로 어떻게 인가를 처리할 수 있는지, 다시 말해 프론트엔드에서 어떻게 권한 관리를 하는지 정리해 보겠다.

# <Route /> 인테페이스 살펴보기

리액트 라우터에서 라우팅을 담당하는 `<Route />` 컴포넌트를 살펴보자. 

```ts
export interface RouteProps {
  location?: H.Location;
  component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  render?: (props: RouteComponentProps<any>) => React.ReactNode;
  children?: ((props: RouteChildrenProps<any>) => React.ReactNode) | React.ReactNode;
  path?: string | string[];
  exact?: boolean;
  sensitive?: boolean;
  strict?: boolean;
}
```

location은 window.loaction 객체와 비슷한데 Route를 감싼 BrowserRoute 컴포넌트가 주입할 것 같다.
component는 path에 정의한 요청이 들어왔을때 렌더링할 컴포넌트를 지정하는 속성이다.

render() 함수도 이름으로 보면 component와 비슷한 역할을 하는 녀석인데 함수로 되어 있다는 점이 다르다.
요청 권한에 따라 컴포넌트를 그릴지 말지 결정하는 구조라면 이 render() 속성의 함수를 잘 사용하면 될 것같다.

단, 주의해야 할 것이 있는데 component 속성은 render 보다 우선하기 때문에 두 속성은 같은 `<Route />`에 동시에 사용하지 말아야 한다.


# <RouteIf /> 권한별로 라우팅

`<Route>`를 감싼 컴포넌트를 만들어야겠다. 
비슷한 사용법이지만 권한 정보를 받는 것이 추가된 인테페이스를 갖도록 말이다. 
권한에 따라 라우트를 어떻게 할지 결정하는 역할이므로 `<RouteIf>`라고 이름 지었다.

```js
const RouteIf = ({ component: Component, props }) => {
  return (
    <Route 
      {...props} 
      render={props => {
        if (Component) {
          return <Component {...props} />;
        }
      }}
    />;
  )
};
```

이렇게 정의하면 `<Route>`와 똑같은 컴포넌트다.
렌더 함수를 좀 사용해 보자.

```js
const RouteIf = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (/* 권한이 없을 경우 */) {
          return <FobiddenPage />;
        }

        if (Component) {
          return <Component {...props} />;
        }

        return null;
      }}
    />
  );
};
```

render() 함수 로직을 좀 추가했다. 
권한이 없을 경우 먼저 체크해서 권한없음 컴포넌트를 반환해 버리는 것이다. 
그러면 아래 컴포넌트를 그리지 않고 권한 없음 화면이 보일 것이다.

이렇게 하려면 권한 인터페이스를 정해야하는데 아래 처럼 세 가지로 분류했다.

```js
const ROLE = {
  NONE: "NONE",
  READ: "READ",
  WRITE: "WRITE"
};
```

권한 없음을 의미하는 NONE은 페이지 진입이 안된다. 
READ 권한이 있어야 진입할 수 있다. 
이렇게 진입한 화면에 입력 컨트롤이 있을 경우는 WRITE 권한이 추가로 필요하다. 
만약 READ일 경우 데이터를 수정할 수 있는 모든 인풋 요소를 비활성화 할 것이다.

보통 어드민 어플리케이션일 경우 사용자별로 조회만 할수 있도록 제한하는 방식을 쓴다. 

그럼 이 ROLE을 기반으로 render() 함수를 더 만들어 보자.

```js
const RouteIf = ({ role, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        // 권한 체크 
        if (role === ROLE.NONE) { 
          return <FobiddenPage />;
        }

        if (Component) {
          return <Component {...props} role={role} />;
        }

        return null;
      }}
    />
  );
};
```

간단하다. 권한이 없으면 `<ForbiddenPage>` 컴포넌를 반환하고 로직을 종료한다.
이걸 이용해 사용하는 부분만 남았다.

# 권한별 라우팅

권한에 따라 라우팅하는 `<RouteIf>`컴포넌트를 기반으로 화면의 접근 제어 로직을 만들어 보자.

## 페이지별 권한 테이블

권한 데이터는 언제 어디에서 조회할 수 있을까? 
로그인을 마치고나면 사용자는 인가된 상태다. 
이제 서버 리소스에 접근할수 있는 상태가 된 것이다.
서버는 인가된 사용자 모두에서 리소스 접근을 허용하지는 않는다.
사용자가 가진 권한에 따라서 허용하거나 차단한다.
그렇기 때문에 사용자별로 권한 정보를 가지고 있어야하하는데 로그인 후에 서버가 클라이언트로 전달할 수 있다.

권한 조회 api를 통해 아래처럼 myRole 객체의 데이터라고 가정해 보자.

```js
const myRole = {
  users: ROLE.WRITE, // NONE | READ | WRITE
  products: ROLE.READ,
  auth: ROLE.NONE
};
```

화면에 따른 권한값으로 구성된 객체다. 
유저 관리화면은(users) 쓰기권한을, 상품 관리 화면(products)은 읽기 권한을 그리고 권한관리(auth) 화면은 권한이 없다. 
이 유저가 그렇다.

## 권한없음

그렇다면 이 권한 값으로 라우트 규칙을 만들어 볼 수 있다. 

```js
<BrowserRouter>
  <Switch>
    <Route path="/" exact component={HomePage} />
    <RouteIf
      path="/auth" => users로 하자 
      exact
      component={AuthManagePage}
      role={myRole.auth}
    />
  </Switch>
</BrowserRouter>
```

홈(/) 주소는 모든 사용자가 접근할 수 있도록 권한 설정을 하지 않다. 
Route 컴포넌트로 설정했다.

/auth 주소로 요청할 경우 권한 관리 페이지(AuthMangePage) 컴포넌트를 렌더링하는데 myRole.auth 값에 따라 처리한다.
RouteIf 컴포넌로 권한 정보를 넘겨줬다.

그러면 RouteIf 컴포넌트에 의해 권한이 없는 요청이기 때문에 ForbiddenPage가 렌더링 된다. 

![forbidden]()

## 읽기 권한

이번에 읽기 권한이 있는 사용자 관리 라우트 규칙을 추가해 보겠다.

```js
<RouteIf
  path="/products" =>
  exact
  component={ProductManagePage}
  role={myRole.products}
/>
```

/products 요청이 들어오면 RouteIf 컴포넌트는 사용자가 READ 권한임을 확인한다. 
따라서 Forbidden이 아니라 component에 설정한 컴포넌트를 반환하는데 ProductMangePage를 보여준다.

![read]()

이 화면에는 데이터를 수정할 수 있는 컨트롤러 들이 있는데 이 녀석들은 쓰기권하니 없기 때문에 비활성화 되어 있다.

이렇게 할수 있는 것은 RouteIf 컴포넌트에서 주어지 compoent를 반환할때 전달한 role 정보를 확용한 덕택이다.

```js
role을 활용한 페이지 컴포넌트
```

## 쓰기 권한

그럼 서버에서 받을 권한값이 조금 수정해서 쓰기 권한이 있을 경우 어떻게 화면이 변하는지 봐보자.


```js
const myRole = {
  users: ROLE.WRITE, // NONE | READ | WRITE
};
```

![write]()

인풋 요소들이 활성화 되어 사용자가 값을 입력/변할 수 있다.


# 정리

전체코드: github.com/jeonghwan-kim/role-based-react-router-sample
