---
id: 786
title: 'SimpleTest &#8211; php unit test'
date: 2015-10-13T17:17:22+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=786
permalink: /simpletest-php-unit-test/
categories:
  - Php
tags:
  - php
  - SimpleTest
  - unit test
---
Php 유닛 테스트 라이브러 중 하나이다. [PHPUnit](https://phpunit.de)과 [SimpleTest](http://www.simpletest.org) 중 후자가 바로 사용하기 간단해 보임.

## 라이브러리 다운로드

```sh
wget -O simpletest.tar.gz http://downloads.sourceforge.net/project/simpletest/simpletest/simpletest_1.1/simpletest_1.1.0.tar.gzö?rö=ö&tsö=1444720494ö&use_mirrorö=jaist
tar zcvf simpletest.tar.gz
ls 
simpletest
```

simpletest 폴더가 생성됨.

## 라이브러리 로딩

```php
require_once('simpletest/autorun.php');
require_once(dirname(__FILE__) . '/../src/math.php');

class MathTestCase extends UnitTestCase {

    function testAdd() {
      $this->assertTrue(Add(1,2) === 3);
    }
}
```

## 테스트 통과할 함수 코딩

함수 인터페이스만 구현한다.

```php
function add($a, $b) {
}
```

## 테스트 실행

```bash
php ./test/math.php

1) Expected true, got [Boolean: false] at [/Users/Chris/Codes/SimpleTest-sample/test/math.php line 8]
	in testAdd
	in MathTestCase
FAILURES!!!
Test cases run: 1/1, Passes: 0, Failures: 1, Exceptions: 0
make: *** [math] Error 1
```

테스트 실패로 떨어짐.

## 함수 본체 작성 

```php
function add($a, $b) {
  return $a + $b;
}
```

다시 테스트하면 통과한다.


```bash
php ./test/math.php

math.php
OK
Test cases run: 1/1, Passes: 1, Failures: 0, Exceptions: 0
```

예제 코드: [https://github.com/jeonghwan-kim/SimpleTest-sample](https://github.com/jeonghwan-kim/SimpleTest-sample)


