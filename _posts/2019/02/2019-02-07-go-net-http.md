---
title: 'Go net/http 패키지'
layout: post
summary: 
  "Go net/http 패키지 사용법을 살펴봅니다.
  웹 어플리케이션을 개발하려고 Go 언어를 살펴보기 시작했다.
  [앞서 정리한 몇 가지 기본 패키지](/tags#go)는 net/http 패키지를 사용하기 위한 준비 과정이라 생각하자.
  이번에는 네트웍 프로그래밍을 위한 net/http 패키지 사용법을 정리해 보겠다."
category: dev
tags: go
---

웹 어플리케이션을 개발하려고 Go 언어를 살펴보기 시작했다.
[앞서 정리한 몇 가지 기본 패키지](/tags#go)는 net/http 패키지를 사용하기 위한 준비 과정이라 생각하자.
이번에는 네트웍 프로그래밍을 위한 net/http 패키지 사용법을 정리해 보겠다.

## Get 요청하기

브라우져는 사용자가 입력한 url를 통해 해당 웹페이지를 요청한다.
이처럼 웹상의 리소스를 요청하려면 패키지의 **Get** 함수를 사용한다.

```go
func Get(url string) (resp *Response, err error)
```

요청 주소 url을 인자로 받아 Response를 반환하는 함수다.
예제로 구글의 robots.txt 파일을 요청해서 응답 결과를 확인해겠다.

```go
url := "https://google.com/robots.txt"

resp, _ := http.Get(url)
robots, _ := ioutil.ReadAll(resp.Body)
resp.Body.Close()

fmt.Printf("%s\n", robots)
```

Get으로 요청하여 서버로 부터 응답을 받으면 데이터를 읽은 뒤 Close 함수로 바디를 닫아 주어야 한다.

터미널에 출력하면 수신한 파일 내용을 확인할 수 있다.

```
User-agent: *
Disallow: /search
Allow: /search/about
// 생략
```

## Client와 Request로 요청 제어하기

Get 함수는 내부에서 **Client** 구조체를 사용하고 있다.

```go
func Get(url string) (resp *Response, err error) {
  return DefaultClient.Get(url)
}

var DefaultClient = &Client{}
```

요청에 대한 세부적인 제어를 하려면 Client를 하나 생성해야 한다.
가령 자동으로 리다이렉트하는 서버일 경우 요청단에서 이를 차단하여 한 번만 요청할 수 있다.

```go
client := &http.Client{
  CheckRedirect: func(req *http.Request, via []*http.Request) error {
    fmt.Println("redirectPolicyFunc()")
    return http.ErrUseLastResponse // 자동 리다이렉트 하지 않음
  },
}
```

Client 생성시 CheckRedirect 훅에 리다이렉트 관련 동작을 정의했다.
ErrUseLastResponse 값을 리턴하면 리다이렉트를 처리할때 다음 요청을 보내지 않겠다는 의미다.

더불어 **Request** 구조체도 필요한데 NewRequest 함수로 만들 수 있다.

```go
func NewRequest(method, url string, body io.Reader) (*Request, error)
```

요청 메소드, 주소, 바디 데이터를 인자로 받아 Request를 생성한다.

```go
req, _ := http.NewRequest("GET", "https://google.com/robots.txt", nil)
req.Header.Add("set-cookie", "foo=bar") // 헤더값 설정
```

반환된 Request는 헤더 정보를 담고있는 Header의 Add 메소드로 요청 헤더를 설정할 수 있다.

이렇게 준비한 Client와 Request로 요청을 보내기 위해 Client의 Do 메소드를 사용하자.

```go
func (c *Client) Do(req *Request) (*Response, error)
```

이것은 응답 정보를 담은 Response를 반환하기 때문에 ReadAll 함수로 읽을 수 있다.

```go
resp, _ := client.Do(req)
robots, _ := ioutil.ReadAll(resp.Body)
resp.Body.Close()

fmt.Printf("%s\n", robots)
```

서버를 구동한뒤 요청을 보내보면 리다이렉트 요청을 하지 않았기 때문에 다음과 같은 응답을 받게 될 것이다.

```
redirectPolicyFunc()

<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="https://www.google.com/robots.txt">here</A>.
</BODY></HTML>
```

## 서버 구현을 위한 Handler

브라우져가 서버로 요청을 만들면 서버는 해당 요청을 처리하고 응답한다.
이러한 요청/응답 패턴을 추상화한 것이 바로 **Handler** 인터페이스다.

```go
type Handler interface {
  ServeHTTP(ResponseWriter, *Request)
}
```

웹 서버에서 "핸들러"라는 이름은 보통 라우팅할 때 경로에 따른 로직을 가리킬 때 사용한다.
Handler 인터페이스도 마찬가지 역할을 하는데 ServeHTTP 메소드가 응답 헤더와 데이터를 ResponseWriter로 보내는 역할을 한다.

## 서버를 구동하는 ListenAndServe

Handler 인터페이스는 어디에서 사용할까? 가장 쉽게 발견할 수 있는 곳이 바로 서버를 구동하는 **ListenAndServe** 함수다.

```go
func ListenAndServe(addr string, handler Handler) error
```

리슨할 주소 정보와 핸들러를 인자로 받아 서버를 요청대기상태로 만드는 일을하는 함수다.

## 정적 파일 서버를 만들수 있는 FileServe

그럼 Handler 구현체는 뭐가 있을까? 정적 파일을 호스팅하는 **FileServer** 함수가 이를 반환한다.

```go
func FileServer(root FileSystem) Handler
```

웹 프론트엔드 개발시 정적서버를 띄워서 작업하는 경우 파이썬의 SimpleHTTPServer 같은 프로그램을 사용해서 로컬 환경에 개발 서버를 띄운다.
Go를 이용하면 이런 서버를 만드는데 한 줄이면 충분하다.

```go
http.ListenAndServe(":8080", http.FileServer(http.Dir("./public")))
```

코드를 실행하면 서버가 구동될 것이다. 브라우져로 확인해 보면 public 폴더의 정적파일이 다운로드 되는것을 확인 할수 있다.

```
$ tree ./
./
├── main.go
└── public
    ├── index.html
    ├── script.js
    └── style.css

$ go run main.go
```
￼
![정적파일 서버 테스트](/assets/imgs/2019/02/07/static-file-server-test.jpg)

## 핸들러를 등록하는 Handle과 HandleFunc

이번엔 다양한 핸들러를 등록해 보자. **Handle** 함수가 본격적으로 핸들러를 등록하는 함수다.

```go
func Handle(pattern string, handler Handler)
```

url 패턴과 연결할 핸들러를 등록하는 방식이다. 이를 이용해 위에서 구현한 파일 서버를 만들어 보자.

```go
http.Handle("/", http.FileServer(http.Dir("./public")))
http.ListenAndServe(":8080", nil)
```

핸들러 로직을 만들고 싶다면 **HandlerFunc**을 사용한다.

```go
func HandleFunc(pattern string, handler func(ResponseWriter, *Request))
```

가령 "/api" url에 대한 핸들러 함수를 등록하고 싶다면 아래 코드로 시작할 수 있다.

```go
http.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
  // 핸들러 로직을 작성한다.
})

http.ListenAndServe(":8080", nil)
```

## Request로 요청 쿼리 접근하기

핸들러 로직을 작성하려면 먼저 요청 정보에 접근할 수 있어야 할 것이다. **Request** 구조체는 요청 정보를 추상화한다.

```go
type Request struct {
  Method string
  URL    *url.URL
  Header Header
  Body   io.ReadCloser
  Host   string
  Form   url.Values
  // 생략
}
```

쿼리 문자열은 URL을 통해 접근할 수 있다.

```go
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
  fmt.Printf("URL: %#v\n\nQuery: %#v\n\nname: %s\n",
    r.URL,
    r.URL.Query(),
    r.URL.Query().Get("name"))
  })

http.ListenAndServe(":8080", nil)
```

서버를 구동하고 요청을 보내 보자.

```
$ curl "localhost:8080?name=Gopher"
```

서버 로그에 다음과 같이 요청 정보가 출력된다.

```
URL: &url.URL{Scheme:"", Opaque:"", User:(*url.Userinfo)(nil), Host:"", Path:"/", RawPath:"", ForceQuery:false, RawQuery:"name=Gopher", Fragment:""}

Query: url.Values{"name":[]string{"Gopher"}}

name: Gopher
```

## ResponseWriter로 응답하기

핸들러 함수 인자 중 **ResponseWriter**가 응답을 위한 구조체다.

```go
type ResponseWriter interface {
  Header() Header
  Write([]byte) (int, error)
  WriteHeader(statusCode int)
}
```

Write 메소드가 io.Writer 인터페이를 충족하기 때문에 fmt.Fprintf 함수로 출력을 보낼 수 있다.

```go
func Fprintf(w io.Writer, format string, a ...interface{}) (n int, err error)
```

```go
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintf(w, "URL: %#v\n\nQuery: %#v\n\nname: %s\n",
    r.URL,
    r.URL.Query(),
    r.URL.Query().Get("name"))
})

http.ListenAndServe(":8080", nil)
```

서버를 구동하고 요청을 보내면 서버 터미널에 찍현던 로그가 응답 데이터로 전달된다.

## 요청 바디 처리

Request 구조체 안을 잘 살펴보면 io.ReadCloser 타입의 Body가 있는데 요청 바디 데이터를 담고 있는 녀석이다.
이를 Go 구조체로 변경하기 위해서는 encoding/json 패키지를 같이 사용한다.

먼저 요청 바디를 담을 User 구조체를 정의한다.

```go
type User struct {
  Id int `json:"id"`
  Name string `json:"name"`
}
```

그리고 핸들러에서 바디데이터를 디코딩한다. (encoding/json에 대한 설명은 [Go encoding/json 패키지](/dev/2019/01/18/go-encoding-json.html) 참고)

```go
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
  var u User
  json.NewDecoder(r.Body).Decode(&u)
  fmt.Printf("%+v", u)
})

http.ListenAndServe(":8080", nil)
```

서버를 구동하고 요청 바디를 보내 보자.

```
$ curl "localhost:8080" -d '{"id":1,"name":"Gopher"}'
```

서버측 로그를 확인하면 다음과 같이 디코딩된 구조체가 출력된다.

```
{Id:1 Name:Gopher}
```

## JSON 데이터 응답하기

요청 바디 처리와 반대로 JSON 응답은 구조체를 JSON 형식의 문자열로 인코딩한다.

```go
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
  u := User{1, "Gopher"}
  enc := json.NewEncoder(w)

  w.Header().Set("Content-Type", "application/json")

  enc.Encode(u)
})

http.ListenAndServe(":8080", nil)
```

먼저 User 값을 담은 u를 만든다.
NewEncoder를 만들때 io.Writer를 충족하는 ResponseWriter를 인자로 전달해서 엔코더 enc를 만들 수 있다.

ResponseWriter의 Header() 함수는 Header를 반환하는데 Set() 메소드로 헤더 값을 설정할 수 있다.
Content-Type을 "application/json"으로 설정하여 JSON 응답임을 알린다.

마지막으로 User 값 u를 인코딩하여 보내준다.

서버를 구동하고 요청을 보내면 다음과 같이 JSON 응답을 확인할 수 있다.

```
$ curl "localhost:8080" -d '{"id":1,"name":"Gopher"}'  -vs

< Content-Type: application/json

{"id":1,"name":"Gopher"}
```

## 에러 응답을 위한 Error

서버가 정상 응답만하는 것은 아니다. 에러 처리야 말로 신뢰성 있는 서버를 만드는 필수 조건이다.
**Error** 클라이언트에게 에러 헤더와 데이터를 응답하는 함수다.

```go
func Error(w ResponseWriter, error string, code int)
```

에러 문자열 error와 헤더에 설정할 에러코드 code를 인자로 받아 ResponsWriter로 응답하는 함수다.

password 쿼리 문자열을 검증해서 에러를 응답하는 핸들러 함수를 만들어 보자.

```go
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
  pw := r.URL.Query().Get("password")

  if pw == "mypassword" {
    fmt.Fprintln(w, "success")
  } else {
    http.Error(w, "Not Authorized", http.StatusUnauthorized)
  }
})

http.ListenAndServe(":8080", nil)
```

Error 함수 세 번째 인자에 Unauthorized를 의미하는 401 정수를 전달할 수도 있지만 미리 정의된 상수를 이용하는 것이 더 좋다.

```go
const (
  StatusContinue = 100        // RFC 7231, 6.2.1
  // 생략
  StatusOK = 200              // RFC 7231, 6.3.1
  // 생략
  StatusMultipleChoices = 300 // RFC 7231, 6.4.1
  // 생략
)
```

password 쿼리 문자열 없이 요청하면 다음과 같이 에러 응답을 확인할 수 있다.

```
$ curl "localhost:8080" -vs

< HTTP/1.1 401 Unauthorized

Not Authorized
```

## NotFound 에러

404 처럼 잘 알려진 에러는 미리 만들어 놓은 함수 **NotFound** 혹은 **NotFoundHandler** 함수를 사용하면 간편하다.

```go
func NotFound(w ResponseWriter, r *Request)
func NotFoundHandler() Handler { return HandlerFunc(NotFound) }
```

함수 시그니쳐가 이제 눈에 익는다.
NotFound는 핸들러 함수 시그니처와 같고, NotFoundHandler는 Handler 타입을 반환한다.
따라서 Handle이나 HandleFunc 함수로 등록할 수 있다.

```go
http.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintln(w, "Hello world")
})

http.HandleFunc("/", http.NotFound)
// http.Handle("/", http.NotFoundHandler())

http.ListenAndServe(":8080", nil)
```

## 리다이렉트 처리

에러는 아니지만 리다이렉트 응답도 NotFound와 비슷한 시그니처의 함수를 제공한다.

```go
func Redirect(w ResponseWriter, r *Request, url string, code int)
func RedirectHandler(url string, code int) Handler
```

"/will-be-redirected" 로 요청하면 "/api"로 리다이렉트하는 핸들러를 구현해 보자.

```go
http.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintln(w, "Hello world")
})

http.HandleFunc("/will-be-redirected", func(w http.ResponseWriter, r *http.Request) {
  http.Redirect(w, r, "/api", http.StatusMovedPermanently)
})
// http.Handle("/will-be-redirected", http.RedirectHandler("/api", http.StatusMovedPermanently))

http.ListenAndServe(":8080", nil)
```

## 정리

net/http 패키지는 네트웍 요청과 응답을 위한 방법을 제공한다.

Get은 서버로 요청을 만들때 사용하는 함수다. 세부적인 제어를 하려면 Request와 Client 구조체를 사용한다.

응답 처리를 위한 핸들러는 모두 Handler 인터페이스를 따른다.

ListenAndServe 함수에 Handler 를 전달할수 있는데 가장 간단한 것이 FileServer 함수로 만든 핸들러다. 정적 파일 서버를 만드는데 사용한다.

Handle도 Handler를 등록할수 있다. HandleFunc 함수는 핸들러 로직을 작성하여 등록한다.

Request는 요청 정보를 추상화한 구조체다.

ResponseWriter는 응답을 위한 인터페이스다.

에러를 응답할 땐 Error함수를 사용하고 자주 사용하는 응답을 위한 NotFound, NotFoundHandler, Redirect, RedirectHandler가 마련되어 있다.
