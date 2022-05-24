---
title: AWS를 슬랙으로 모니터링
layout: post
category: 개발
slug: /2018/10/21/aws-sns-to-slack.html
date: 2018-10-21
tags: [aws, slack]
summary: AWS 빈스톡 상태를 슬랙으로 모니터링 하는 방법을 정리합니다.
---

여러 서비스를 AWS 기반으로 운영하면서 가장 많이 사용하는 컴퓨팅 서비스가 빈스톡(Elastic Beanstalk)이다. 플래폼이나 로드밸런서 같은 서버 세팅작업을 대폭 줄여주기 때문이다. 클릭과 설정 코드 몇 줄이면 단숨에 쓸만한 서버를 뚝딱 만들어 내기 때문에 데브웁스에게는 그야말로 제격이다.

빈스톡이 제공하는 기능 중 하나인 알림은 등록한 이메일 주소로 빈스톡 환경 변화를 알려준다. AWS 대쉬보드에 들어가지 않더라도 서버 정보를 메일로 확인할 수 있다.

하지만 이메일은 놓칠 때가 있는데 휴일이면 더 그렇다. 반변 회사 메신저로 사용하는 슬랙은 항상 보고 있고 주말에도 왕왕 들어가는 편이다. 이미 슬랙으로 인프라 모니터링하는 곳이 많아지는 추세인듯 하다.

이번 글은 서비스 장애와 관련한 후속조치 중 하나인 **빈스톡+슬랙 연동 작업**을 정리하는 내용이다.

## 방법

빈스톡의 알림 기능은 AWS SNS(Simple Notification Service)와 관련있다. 빈스톡 어플리케이션 환경을 만들면 자동으로 SNS 주제(Topic)가 생성되는데, 이것은 빈스톡 측에서 주요 알람을 SNS로 전달하려는 목적이다.

실제 빈스톡을 만든 뒤 SNS 대쉬보드에서 확인하면 새로운 주제가 생성된다.

![Topic](/assets/imgs/2018/10/22/topic.png)

이름이 ElasticBeanstalkNotifications-Environment-APP-ENV 형식이다.

하나의 주제에는 여러 개의 구독(Subscription)을 추가할 수 있는데 기본적으로 이메일 프로토콜이 추가된다. 주제에서 발행할 메세지를 이메일로 보내겠다는 의미다. 빈스톡에서 설정했던 이메일 주소가 구독으로 생성된걸 확인할 수 있다.

![subscription](/assets/imgs/2018/10/22/subscription.png)

구독은 이메일 뿐만 아니라 HTTP, 람다, SQS 등의 프로토콜로 추가할 수 있는데 우리는 AWS 람다를 선택했다. 람다에서 이 메세지를 받으면 적절한 포맷으로 변환해 슬랙 웹 훅으로 보내면 되기 때문이다.

![idea](/assets/imgs/2018/10/22/idea.png)

## 람다 함수 생성

그럼 먼저 람다 함수 스캐폴딩부터 만들어 보자.

```js
exports.handler = event => {
  console.log(event)
}
```

핸들러 함수를 모듈로 노출하는 것이 람다 함수의 시작이다. 빈스톡이 SNS을 통해 어떤 메세지를 보내는지부터 확인하려고 로그를 찍었다.

## 구독 생성

방금 만든 람다 함수를 이용해 구독을 만든다.

![create-subscription](/assets/imgs/2018/10/22/create-subscription.png)

프로토콜을 AWS Lambda로 선택하면 엔드포인트 메뉴가 보이는데 방금 만든 람다 함수를 선택하면 된다. 구독 생성 버튼을 클릭한 뒤, 빈스톡에 배포 이벤트를 발생하면 람다 함수가 로그를 찍는데 아래와 같은 형식이다.

