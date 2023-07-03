---
slug: "/2023/06/24/lecture-react-season2-part3-ch4"
date: 2023-06-24 00:03:04
title: "[리액트 2부] 3.4 훅 활용 1"
layout: post
series: 리액트 2부
tags: [react]
---

리액트 useState와 useEffect를 사용할 차례다. 예제 프로그램을 함수 컴포넌트와 훅으로 다시 만들어 보자.

# 메뉴 목록 페이지

공통 컴포넌트부터 정리하자.

src/components/Page.jsx

```jsx{6}
const Page = ({ header, children, footer }) => (
  <div className="Page">
    <header>{header}</header>
    <main>{children}</main>
    <footer>{footer}</footer>
    {/* TODO: <DialogContainer /> */}
  </div>
)
```

DialogContainer를 주석 처리 했다. 다이얼로그 컨택스트를 사용하는데 이후 컨택스트 훅을 다룰 때 구현할 것이다.

src/components/Title.jsx

```jsx{5}
const Title = ({ backUrl = "", children }) => {
  if (backUrl) {
    return (
      <>
        {/* TODO: <Link to={backUrl} /> */}
        <h1 style={{ paddingRight: "44px" }}>{children}</h1>
      </>
    )
  }

  return <h1>{children}</h1>
}
```

Title 내부에 사용한 Link를 주석 처리 했다. 라우터 컨택스트를 사용하는데 이것도 컨택스트 훅을 다룰 때 구현할 것이다.

src/components/Navbar.jsx

```jsx{1,4,7}
// TODO: 라우터 연동
const Navbar = () => (
  <nav className="Navbar">
    <a href="/" className={"active"}>
      메뉴목록
    </a>
    <a to="/order" className={""}>
      주문내역
    </a>
  </nav>
)
```

Link를 사용한 부분인데 a 앨리먼트로 대체했다. 이것도 라우터 컨택스트를 다룰 때 구현할 것이다.

src/pages/ProductPage/OrderableProductItem.jsx

```jsx{3}
const OrderableProductItem = ({ product }) => {
  const handleClick = () => {
    // TODO: navigate(`/cart?productId=${product.id}`);
  }
  return <ProductItem product={product} onClick={handleClick} />
}
```

주소 이동 부분을 주석 처리 했다. 이것도 라우터 컨택스트를 다룰 때 구현할 것이다.

ProductPage를 수정하자. src/pages/ProductPage/index.jsx 파일이다.

```jsx{2,8-12}
const ProductPage = () => {
  const [productList, setProductList] = React.useState([])

  return (
    <div className="ProductPage">
      <Page header={<Title>메뉴목록</Title>} footer={<Navbar />}>
        <ul>
          {productList.map(product => (
            <li key={product.id}>
              <OrderableProductItem product={product} />
            </li>
          ))}
        </ul>
      </Page>
    </div>
  )
}
```

클래스 컴포넌트를 함수 컴포넌트로 바꿨다.

상품 목록을 상태로 관리하기 위해 기존에 this.state.productList로 관리하던 것을 useState를 사용해 함수 내부 변수로 관리했다. 훅에 빈 배열을 전달해 초기값을 지정했다. 훅은 이 상태와 세터를 튜플로 반환하는데 적절한 이름을 붙여 주었다.

이 값을 리액트 앨리먼트 구성하는데 사용했다. productList를 이용해 OrderableProductItem을 리스트 렌더링 했다.

상품 API로 이 상태를 채워 보자. 이전에는 클래스 컴포넌트의 componentDidMount 메소드에서 fetch 메소드를 호출했다. 하지만 함수 컴포넌트라서 생명주기 메소드가 없다. 함수 본문에 넣자.

```jsx{4,8,17}
const ProductPage = () => {
  const [productList, setProductList] = React.useState([]);

  const fetch = async () => {
    // TODO: startLoading();
    try {
      const productList = await ProductApi.fetchProductList();
      setProductList(productList);
    } catch (e) {
      // TODO: finishLoading();
      // TODO: openDialog(<ErrorDialog />);
      return;
    }
    // TODO: finishLoading();
  };

  fetch()

  return (
    <div className="ProductPage">
```

패치 메소드를 내부 변수로 옮겼다. 로딩이나 다이얼로그 관련한 로직은 컨택스트 훅 이후에 다룰 것이라서 우선 주석 처리 해 두었다. 우리가 다룰 것은 fetch() 함수 호출 부분이다. 리액트는 ProductPage 내부 로직을 순서대로 호출할 것이다.

