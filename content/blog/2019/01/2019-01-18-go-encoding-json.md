---
slug: "/dev/2019/01/18/go-encoding-json.html"
date: 2019-01-18
title: "Go encoding/json 패키지"
layout: post
category: 개발
tags: [go]
---

소프트웨어는 바이트 단위로 데이터를 인식한다. 97이란 바이트 값을 정수로 보면 97이지만 문자로 보면 "a"다. 메모리 바이트는 해석하는 틀에 따라 달라지는데 이러한 변환을 '**인코딩**' 또는 '**마샬링**'이라고 한다.

Go의 [encoding](https://golang.org/pkg/encoding/)이 이를 담당하는 기본 패키지다. 실제로는 인터페이스 타입만 정의 되어 있고 데이터 형태에 따라 서브 패키지로 기능을 제공한다.

그 중 컴퓨터간 통신을 위한 테이터 포맷인 [encoding/json](https://golang.org/pkg/encoding/json/) 패키지에 대해 살펴 보겠다. 마지막엔 에코(echo) 웹프레임웍에서 이를 어떻게 사용하는지 확인하고 글을 마무리하겠다.

## 마샬링

논리적 구조를 로우 바이트로 변경하는 것을 **'마샬링(Marshaling)'** 혹은 **'인코딩(Encoding)'**이라 표현한다. 정수형이나 구조체 같은 Go 밸류를 바이트 슬라이스로 변경하는 것이다.

json.**Marshal** 함수가 이 역할을 한다.

```go
func Marshal(v interface{}) ([]byte, error)
```

시그니처를 보면 Go에서 모든 타입을 받을수 있는 interface{} 타입을 인자로 받고 바이트 슬라이스를 반환한다는 것을 알 수 있다.

아래 코드로 기본타입을 마샬링 해보자.

```go
b, _ := json.Marshal(true)
fmt.Println(b)         // [116 114 117 101]
fmt.Println(string(b)) // "true"
```

기본 타입 중 하나인 ture 불리언 값을 마샬링하여 바이트 슬라이스를 얻어 내면 4개의 아스키 값이 나온다. 이를 문자열로 변환하면 "true"가 되는 것이다.

합성 타입도 같은 방법으로 마샬링한다.

```go
type User struct {
   Name string
   Age  int
}
var u = User {"Gopher", 7}
b, _ := json.Marshal(u)
fmt.Prinln(b)          // [123 34 78 97 109 101 34 58 34 ...]
fmt.Println(string(b)) // {"Name":"Gopher","Age":7}
```

JSON 키는 보통 소문자로 시작한다. 구조체로 타입을 정의할 때 태그를 이용하면 프로퍼티명을 변경할 수 있다.

```go
type User struct {
   Name string `json:"name"`
   Age  int    `json:"age"`
}
```

User 타입을 마샬링하게되면 이 태그를 참고해 Name을 name으로 변환하는 방식이다. 프로퍼티 이름을 변경하는 것 뿐만 아니라 프로퍼티 출력을 제어하는 옵션도 몇 개 제공한다.

```go
type User struct {
   // 미출력
   Name  string `json:"-"`
   // 문자열로 출력
   Age   int    `json:"age, string"`
   // 값이 비어있으면 미출력
   Phone string `json:"omitempty"`
}
```

들여쓰기를 추가해서 가독성을 높이고 싶다면 json.**MarshalIndent** 함수를 사용한다.

```go
func MarshalIndent(v interface{}, prefix, indent string) ([]byte, error)
```

프로퍼티 이름 앞에 추가되는 prefix와 들여쓰기 문자를 설정하는 indent 인자를 전달한다.

```go
b, _ := json.MarshalIndent(u, "", "  ")
fmt.Println(string(b))
  /*
   {
     "name": "Gopher",
     "age": 7
   }
   */
```

## 언마샬링

반대로 바이트 슬라이스나 문자열을 논리적 자료 구조로 변경하는 것을 **언마샬링(Unmashaling)**이라고 한다. json.**Unmarshal** 이 이 역할을 하는 함수다.

```go
func Unmarshal(data []byte, v interface{}) error
```

불리언 값으로 이루어진 문자열 "true"를 언마샬링 해보자.

```go
var b bool
json.Unmarshal([]byte("true"), &b)
fmt.Printf("%t\n", b) // true
```

첫번째 인자로 바이트 슬라이스를 넘겨주고, 두번째로 결과를 담게될 변수 포인터를 넘겨준다. 시그니처를 보면 모든 타입을 의미하는 interface{}이기 때문에 v의 타입에 따라 언마샬링 하는 방식이다. 출력하면 true 값이 나온다.

합성타입도 마찬가지다.

```go
var s = `{"name":"gopher","age":7}`
var u User
json.Unmarshal([]byte(s), &u)
fmt.Printf("%+v\n", u) // {Name:gopher Age:7}
```

JSON 문자열을 바이트 슬라이스 형태로 넘겨주고 User 타입 변수 u의 포인터를 전달한다. 함수가 실행되면 문자열이 파싱되어 User 값이 생성된다.

## 인코더

많은 데이터를 처리할 때 스트림을 사용하는 것은 현명한 방법이다. json.**Encoder** 타입은 스트림 기반으로 JSON 문자열을 만든다.

```go
type Encoder struct
func NewEncoder(w io.Writer) *Encoder
func (enc *Encoder) Encode(v interface{}) error
```

json.**NewEncoder** 함수로 인코더를 생성하고 json.**Encode** 함수로 Go 밸류를 JSON으로 변환한다.

표준 출력으로 인코딩하는 스트림을 만들어 보자.

```go
u = User {"Gopher", 7}
enc := json.NewEncoder(os.Stdout)
enc.Encode(u)
// {"name":"Gopher","age":7}
```

io.Writer 타입을 인자로 받는 json.NewEncoder에 표준 출력 os.Stdout를 전달한다. 생성된 인코더는 앞으로 입력할 데이터를 표준 출력으로 연결하는 스트림을 갖는다. Encode(u) 로 User 값을 보내면 표준 출력에는 인코딩된 JSON 문자열이 출력된다.

마찬가지로 io.Writer 인터페이스를 따르는 파일도 스트림으로 연결할 수 있다.

```go
f, _ := os.Create("out.txt")
enc := json.NewEncoder(f)
enc.Encode(u)
```

out.txt 파일을 생성한 뒤 json 인코더에 연결했다. 그리고나서 User 값을 보내면 이 파일에 인코딩된 텍스트가 기록된다.

```
$ ls
out.txt
$ cat out.txt
{"name":"Gopher","age":7}
```

마샬링처럼 인코더도 들여쓰기를 설정할 수 있는 **SetIndent** 메소드를 제공한다.

```go
enc := json.NewEncoder(os.Stdout)
enc.SetIndent("", "  ")
enc.Encode(u)
/*
  {
    "name": "Gopher",
    "age": 7
  }
 */
```

## 디코딩

인코딩과 반대로 JSON 문자열을 Go 밸류로 바꾸는 것을 **디코딩(Decoding)**이라고 하는데 json.**Decoder**가 바로 이런 경우 사용하는 타입이다.

```go
type Decoder struct
func NewDecoder(r io.Reader) *Decoder
func (dec *Decoder) Decode(v interface{}) error
```

json.**NewDecoder** 함수로 디코더를 만들고 json.**Decode** 메소드로 JSON 문자열을 Go 밸류로 변경한다.

표준입력에서 들어온 데이터를 스트림 방식으로 디코딩하는 기능을 만들어보자.

```go
var u User
dec := json.NewDecoder(os.Stdin)
dec.Decode(&u)
fmt.Printf("%+v\n", u)
```

io.Reader 타입을 인자로 받는 json.NewDecoder에 표준 입력 os.Stdin을 전달한다. 생성된 디코더는 표준 입력으로 연결된 스트림을 갖게 된다. 표준 입력으로부터 데이터가 들어오면 Decode(&u) 메소드에 의해 User 데이터로 변경되는 것이다.

```
$ {"name":"gopher","age":7}
{Name:gopher Age:7}
```

io.Reader 인터페이스를 만족하는 파일도 마찬가지다.

```
$ cat input.txt
{"name":"gopher",""age": 7}
```

```go
f, _ := os.Open("input.txt")
dec := json.NewDecoder(f)
dec.Decode(&u)
fmt.Printf("%+v\n", u) // {Name:Gopher Age:7}
```

input.txt에 기록된 JSON 문자열을 스트림으로 받아서 User 타입으로 변환하였다. 결과를 출력하면 구조체인 것을 확인할 수 있다.

## 마샬링과 인코딩의 차이

바이트 슬라이스나 문자열을 사용하려면 Marshal/Unmarshal 함수가 적합하다. 만약 표준 입출력이나 파일 같은 Reader/Writer 인터페이스를 사용하여 스트림 기반으로 동작하려면 Encoder/Decoder를 사용한다.

처리 속도는 스트림 방식이 더 낫다. 데이터 크기가 작다면 성능차이를 체감할 수 없지만 비교적 큰 데이터를 다룬다면 스트림 기반의 Encoder/Decoder가 거의 50% 정도 더 빠른 성능을 낸다(출처: Go 언어를 활용한 마이크로서비스 개발 - 에이콘)

## HTTP 서버 핸들러

웹 서버와 클라이언트는 JSON으로 통신한다. 요청 바디로 들어온 JSON 문자열을 구조체로 변환 후 로직에 활용한다. 반대로 응답용 구조체는 JSON문자열로 변환하여 바디에 담아 클라이언트로 전달한다.

Go에서 유명한 웹 프레임웍인 [에코(Echo)](https://github.com/labstack/echo)에서는 내부적으로 encoding/json 패키지를 사용해 이를 구현한다.

서버가 요청을 받으면 요청바디를 Go 밸류로 변경하는데 스트림 방식을 사용하고 있다. DefaultBinder의 [Bind](https://github.com/labstack/echo/blob/master/bind.go#L31) 메소드를 보자

```go
func (b *DefaultBinder) Bind(i interface{}, c Context) (err error) {
  req := c.Request()
  // 생략
  json.NewDecoder(req.Body).Decode(i)
  // 생략
}
```

c.Request() 함수 호출로 반환된 http.Request는 요청 데이터를 담고있는 Body 프로퍼티를 가지고 있다. io.Reader 인터페이스를 구현한 io.ReadClose 타입의 req.Body를 json.NewDecoder 인자로 전달하여 스트림을 생성한다. 그리고 Decode 함수를 이용해 req.Body 값을 스트림 기반으로 디코딩 하는 것이다.

응답 데이터를 보낼 때는 컨택스트의 [json](https://github.com/labstack/echo/blob/master/context.go#L427) 메소드를 호출하는데 여기서도 스트림 방식으로 인코딩된 문자열을 생성한다.

```go
func (c *context) json(code int, i interface{}, indent string) error {
  enc := json.NewEncoder(c.response)
  if indent != "" {
    enc.SetIndent("", indent)
  }
  c.writeContentType(MIMEApplicationJSONCharsetUTF8)
  c.response.WriteHeader(code)
  return enc.Encode(i)
}
```

io.Writer 인터페이스를 구현한 c.Response를 이용해 스트림 기반 인코더를 생성한다. 들여쓰기를 설정하고 헤더값 처리 후 마지막에 Encode() 메소드를 호출하여 i 값을 문자열로 변환한다.

## 정리

encoding/json 패키지는 JSON 문자열(혹은 바이트 슬라이스)과 타입간의 변환시 사용한다.

문자열을 다룰 때는 json.Marshal, json.Unmashal 함수를 사용한다. json.Marshal은 Go 밸류를 JSON 문자열로 변환하고 json.Unmashal은 그 반대 방향으로 동작한다.

스트림 방식으로 데이터를 다룰 때는 json.Encoder, json.Decoder 타입을 사용한다. json.Encoder는 Go 밸류를 JSON 문자열로 변환하고 json.Decoder는 그 반대 방향일 때 사용한다.