```json
{
  "Records": [
    {
      "EventSource": "aws:sns",
      "EventVersion": "1.0",
      "EventSubscriptionArn": "arn:aws:sns:ap-northeast-2:151095201970:ElasticBeanstalkNotifications-Environment-APP-ENV:1111-1111-1111-1111",
      "Sns": {
        "Type": "Notification",
        "MessageId": "1111-1111-1111-1111",
        "TopicArn": "arn:aws:sns:ap-northeast-2:111111:ElasticBeanstalkNotifications-Environment-APP-ENV",
        "Subject": "AWS Elastic Beanstalk Notification - Environment health has transitioned from Ok to Info. Applica......",
        "Message": "Timestamp: Tue Sep 18 01:53:46 UTC 2018\nMessage: Environment health has transitioned from Ok to Info. Application update in progress on 1 instance. 0 out of 1 instance completed (running for 19 seconds).\n\nEnvironment: APP-ENV\nApplication: APP\n\nEnvironment URL: http://APP-ENV.ap-northeast-2.elasticbeanstalk.com\nNotificationProcessId: ed05c426-fe75-46c9-9ca2-c03d53d85e25",
        "Timestamp": "2018-09-18T01:54:04.516Z",
        "SignatureVersion": "1",
        "Signature": "VaxT10......",
        "SigningCertUrl": "https://sns.ap-northeast-2.amazonaws.com/SimpleNotificationService-111111.pem",
        "UnsubscribeUrl": "https://sns.ap-northeast-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:ap-northeast-2:151095201970:ElasticBeanstalkNotifications-Environment-APP-ENV:......",
        "MessageAttributes": {}
      }
    }
  ]
}
```

필요한건 `Records[0].Sns.Message` 값이다.

```json
"Timestamp: Tue Sep 18 01:53:46 UTC 2018\nMessage: Environment health has transitioned from Ok to Info. Application update in progress on 1 instance. 0 out of 1 instance completed (running for 19 seconds).\n\nEnvironment: APP-ENV\nApplication: R2\n\nEnvironment URL: http://APP-ENV.ap-northeast-2.elasticbeanstalk.com\nNotificationProcessId: ed05c426-fe75-46c9-9ca2-c03d53d85e25"
```

개행문자로 구분된 문자열인데 잘라서 보면 이렇다.

```json
  "Timestamp": "Tue Sep 18 01:53:46 UTC 2018"
  "Message": "Environment health has transitioned from Ok to Info. Application update in progress on 1 instance. 0 out of 1 instance completed (running for 19 seconds)."
  "Environment": "APP-ENV"
  "Application": "APP"
  "Environment URL": "http://APP-ENV.ap-northeast-2.elasticbeanstalk.com\nNotificationProcessId: ed05c426-fe75-46c9-9ca2-c03d53d85e25"
```

빈스톡 환경 이름이 `Environment` 키에 문자열로 담겨있고, 자세한 내용은 `Message`에 문장으로 담겨있다. 이 정보만 이용해서 슬랙에 메세지를 보내면 충분하겠다.

SNS가 보내는 메세지 형식과 슬랙으로 보낼 정보를 정했으니 람다 함수 로직작성만 남았다.

## 환경 변수

슬랙 웹훅 주소(`SLACK_WEBHOOOK_PATH`)와 채널명(`SLACK_CHANNEL`)을 환경 변수로 뺐다. 슬랙 메세지에서 사용할 아이콘, 사용자 이름도 환경변수로 만들었다. 빈스톡에 문제가 발생할때 보내는 메세지에는 특정 단어가 포함되는데 그것도 환경 변수로 빼서 나중에 쉽게 추가할 수 있도록 변경의 여지를 뒀다.

```js
const webhookPath = process.env.SLACK_WEBHOOK_PATH
const channel = process.env.SLACK_CHANNEL
const icon_emoji = process.env.ICON_EMOJI || ":robot_face:"
const username = process.env.USERNAME || "AWS"
const errorKeywords =
  process.env.ERROR_KEYWORDS || "Unsuccessful command, to Degraded, Failed"
```

혹시 몰라서 필수 환경 변수 체크하는 함수도 만들었다. 람다 개발환경이 그렇게 편하지는 않았기 때문이다.

```js
const validateEnvVars = _ => {
  const tag = "[ENVIRONMENT VARIABLE ERROR]"
  if (!webhookPath) throw Error(`${tag} SLACK_WEBHOOK_PATH is required`)
  if (!channel) throw Error(`${tag} SLACK_CHANNEL is required`)
}

exports.handler = event => {
  validateEnvVars()
}
```

