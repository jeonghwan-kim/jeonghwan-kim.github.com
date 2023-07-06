---
slug: "/2023/06/24/lecture-react-season2-part3-ch6"
date: 2023-06-24 00:03:06
title: "[리액트 2부] 3.6 훅 활용 2"
layout: post
series: "[리액트 2부] 고급주제와 훅"
tags: [react]
---

기본 훅 세 개를 모두 파악했다. useState, useEffect, useContext로 어플리케이션을 함수 컴포넌트와 훅으로 다시 만들자.

# MyRouter: Router

2편에서 만든 라우터의 역할은 다음과 같다.

- routerContext: 라우트 관련 값 전달
- Router: 컨택스트에게 상태 path 제공 (공급자)
- Routes: 요청 경로에 해당하는 컴포넌트 반환 (소비자)
- Route: 라우팅 테이블
- Link: 경로 렌더 및 변경 (소비자)
- withRouter: 대상 컴포넌트에게 라우트 기능 주입 (소비자)

클래스 컴포넌트로 구현했기 때문에

- this.state 상태 path를 관리했다.
- 히스토리 이벤트를 등록/해지하기 위해 생명주기 메소드를 사용했다.
- 컨택스트를 소비하기 위해 소비자를 사용했다.
- 라우터 기능을 제공하기 위해 고차 컴포넌트 패턴을 사용했다.

이것을 함수 컴포넌트와 훅으로 변환하는 것이 이번 절의 목적이다.

src/lib/MyRouter.jsx 파일을 만들고 여기에 라우터 컨택스트를 만든다.

```jsx
const routerContext = React.createContext({})
routerContext.displayName = "RouterContext"
```

Route를 클래스에서 함수로 컴포넌트로 변경한다.

```jsx{2,9-12,14-19}
const Router = ({ children }) => {
  const [path, setPath] = React.useState(window.location.pathname)

  const changePath = path => {
    setPath(path)
    window.history.pushState({ path }, "", path)
  }

  const handlePopstate = event => {
    const nextPath = (event.state && event.state.path) || "/"
    setPath(nextPath)
  }

  React.useEffect(() => {
    window.addEventListener("popstate", handlePopstate)
    return () => {
      window.removeEventListener("popstate", handlePopstate)
    }
  }, [])

  return (
    <routerContext.Provider value={{ path, changePath }}>
      {children}
    </routerContext.Provider>
  )
}
```

클래스 멤버 변수로 관리하던 상태를 useState 훅을 사용해 내부 변수로 관리했다. setState 메소드 대신 훅이 제공한 세터 함수를 사용할 수 있다. 상속화 상태 초기화를 위한 생성자가 코드가 사라지고 단 한줄의 코드만 남았다.

handlePopstate 핸들러 함수를 메소드에서 내부 변수로 바꾸었다. 디스를 고정시키기 위한 생성자 코드도 사라졌다. 필요한 곳에 값을 전달하기만 하면 된다.

클래스에서는 컴포넌트가 마운트되고 언마운트 되는 시점에 핸들러 함수를 이벤트에 등록했다. 생명주기 사이클을 고려해 각 메소드를 사용했다. 이제는 useEffect 안으로 코드를 모았다. 컴포넌트가 실행되면 최초에 한 번 이벤트를 등록하는 부수 효과다. 컴포넌트가 트리에서 사라지면 부수 효과 정리 함수를 실행한다. 이벤트 핸들러를 돔에서 제거할 것이다.

# MyRouter: Routes, Route, Link

라우트 컨택스트를 소비할 차례다. 기존에는 소비자 컴포넌트를 useContext 훅으로 대체한다.

```jsx{2}
export const Routes = ({ children }) => {
  const { path } = React.useContext(routerContext)

  let selectedRoute = null
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return
    if (child.type === React.Fragment) return
    if (!child.props.path || !child.props.element) return
    if (child.props.path !== path.replace(/\?.*$/, "")) return

    selectedRoute = child.props.element
  })

  return selectedRoute
}
```

컨슈머 컴포넌트로 래핑했던 부분을 모두 제거하고 그 전에 컨택스트 훅을 사용해 라우터 컨택스트 값을 불러왔다.

Route는 이전처럼 빈 값을 반환한다.

```jsx
export const Route = () => null
```