1. 빈 배열로 초기화해 상태 productList 정의
2. 내부 함수 fetch 실행
3. 리액트 앨리먼트를 반환
4. 리액트는 이걸 가지고 렌더링하고 돔에 반영

fetch는 이후 언젠가 상품 조회 API 요청이 완료되면 목록을 받아올 것이다.

5. 이 목록은 setProductList에 의해 상태를 갱신
6. 리액트는 컴포넌트를 다시 렌더

```jsx
const App = () => <ProductPage />
```

App 컴포넌트다. 이전에는 요청 주소에 따라 페이지를 라우팅했는데 지금은 상품 목록 페이지만 두었다. 이후에 라우트를 다룰 때 작업할 예정이다.

확인해 보자.

![API를 계속 호출한다.](./api-calls.jpg)

API를 계속 호출한다. 우리가 원하는 것은 딱 한 번만 호출해서 렌더링하는 것인데 말이다. 1에서 6까지 일련의 순서로 동작하지만 다시 랜더되면서 1부터 반복하기 때문이다.

네트웍을 한 번만 요청하려면 부수 효과 훅으로 적절히 조절해야 한다.

```jsx{6}
const ProductPage = () => {
  const [productList, setProductList] = useState([]);

  const fetch = async () => {/* ... */};

  React.useEffect(() => fetch(), [])

  // ...
```

의존성에 빈 배열을 전달했다. 변하지 않는 값이기 때문에 컴포넌트가 렌더링될 때 딱 한 번만 부수효과를 실행할 것이다.

리액트 렌더링 과정은 어떻게 달라졌을까?

1. 상태 초기화
1. 부수효과 등록. 리액트가 적절한 시점에 실행
1. 리액트 앨리먼트 반환
1. 돔에 반영
1. 부수효과 실행 완료. 네트웍 요청을 완료해 상태를 갱신
1. 리액트가 컴포넌트 리렌더

두번 째 렌더링이다.

1. 변경된 상태 반환
1. 리액트 앨리먼트 반환
1. 돔에 반영
1. 부수효과 실행 안함. 의존성 같기 때문

![메뉴 목록을 만들었다.](./memu-list-page.jpg)

# 장바구니 페이지

장바구니 페이지를 함수형 컴포넌트로 작성할 차례다.

먼저 장바구니 페이지에서 사용할 컴포넌트들을 정리하자.

src/pages/OrderPage/OrderForm.jsx

```jsx{3,14,27}
const OrderForm = ({ onSubmit }) => {
  const getInputValueByName = name => {
    // todo
  }

  const handleSubmit = e => {
    e.preventDefault()

    const deliveryAddress = getInputValueByName("deliveryAddress")
    const deliveryContact = getInputValueByName("deliveryContact")
    const paymentMethod = getInputValueByName("paymentMethod")
    const messageToShop = getInputValueByName("messageToShop")
    const messageToRider = getInputValueByName("messageToRider")

    onSubmit({
      deliveryAddress,
      deliveryContact,
      paymentMethod,
      messageToRider,
      messageToShop,
    })
  }

  return (
    <form
      className="OrderForm"
      id="order-form"
      // TODO: ref={this.formRef}
      onSubmit={handleSubmit}
    >
      <FormControl label="주소" htmlFor="deliveryAddress" required>
        <input
          type="text"
          id="deliveryAddress"
          placeholder="배달받을 주소를 입력하세요"
          required
          autoFocus
        />
      </FormControl>
      <FormControl label="연락처" htmlFor="deliveryContact" required>
        <input
          type="text"
          id="deliveryContact"
          placeholder="연락처를 입력하세요"
          pattern="^\d{2,3}-\d{3,4}-\d{4}$"
          required
        />
      </FormControl>
      <FormControl label="결재수단" htmlFor="paymentMethod" required>
        <select name="paymentMethod" id="paymentMethod" value="">
          <option value="마이페이">마이페이</option>
          <option value="만나서 결제">만나서 결제</option>
        </select>
      </FormControl>
      <FormControl label="가게 사장님께" htmlFor="messageToShop">
        <textarea name="messageToShop" id="messageToShop"></textarea>
      </FormControl>
      <FormControl label="라이더님께" htmlFor="messageToRider">
        <textarea name="messageToRider" id="messageToRider"></textarea>
      </FormControl>
    </form>
  )
}
```

클래스 컴포넌트를 함수형 컴포넌트로 바꾸었다.