## 슬랙 메세지 생성

환경 변수 검증을 마치고 본격적으로 슬랙 메세지를 만든다.

```js
const postData = JSON.stringify({
  channel,
  icon_emoji,
  username,
  attachments: buildAttachments(event),
})
```

channel, icon_emoji, username은 모두 환경 변수를 그대로 사용했다. attachments를 만드는 `buildAttachements()` 함수에 SNS로 부터 받은 `event`를 전달해 실행한다.

attachment 를 만드는 로직으로 넘어가자.

```js
const buildAttachments = event => {
  const msgMap = parseSnsMsg(event.Records[0].Sns)
  if (!msgMap) return ""

  const { Message, Environment } = msgMap

  const color = isErrorMessage(Message) ? "danger" : "good"
  return [
    {
      author_name: Environment,
      text: highlightMessage(Message),
      color,
    },
  ]
}
```

이벤트를 받아서 Sns 메세지를 파싱한 후 키/밸류의 맵으로 만든뒤 `msgMap` 변수에 저장했다. (구현 전이지만) 이 맵에는 우리가 최종적으로 원하는 `Message`와 `Environment` 정보가 있을 것이다.

슬랙 메세지는 "danger", "good" 문자열로 메세지에 색상을 추가할수 있는데 메세지에 에러문구가 있는지 확인(`isErrorMessage(Message)`)한 뒤 색상 값을 `color`변수에 저장했다. 그리고 나서 `author_name`, `text`, `color` 로 이뤄진 객체 배열을 반환한다.

text를 만들때 첫 문장만 `highlightMessage()` 함수로 강조했다.

```js
const highlightMessage = msg => {
  const sentences = msg.split(".")
  sentences[0] = `*${sentences[0]}*`
  return sentences.join(".")
}
```

## SNS 메세지 파싱

SNS 메세지를 파싱하는 `parseSnsMsg()` 함수를 더 살펴보자.

```js
const parseSnsMsg = ({ Message }) => {
  try {
    const isPlainText = !Message.includes("\n")
    if (isPlainText) return Message

    const parts = Message.split("\n")
    const data = {}
    parts.forEach(part => {
      part = part.trim()
      if (!part) return
      if (!part.includes(":")) return
      let [key, value] = part.split(":")
      key = key.trim()
      value = value.trim()
      if (!key || !value) return
      data[key] = value
    })
    return data
  } catch (e) {
    return null
  }
}
```

개행문자가 있는지 체크하고 없으면 일반 문장이므로 그대로 반환한다. 개행문자를 기준으로 문자열을 잘라 (`parts`) 하나씩 체크하면서 키/밸류 형태의 객체(`data`)를 만들어 낸다. 마지막엔 이것을 반환하는 알고리즘이다.

## 노드로 슬랙 웹훅 호출하기

슬랙 웹 훅은 https 프로토콜을 사용하기 때문에 노드의 `https` 모듈을 이용해 호출한다.

```js
const https = require("https")

const options = {
  port: 443,
  method: "POST",
  hostname: "hooks.slack.com",
  path: webhookPath,
  headers: {
    "Content-Type": "application/json",
    "Content-Length": postData.length,
  },
}

const req = https.request(options, res => {
  res.on("data", d => process.stdout.write(d))
})
req.on("error", e => console.error(e))
req.write(postData)
req.end()
```

## 환경 변수 설정

마지막으로 람다 대쉬보드에서 코드에서 사용할 환경 변수를 등록한다.

![env](/assets/imgs/2018/10/22/env.png)

## 슬랙 메세지 확인

자! 그러면 슬랙 메세지를 확인해 보자.

빈스톡 환경 이름과 상태 메세지가 전달되었다. 기본 알람이기 때문에 "good"이 의미하는 녹색으로 표시된다.

![good](/assets/imgs/2018/10/22/good.png)

경고일 경우는 "danger"로 설정했고 빨간색으로 표시된다.

![danger](/assets/imgs/2018/10/22/danger.png)

샘플 코드: [jeonghwan-kim/awsSnsToSlack](https://github.com/jeonghwan-kim/awsSnsToSlack)