Link도 훅을 사용한다.

```jsx{2}
export const Link = ({ to, ...props }) => {
  const { path, changePath } = React.useContext(routerContext)

  const handleClick = e => {
    e.preventDefault()
    if (to !== path) changePath(to)
  }
  return <a {...props} href={to} onClick={handleClick} />
}
```

소비자 컴포넌트로 래핑했던 부분을 제거하고 훅을 사용해 컨택스트 값을 불러왔다.

# MyRouter: 커스텀 훅

기본 훅 뿐만아니라 이것을 조합해 또 다른 훅을 만들 수 있다. 이 절에서는 라우터 고차 컴포넌트를 커스텀 훅으로 변경하는 방법을 알아본다.

고차 컴포넌트가 제공하는 navigate 함수를 대체할 수 있는 useNavigate 훅을 만들어 보자.

```js{2}
const useNavigate = () => {
  const { path, changePath } = React.useContext(routerContext)
  const navigate = nextPath => {
    if (path !== nextPath) changePath(nextPath)
  }
  return navigate
}
```

- 관례대로 use로 시작하는 이름을 사용했다. useNavigate.
- useContext를 사용했다. 소비자 컴포넌트 대신 useContext 훅을 사용한 점이 다른 점이다. 내부 로직은 기존 것을 그대로 가져왔다.
- 마지막으로 navigate 함수를 반환한다.

이제 사용하는 쪽에서는 고차 컴포넌트로 감싸 인자로 네비게이트 함수를 주입받는 대신 커스텀 훅을 사용해 네비게이션을 할 수 있다.

```jsx
const navigate = useNavigate()
```

다음으로 match를 대체한 useMatch 훅을 만들어 보자.

```js{2}
const useMatch = () => {
  const { path } = React.useContext(routerContext)
  const match = comparedPath => path === comparedPath
  return match
}
```

- 관례에 따라 use로 시작하는 useMatch
- 라우터 컨택스트를 소비하려고 useContext 훅 사용했다.

마지막으로 고차컴포넌트가 제공한 searchParams도 훅으로 분리했다.

```js{2}
const useParams = () => {
  // TODO: useMemo 사용해야
  const params = new URLSearchParams(window.location.search)
  const paramObject = {}
  for (const [key, value] of params) {
    paramObject[key] = value
  }
  return paramObject
}
```

useParams는 이후에 소개할 메모이제이션 훅을 사용할 예정이다. 여기서는 아무런 훅도 사용하지 않은 일반 함수인 점만 유념하자.

# MyRouter: 활용

함수 컴포넌트로 변경한 Router를 사용할 차례다. 라우팅 역할을 하는 최상단 컴포넌트 App에 추가한다.

```jsx{2-8}
const App = () => (
  <MyRouter.Router>
    <MyRouter.Routes>
      <MyRouter.Route path="/cart" element={<CartPage />} />
      <MyRouter.Route path="/order" element={<OrderPage />} />
      <MyRouter.Route path="/" element={<ProductPage />} />
    </MyRouter.Routes>
  </MyRouter.Router>
)
```

요청한 uri에 따라 각 페이지 컴포넌트를 렌더링 할 것이다.

라우트 컨택스트를 소비했던 컴포넌트도 변경해야한다. 고차 컴포넌트로 주입했던 부분을 커스텀 훅으로 교체하자. TODO 주석을 붙였던 부분이다.

src/components/Navbar.jsx

```jsx{2,5,7,8,10}
const Navbar = () => {
  const match = MyRouter.useMatch()
  return (
    <nav className="Navbar">
      <MyRouter.Link to="/" className={match("/") ? "active" : ""}>
        메뉴목록
      </MyRouter.Link>
      <MyRouter.Link to="/order" className={match("/order") ? "active" : ""}>
        주문내역
      </MyRouter.Link>
    </nav>
  )
}
```

useMatch로 경로를 비교했다. 이 컴포넌트에 라우터 기능을 주입하기 위한 고차 컴포넌트 래핑 코드를 제거했다.

src/components/Title.jsx

```jsx{5}
const Title = ({ backUrl = "", children }) => {
  if (backUrl) {
    return (
      <>
        <MyRouter.Link to={backUrl} />
        <h1 style={{ paddingRight: "44px" }}>{children}</h1>
      </>
    )
  }
  return <h1>{children}</h1>
}
```

