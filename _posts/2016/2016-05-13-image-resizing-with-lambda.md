---
title: '람다를 이용해 이미지 리사이징 서버 만들기'
layout: post
category: Aws
summary: 'AWS 람다(Lambda)와 S3를 이용해 이미지 리사이징 서버를 만들어 보자'
tags: [aws, lambda, s3, nodejs]
featured_image: /assets/imgs/2016/lambda-002.png
---

![](/assets/imgs/2016/lambda-002.png)

람다. 람다. 람다.

요즘 아마존웹서비스에 [람다(Lambda)](https://aws.amazon.com/ko/lambda/details/)가 인기인가 보다.
특히 API게이트웨이와 연결하면 HTTP 인터페이스로 덧입혀져 인터넷 상의 리소스를 활용할 수 있으니
서버구축이 필요없는 서버도 더이상 말장난은 아는듯 하다.
아니 수평선 끝의 돛대처럼 그 가능성이 조금씩 현실로 드러나기 시작한다.

이번에는 그동안 미루어왔던 AWS 람다서비스의 사용방법에 대해 알아보자.
람다를 이용해 S3에 업로드한 이미지를 리사이징하여 복제하는 예제로 진행할 것이다.


## Hello World 람다 함수

현재 2016. 4. 20일 기준으로 서울 리전에서는 람다서비스를 지원하지 않는다.
가장 가까운 도쿄지역을 선택한다.

람다에서 지원하는 랭기지는 자바, 파이썬, 그리고 노드.
며칠전부터는 노드 v4.3도 지원하기 시작했다.
즉 ES6(ECMAScript 2015)로 코드 작성이 가능하다는 얘기다.

AWS 콘솔의 람다 서비스 페이지에서 시작하자.
"Create a Lambda function"를 클릭하면 블루프린트(blueprint) 선택화면으로 넘어간다.
사용자들이 찾을만한 기능들을 람다 함수로 미리 구현해 놓은 것이다.
간단한 "Hello World" 노드버전의 블루프린트를 선택한다.

![](/assets/imgs/2016/lambda-003.png)

람다함수의 이름을 정하고 롤(role)은 "Basic excution role"을 선택한다.
화면이 하나 뜨면서 람다함수에서 AWS 리소스를 사용한다는 메세지를 확인한다.
그러면 새로운 롤이 생성되는데 "lambda_basic_excution"이라고 만들어 진다.
나머지 모든 설정은 기본으로 유지하고 Next를 클릭한다.

이것으로 람다함수 생성은 끝이다.
만들어진 함수의 동작을 확인해 보자.
코드는 간단히 콘솔로그를 찍는 것이었기 때문에 콘솔 로그를 확인하면 함수가 동작한다는 것을 확인할 수 있다.

```javascript
'use strict';
console.log('Loading function');

exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('value1 =', event.key1);
    console.log('value2 =', event.key2);
    console.log('value3 =', event.key3);
    callback(null, event.key1);  // Echo back the first key value
    // callback('Something went wrong');
};
```

상단의 "Test"를 클릭하면 함수가 동작할 것이다.
그리고 결과는 페이지 하단에 출력된다.

![](/assets/imgs/2016/lambda-004.png)
![](/assets/imgs/2016/lambda-005.png)


## S3 이미지를 복제하는 람다 함수

이번에는 S3에 이미지가 업로드 되었을 때 이벤트를 후킹해서 이미지를 복제하는 람다함수를 만들어보자.

람다 콘솔페이지에 보면 "Event source" 탭이 있는데 이곳에서 람다함수의 동작 트리거를 설정할 수 있다.
"Add event source"를 클릭하여 S3의 특정 버킷을 설정할 수 있다.

![](/assets/imgs/2016/lambda-006.png)

버킷의 "images/" 키로 시작하는 리소스에 대해 람다함수를 실행시킬 것이다.

설정한 S3버킷의 이벤트를 받아와서 이미지 파일을 가져온뒤 다시 업로드하는 코드를 작성해 보자.

```javascript
'use strict';
console.log('Loading function');

const aws = require('aws-sdk')
    , s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name
        , key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        , params = {
              Bucket: bucket,
              Key: key
          };

    // Get image
    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err);
            const message = `Error getting object ${key} from bucket ${bucket}.
            Make sure they exist and your bucket is in the same region as this
            function.`;
            callback(message);
        } else {
            const originalPrefix = 'images/original'
                , copyPrefix = 'images/copy';
                , params = {
                  Bucket: bucket,
                  Key: key.replace(originalPrefix, copyPrefix),
                  ContentType: data.ContentType,
                  Body: data.Body,
                  ACL: 'public-read'
                };
            console.log(`params.Key: ${params.Key}`);

            // Put image
            s3.putObject(params, (err, data) => {
               if (err) {
                  console.log('Upload Error:', err.stack);
                  callback(`Upload error: ${err}`);
               } else {
                   callback(null, `Success upload: ${data}`);
               }
            });
        }
    });
};
```

람다함수는 호출측으로부터 세 개의 파라매터를 전달받는다.

1. `event`는 이벤트 트리거 설정에 따라 발생된 이벤트 정보를 담고 있다.
1. `context`
1. `callback`은 람다 함수 로직이 종료되었을 때 호출한다.

`event` 변수로부터 이미지 파일의 키값을 추출한다.
그리고 `getObject()`로 이미지를 얻어오고 `putObject()`로 다시 업로드한다.
"images/original"에 있는 이미지 파일을 가져와 "images/copy"에 복사하는 것이다.
"aws-sdk" 라이브러리는 기본으로 제공하기 때문에 별도 설치 과정이 필요없다.

설정한뒤 S3에 이미지를 업로드해 보자.
"/images/original" 폴더에 업로드한 이미지가 "/images/copy" 폴더에 복사되었다.

그런데 뭔가 이상하다. 파일이 계속 생성된다.

![](/assets/imgs/2016/lambda-001.png)

순식간에 3,000번이사의 람다함수가 실행되었다.

우리는 이벤트 트리거를 "images/" 에 걸어 놨다.
그런데 "images/copy"에 파일이 복사되면서 이벤트가 발생하기 때문에 또 다시 람다함수가 실행되는 것이다.
무한 반복이다.

트리거 기준을 "images/original"로 변경해서 해결했다.
제대로 돌아간다.


## S3 이미지를 리사이징하는 람다 함수

람다에서 써드파티 라이브러리를 사용하려면 라이브러리 코드를 함께 올려야 한다.
하지만 람다에서 제공하는 [기본 라이브러리](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html)를
사용한다면 그렇지 않아도 된다.
ImageMagic은 이미지 크기를 변경하는 라이브러리인데 기본 라이브러리에 포함되어 있다.

이번 섹션에서는 ImageMagic으로 이미지 리사이징 잡을 수행하는 람다함수를 만들어보자.

```javascript
'use strict';
console.log('Loading function...');

const im = require('imagemagick')
    , aws = require('aws-sdk')
    , s3 = new aws.S3({ apiVersion: '2006-03-01', region: 'ap-northeast-1' }) // Setup S3 region
    , sizes = [300, 600, 900] // Add more image size to resize
    , originalImageKeyPrefix = 'images' // Original image folder
    , resizedImageKeyPrefix = 'copy' // Resized image folder
    , debug = true; // Turn off debug flag on production mode


if (!debug) {
    console.log = () => {};
    console.error = () => {};
}

function getObject(params) {
    console.log('getObject() params', params);
    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err)  reject(err);
            else {
                return resolve({
                    Bucket: params.Bucket,
                    Key: params.Key,
                    ContentType: data.ContentType,
                    Body: data.Body
                });
            }
        });
    });
}

function resize(params) {
    console.log('resize() params', params);
    let tasks = sizes.map(size => {
        return new Promise((resolve, reject) => {
            const p = {
                srcData: params.Body,
                width: size
            };    
            im.resize(p, (err, stdout, stderr) => {
                if (err) reject(err);
                else {
                    const key = `${resizedImageKeyPrefix}/${params.Key.replace(`${originalImageKeyPrefix}/`, '')}.${p.width}`;
                    resolve({
                        Bucket: params.Bucket,
                        Key: key,
                        ContentType: params.ContentType,
                        ACL: 'public-read',
                        Body: ( Buffer.isBuffer(stdout) ) ? stdout : new Buffer(stdout, "binary")
                    });
                }
            });        
        });
    });

    console.log('resize() tasks', tasks);
    return Promise.all(tasks);
}

function putObject(params) {
    console.log('putObject() params', params);
    let tasks = params.map(param => {
        return new Promise((resolve, reject) => {
           s3.putObject(param, (err, data) => {
               if (err)  reject(err);
               else resolve(data);
           });
        });    
    });
    console.log('putObject() tasks', tasks)
    return Promise.all(tasks);
}

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {Bucket: bucket, Key: key};
    console.log('params', params);

    Promise.resolve(params)
        .then(getObject)
        .then(resize)
        .then(putObject)
        .then(result => {
            console.log(result);
            callback(null, result);
        })
        .catch(err => {
            console.error(err);
            callback(err);
        });
};
```

[imageMagic 참고 소스](https://github.com/ysugimoto/aws-lambda-image
https://github.com/rsms/node-imagemagick)

예제 소스는 전통적인 콜백 구조로 짜여져 있었는데 ES6에서 제공하는 프라미스(Promise)를 이용해 코드를 작성해 봤다.
이벤트에서 키와 버킷정보(`params`)를 얻어와 `getObjct()`로 이미지를 가져온다.
`resize()`에서는 가져온 이미지 크기를 조절한다.
그리고 `putObject()`로 리사이징한 이미지들을 업로드한다.

코드를 실행하면 가끔 업로드 되지 않는 경우도 있다.
리사이즈 크기가 1개라면 괜찮은데 여러개일 경우 발생한다.
로그를 보면 타임아웃이 발생한 것으로 나온다.

람다 콘솔페이지의 "Configuration" 탭의 "Advanced settings"에서 관련된 설정을 할수 있다.
메모리 사용량을 늘리고 타임아웃 시간도 10초로 늘렸더니 안정적으로 동작한다.

![](/assets/imgs/2016/lambda-007.png)

이 부분은 실제 람다함수 실행결과를 모니터링하고 최적의 설정으로 맞춰야할 것 같다.