this.props 멤버 변수로 접근하던 인자를 내부 변수로 직접 사용했다.

이 컴포넌트는 레프 객체를 사용하려고 멤버 변수가 있는 클래스 컴포넌트를 사용했다. 함수 컴포넌트에서는 멤버 변수가 없기 때문에 이런 방식으로 레프 객체를 사용할 수 없다. 4편에서 레프 훅을 다룰 때 작성하겠다. 우선은 주석 처리해 놓았다.

CartPage 차례다. src/pages/CartPage/index.jsx 파일이다.

```jsx{2,4,24,25}
const CartPage = () => {
  const [product, setProduct] = React.useState()

  const handleSubmit = async values => {
    // TODO startLoading("결재중...");
    try {
      await OrderApi.createOrder(values)
    } catch (e) {
      // TODO:   finishLoading();
      //   TODO: openDialog(<ErrorDialog />);
      return
    }

    // TODO: finishLoading();
    // TODO: openDialog(<PaymentSuccessDialog />);
  }

  return (
    <div className="CartPage">
      <Page
        header={<Title backUrl="/">장바구니</Title>}
        footer={<PaymentButton form="order-form" />}
      >
        {product && <ProductItem product={product} />}
        <OrderForm onSubmit={handleSubmit} />
      </Page>
    </div>
  )
}
```

장바구니 상품을 위한 상태 product를 정의했다. useState 훅을 사용하는데 초기값은 undefined다. 상태와 세터 함수를 내부 변수로 얻었다. 이 값을 사용해 리액트 앨리먼트를 구성했다.

OrderForm의 제출 이벤트 핸들러를 내부 변수로 정의해 컴포넌트 인자로 전달했다. 핸들러 내부에서는 로딩, 다이얼로그를 로직이 있는데 주석 처리했다. 다음 컨택스트 장에서 다룰 예정이다.

빈 상태 product를 채워줄 차례다. ProductPage에서 네티웍 요청을 부수효과로 다룬 것처럼 여기서도 마찬가지다.

```jsx{3,15,19,20}
const CartPage = () => {
  // ...
  const fetch = async (productId) => {
    // TODO: startLoading("장바구니에 담는중...");
    try {
      const product = await ProductApi.fetchProduct(productId);
      setProduct(product);
    } catch (e) {
      //    TODO: openDialog(<ErrorDialog />);
      return;
    }
    // TODO: finishLoading();
  };

  React.useEffect(() => {
    // TODO const productId = searchParams.get("productId");
    // TODO if (!productId) return;

    fetch("CACDA423");
  }, []);

  return (
    <div className="CartPage">
```

한 번만 호출하는 함수이기 때문에 부수효과의 의존성에 빈 배열을 전달했다. 이 부수 효과에서 API를 호출한 뒤 상태를 갱신하더라도 다음 렌더링 단계에서는 부수효과를 다시 실행하지 않을 것이다.

부수 효과 안에서는 상품 아이디를 얻어오는 로직이 있는데 주석 처리했다. 라우터 장에서 다룰 예정이다. 우선은 고정된 상품 아이디를 사용 했다.

App에서 테스트해보자.

src/App.js

```jsx{4}
const App = () => (
  <>
    {/* <ProductPage /> */}
    <CartPage />
  </>
)
```

이전 절에서 테스트한 ProductPage 주석 처리하고 이 절에서 테스트할 장바구니 페이지 컴포넌트를 추가했다.

![장바구니 화면을 만들었다.](./cart-page.jpg)

# 주문내역 페이지

마지막으로 주문내역 화면을 담당하는 OrderPage 차례다. src/pages/OrderPage/index.jsx 파일이다.

```jsx{2,6-12}
const OrderPage = () => {
  const [order, setOrder] = React.useState()
  return (
    <div className="OrderPage">
      <Page header={<Title>주문내역</Title>} footer={<Navbar />}>
        {order && (
          <>
            <OrderStatusCard order={order} />
            <OrderPaymentCard order={order} />
            <OrderDeliveryCard order={order} />
          </>
        )}
      </Page>
    </div>
  )
}
```

주문 상태 order와 세터를 훅으로 정의했다. 이것을 리액트 앨리먼트로 그렸다.

이 상태를 채워줄 로직을 부수효과로 등록하자. 이것도 네트웍 요청, 함수 외부 환경이기 때문이다.