Link로 대체했다.

src/pages/CartPage/index.jsx

```jsx{3,9-11}
const CartPage = () => {
  const [product, setProduct] = useState();
  const {productId}= MyRouter.useParams();

  const fetch = async (productId) => { /* ... */ };

  const handleSubmit = async (values) => { /* ... */ };

  useEffect(() => {
    if (productId) fetch(productId);
  }, [productId]);

  return (
    <div className="CartPage">
```

uri의 쿼리 문자열에서 상품 아이디를 가져오는 부분을 useParams로 바꿨다.

src/pages/CartPage/PaymentSuccessDialog.jsx

```jsx{2,7,13}
const PaymentSuccessDialog = () => {
  const navigate = MyRouter.useNavigate();

  const handleClickNo = () => {
    // TODO: MyLayout 사용
    // closeDialog();
    navigate("/");
  };

  const handleClickYes = () => {
    // TODO: MyLayout 사용
    // closeDialog();
    navigate("/order");
  };

  return (
    <Dialog
```

고차 컴포넌트로 주입받았던 navigate를 커스텀 훅으로 교체했다.

src/pages/ProductPage/OrerableProductItem.jsx

```jsx{2,4}
const OrderableProductItem = ({ product }) => {
  const navigate = MyRouter.useNavigate()
  const handleClick = () => {
    navigate(`/cart?productId=${product.id}`)
  }
  return <ProductItem product={product} onClick={handleClick} />
}
```

주소 이동 부분에 useNavigate 도움을 받았다.

# MyLayout: Layout

2편에서 만든 MyLayout의 역할은 다음과 같다.

- layoutContext: 레이아웃 관련 값 전달
- Layout: 컨택스트에게 상태 daialog 제공 (공급자)
- withLayout: 대상 컴포넌트에게 레이아웃 기능 주입 (소비자)

Layout을 클래스 컴포넌트로 구현했기 때문에 this.state로 상태를 관리했다. withLayout은 레이아웃 컨택스트를 소비하기 위해 소비자 컴포넌트를 사용하고 대상 컨포넌트에게 기능을 제공할 목적으로 고차 컴포넌트 패턴을 사용했다.

이것을 함수형 컴포넌트와 훅으로 변환하는 것이 이번 절의 목적이다.

src/lib/MyLayout.jsx 파일을 만들고 여기에 레이아웃 컨택스트를 만든다.

```jsx
const layoutContext = React.createContext({})
layoutContext.displayName = "LayoutContext"
```

Layout을 추가한다.

```jsx{2}
const Layout = ({ children }) => {
  const [dialog, setDialog] = React.useState()
  return (
    <layoutContext.Provider value={{ dialog, setDialog }}>
      {children}
    </layoutContext.Provider>
  )
}
```

멤버 변수로 관리하던 상태를 useState 훅을 사용해 내부 변수로 만들었다. setState 메소드 대신 훅이 제공한 세터 함수를 사용할 수 있다. 상태를 초기화하기 위해 생성자 함수를 사용하던 부분이 모두 사라지고 단 한줄의 코드만 남았다.

# MyLayout: 커스텀 훅

WithLayout에서 제공하던 open/closeDialog 를 대체할 수 있는 useModal 훅을 만들어 보자.

```jsx{2}
const useDialog = () => {
  const { dialog, setDialog } = React.useContext(layoutContext)
  const openDialog = element => setDialog(element)
  const closeDialog = () => setDialog(null)
  return { dialog, openDialog, closeDialog }
}
```

WithLayout은 소비자 컴포넌트를 사용했던 반면 여기서는 레이아웃 훅을 사용했다. 컨택스트를 통해 다이얼로그 상태와 세터를 사용할 수 있다. open/closeDialog 함수를 만들어 dialog와 함께 반환하는 커스텀 훅이다.

이걸 활용해 보자.

같은 파일 안에 DialogContianer에서 사용할 수 있겠다.

```jsx{2}
const DialogContainer = () => {
  const { dialog } = useDialog()
  return (
    <>
      {dialog &&
        ReactDOM.createPortal(
          <Backdrop>{dialog}</Backdrop>,
          document.querySelector("#dialog")
        )}
    </>
  )
}
```

기존에 고차 컴포넌트로 다이얼로그 상태를 인자로 주입하던 걸 useDialog로 대체했다. 이 훅을 호출해서 Layout의 상태 dialog를 컨택스트를 통해 주입 받을 것이다.

로딩을 시작, 종료하는 기능도 고차컴포넌트에서 커스텀 훅으로 분리해보자.

```jsx{2}
const useLoading = () => {
  const { openDialog, closeDialog: finishLoading } = useDialog()
  const startLoading = message => openDialog(<Dialog>{message}</Dialog>)
  return { startLoading, finishLoading }
}
```

useDialog 훅을 조합했다. openDialog에 텍스트를 포함한 다이얼로그 앨리먼트를 전달했다. finishLoading은 closeDialog를 그대로 재사용했다. 이 둘을 반환하는 커스텀 훅이다.

# MyLayout: 활용

함수 컴포넌트와 훅으로 바꾼 MyLayout을 사용할 차례다. 최상단 컴포넌트 App에 추가한다.

```jsx{2,10}
const App = () => (
  <MyLayout.Layout>
    <MyRouter.Router>
      <MyRouter.Routes>
        <MyRouter.Route path="/cart" element={<CartPage />} />
        <MyRouter.Route path="/order" element={<OrderPage />} />
        <MyRouter.Route path="/" element={<ProductPage />} />
      </MyRouter.Routes>
    </MyRouter.Router>
  </MyLayout.Layout>
)
```

이제 하위 컴포넌트에서는 MyLayout 컨택스트를 사용할 수 있을 것이다.

레이아웃 컨택스트를 소비했던 컴포넌트를 변경한다.

src/components/Page.jsx

```jsx{6}
const Page = ({ header, children, footer }) => (
  <div className="Page">
    <header>{header}</header>
    <main>{children}</main>
    <footer>{footer}</footer>
    <MyLayout.DialogContainer />
  </div>
)
```

다시 DialogContainer를 활성화 했다.

src/components/ErrorDialog.jsx

```jsx{2}
const ErrorDialog = () => {
  const { closeDialog } = MyLayout.useDialog()
  return (
    <Dialog
      header={<>오류</>}
      footer={<Button onClick={closeDialog}>네, 알겠습니다</Button>}
    >
      잠시 후 다시 시도해 주세요.
    </Dialog>
  )
}
```

고차 컴포넌트로 감싼 부분을 제거하고 훅을 통해 기능을 가져왔다. 푸터 버튼을 클릭하면 다이얼로그가 닫힐 것이다.

src/pages/CartPage/index.jsx

```jsx{4,5,8,13,16,20,24,25,29,30}
const CartPage = () => {
  const [product, setProduct] = useState();
  const {productId}= MyRouter.useParams()
  const { startLoading, finishLoading } = MyLayout.useLoading();
  const { openDialog } = MyLayout.useDialog();

  const fetch = async (productId) => {
    startLoading("장바구니에 담는중...");
    try {
      const product = await ProductApi.fetchProduct(productId);
      setProduct(product);
    } catch (e) {
      openDialog(<ErrorDialog />);
      return;
    }
    finishLoading();
  };

  const handleSubmit = async (values) => {
    startLoading("결재중...");
    try {
      await OrderApi.createOrder(values);
    } catch (e) {
      finishLoading();
      openDialog(<ErrorDialog />);
      return;
    }

    finishLoading();
    openDialog(<PaymentSuccessDialog />);
  };

  useEffect(() => {
    if (productId) fetch(productId);
  }, [productId]);

  return (
    <div className="CartPage">
// ...
```

고차 컴포넌트 래핑 로직을 제거하고 필요한 훅을 사용했다. useLoading으로 로딩 상태를 제어했다. useDialog로 다이얼로그를 띄우는 기능을 사용했다.

src/pages/CartPage/PaymentSuccessDialog.jsx

```jsx{1,3,6,10}
const PaymentSuccessDialog = () => {
  const navigate = MyRouter.useNavigate();
  const { closeDialog } = MyLayout.useDialog();

  const handleClickNo = () => {
    closeDialog();
    navigate("/");
  };
  const handleClickYes = () => {
    closeDialog();
    navigate("/order");
  };

  return (
    <Dialog
// ...
```

고차함수로 감싼것을 훅으로 변경했다.