```jsx{4-14,16-18}
const OrderPage = () => {
  const [order, setOrder] = React.useState()

  const fetch = async () => {
    // TODO:  startLoading('주문정보 로딩중...');
    try {
      const order = await OrderApi.fetchMyOrder()
      setOrder(order)
    } catch (e) {
      //  TODO:  openDialog(<ErrorDialog />);
      return
    }
    // TODO: finishLoading();
  }

  React.useEffect(() => {
    fetch()
  }, [])

  // ...
```

함수 내부에 fetch를 정의했다. 로딩, 다이얼로그 관련 로직은 다음 장에서 다룰 것이기 때문에 주석 처리 해 두었다. API를 호출해 데이터를 얻은 뒤 상태 order를 갱신할 것이다.

한 번만 실행하는 부수 효과이기 때문에 의존성에 빈 배열을 전달했다. fetch 내부에서 상태를 변경하더라도 다음 랜더링에서는 부수 효과를 실행하지 않을 것이다.

src/App.js

```jsx{5}
const App = () => (
  <>
    {/* <ProductPage /> */}
    {/* <CartPage /> */}
    <OrderPage />
  </>
)
```

주문 내역 화면을 테스트하기 위해 다른 컴포넌트는 주석처리하고 OrderPage만 렌더링했다.

![주문내역 화면을 만들었다.](./order-page.jpg)

# 달라진 점

이번 장에서는 비교적 코드 양이 많다. 두 편(1, 2편)에 걸쳐 완성한 어플리케이션의 모든 화면을 다시 만들었기 때문이다.

클래스 컴포넌트로 만들던 것을 함수 컴포넌트로 바꿔서 다시 작성했다. 클래스 컴포넌트를 사용한 이유는 상태나 레프 객체를 멤버 변수로 관리하기 위해서 였다. 컴포넌트 생명 주기에 따라 특정 시점에 데이터를 네트웍으로 불러오기 위한 목적도 있다.

함수형 컴포넌트로 다시 작성하면서 이런 부분을 어떻게 다루었는지가 **핵심**이다.

- (상태 훅) 상태관리는 useState 훅을 사용했다. 함수형 컴포넌트 안에서 이 훅을 사용하면 값을 상태와 이를 변경할 수 있는 세터 함수 사용할 수 있다. 클래스 컴포넌트에서는 this.state 멤버 변수로 접근했는데 이제는 내부 변수를 바로 사용할 수 있었다. 상태를 변경할때도 this.setState가 아니라 세터 함수를 그대로 호출한 부분이 차이점이다.

- (부수효과 훅) 네트웍 요청으로 데이터를 조회하고 세터함수로 상태를 갱신하는 로직을 가져왔다. 리액트는 상태가 변하면 컴포넌트를 다시 그리는데 네트웤도 다시 요청할 것이다. 함수 컴포넌트 안에서 외부 변화를 일으키는 것은 부수 효과이고 이것은 코드를 예측할수 없게 하고 성능에 영향을 준다. 부수 효과를 잘 다루기 위해서 useEffect 훅을 사용했다. 리액트에게 부수효과를 위임하고 컴포넌트는 본연의 역할만 수행할 수 있다. 한 번만 호출해야하는 네트웍요청을 위해 의존성에 빈 값을 전달했다.

- (함수) 클래스 컴포넌트는 상태에 따라 UI 앨리먼트가 다르다. render 메소드는 언제라도 변할 수 있는 인스턴스 멤버 변수에 의존해 앨리먼트를 계산한다. 반면 함수 컴포넌트는 UI 앨리먼트가 변하지 않는다. 함수가 실행될 당시의 렌더링 환경 값을 가지고 리액트 앨리먼트를 반환하기 때문에 정적이다.

- (함수) 클래스 컴포넌트의 생성자 로직도 사라졌다. 핸들러에 디스를 바인딩하기 위해 사용했는데 상속 구조에 따라 부모 생성자를 호출하는 코드도 추가해야 했다. 반면 함수 컴포넌트는 핸들러가 내부 함수이기 때문에 this를 다룰 필요가 없다. 그냥 함수 값을 전달하기만 하면 된다.

# 중간 정리

상품목록 페이지

- 공통 컴포넌트 준비: Page, Title, Navbar, OrderableProductItem
- 라우터 기능 주석 처리. 컨택스트 훅에서 다룰 예정
- ProductPage: useState, useEffect 사용

장바구니 페이지

- OrderForm. 레프 훅에서 다룰 예정
- CartPage: useState, useEffect 사용

주문내역 페이지

- OrderPage: useState, useEffect 사용

달라진 점

- 상태 관리
- 부수효과 관리
- 클래스를 함수로