src/pages/OrderPage.jsx

```jsx{3,6,11,14}
const OrderPage = () => {
  const [order, setOrder] = useState();
  const { startLoading, finishLoading } = MyLayout.useLoading()

  const fetch = async () => {
    startLoading("주문정보 로딩중...");
    try {
      const order = await OrderApi.fetchMyOrder();
      setOrder(order);
    } catch (e) {
       openDialog(<ErrorDialog />);
      return;
    }
    finishLoading();
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="OrderPage">
// ...
```

마찬가지로 고차함수로 래핑한 부분을 제거했다. useLoading으로 로딩 UI를 제어했다.

src/pages/ProductPage/index.jsx

```jsx{3,4,7,12,15}
const ProductPage = () => {
  const [productList, setProductList] = useState([]);
  const { startLoading, finishLoading } = MyLayout.useLoading();
  const { openDialog } = MyLayout.useDialog();

  const fetch = async () => {
    startLoading("메뉴 목록 로딩중...");
    try {
      const productList = await ProductApi.fetchProductList();
      setProductList(productList);
    } catch (e) {
      openDialog(<ErrorDialog />);
      return;
    }
    finishLoading();
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="ProductPage">
// ...
```

역시 고차함수로 감싼 부분을 삭제하고 useLoading, useDialog 훅으로 대체했다.

# 달라진 점

훅 활용 1 장처럼 코드를 많이 고쳤다. 컨택스트 API를 사용하는 MyRouter와 MyLayout을 모두 함수형 컴포넌트와 컨택스트 훅으로 변경했기 때문이다. 변경 포인트를 짚어 내는 것이 중요하다.

- (함수) 2편에서 처음 컨택스트를 다룰 때는 공급자 Router, Layout를 클래스 컴포넌트로 만들었다. 컨택스트로 공급할 데이터를 상태로 가져야하기 때문이다. 이걸 상태 훅을 사용해 함수형 컴포넌트로 바꾸었다. 멤버 변수 state로 접근하던 상태 값을 이제는 내부 변수를 통해 가져올 수 있다. 덕분에 상태 변경 메소드를 사용하기 위해 this를 바인딩하던 코드가 사라지고 단순한 코드를 만들 수 있었다.

- (컨택스트 훅) 컨택스트를 소비하기 위해서는 컨슈머로 감싸야 했다. 고차 컴포넌트로 중복 코드를 모으기도 했지만 여전히 WithRouter와 WithLayout 안에서는 소비자를 사용해 렌더 프롭 형태로 사용해야만 했다. 컨택스트 훅을 사용하면서 직접 컨택스트 값을 사용할수 있게 되었다. 여러 개 컨택스트를 사용하더라도 렌더 프롭을 중첩으로 사용하지 않고 평탄한 구조를 유지할 수 있다.

- (컨택스트 훅) 고차 컴포넌트로 감싸기 위해 withRouter나 withLayout으로 대상 컴포넌트를 감싸서 기능을 제공했다. 훅을 사용하면 이러한 횡단 관심사 기능을 잘게 쪼갤 수 있고 필요한 부분에만 제공할 수 있다. 코드 읽기가 수월하다.

- (컨택스트 훅) 컴포넌트 관점에서 보자면 본질적인 역할만 남았다. 렌더 프롭으로 감싸는 다소 장황한 코드를 만들지 않아도 훅 한 줄로 갈음할 수 있다. 횡단 관심사가 컴포넌트 인자로 들어왔는데 이게 부모 컴포넌트에서 온 건지 고차 컴포넌트에서 온 건지 일일이 확인하지 않아도 된다. 함수 내부에 훅을 사용한 걸 보면 되기 때문이다.

# 중간 정리

MyRouter

- Router: 함수형 컴포넌트와 상태/부수효과 훅 사용
- Routes, Link: 컨택스트 훅 사용
- 커스텀 훅 신설: useNavigate, useMatch, useParams

MyLayout

- Layout: 함수형 컴포넌트와 상태 훅 사용
- DialogContainer: 컨택스트 훅 사용
- 커스텀 훅 신설: useDialog, useLoading

달라진 점

- 컨택스트 사용: 컨슈머, 렌더 프롭 → 훅
- 횡단 관심사 주입: 고차 컴포넌트 → 훅
