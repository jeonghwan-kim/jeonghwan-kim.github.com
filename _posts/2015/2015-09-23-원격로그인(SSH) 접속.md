---
id: 745
title: 원격로그인(SSH) 접속
date: 2015-09-23T09:27:20+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=745
permalink: /%ec%9b%90%ea%b2%a9%eb%a1%9c%ea%b7%b8%ec%9d%b8ssh-%ec%a0%91%ec%86%8d/
categories:
  - Linux
tags:
  - github
  - ssh
---
원격 로그인 접속이 쉽게 이뤄지는 경우도 있으나 상황에 따라서는 그렇지 않은 경우가 종종 발생합니다. 필요한 상황에 따라 원격 로그인 접속하는 방법에 대해 정리한 글입니다.

<h1>비밀번호 없이 로그인</h1>

공개키를 사용하면 비밀번호 없이 서버에 원격로그인 할 수 있습니다. 편리해서 가장 많이 사용하는 방법이기도 합니다.

서버와 클라이언트 양 측에서 설정 작업을 해야 합니다.

<h3>클라이언트</h3>

공개키를 생성합니다.

<pre><code>$ ssh-kengen -t rsa
</code></pre>

생성시 물어보는 질문에 계속 엔터키를 누르면 홈 폴더의 <code>.ssh</code>폴더에 공개키와 비밀키 파일이 생성됩니다.

<ul>
<li><code>id_rsa</code>: 비밀키</li>
<li><code>id_rsa.pub</code>: 공개키 </li>
</ul>

공개키인 <code>id_rsa.pub</code>를 서버로 보냅니다. 서버로 파일을 보내는 방법은 두 가지가 있습니다.

<ul>
<li>ssh-copy-id</li>
<li>scp</li>
</ul>

ssh-copy-id는 로컬에 저장된 모든 공개키를 서버로 자동으로 전송합니다.

<pre><code>$ ssh-copy-id user@hostname
</code></pre>

그러나 ssh-copy-id는 22번 포트만 사용합니다. 서버의 ssh 데몬이 22번 포트를 사용하지 않는다면 공개키를 보낼수 없습니다. 그럴 경우는 scp 명령어를 사용해야 합니다.

<pre><code>$ scp -P 3000 ~/.ssh/id_rsa.pub user@hostname:/id_rsa.pub
</code></pre>

<h3>서버</h3>

클라이언트에서 scp 명령어로 보낸 공개키는 홈폴더의 <code>id_rsa.pub</code> 파일로 생성되었습니다. 서버는 ~/.ssh/authorized_keys 파일에 공개키를 저장합니다. 만약 서버에 이 파일이 없다면 새로 생성한 뒤, <code>id_rsa.pub</code>의 내용을 추가합니다.

<pre><code>$ touch ~/.ssh/authorized_keys
$ cat ~/id_rsa.pub &gt;&gt; ~/.ssh/authorized_keys
</code></pre>

파일의 권한을 수정합니다.

<pre><code>$ sudo chmod 0700 ~/.ssh
$ sudo chmod 600 ~/.ssh/authorized_keys
</code></pre>

데몬 설정파일 <code>/etc/ssh/sshd_config</code>을 열어 아래 항목들의 주석을 제거하거나 없는 경우 추가합니다.

<pre><code>RSAAuthentication       yes
PubkeyAuthentication    yes
AuthorizedKeysFile      .ssh/authorized_keys
PasswordAuthentication  no
</code></pre>

sshd 데몬을 재구동합니다.

<pre><code>$ sudo service sshd restart
</code></pre>

클라이언트와 서버작업을 모두 마쳤습니다. 이제 클라이언트에서는 비밀번호없이 아래 명령어로 원격로그인을 할수 있습니다.

<pre><code>$ ssh host@username
</code></pre>

<h1>비밀번호로 로그인</h1>

비밀번호 로그인할 경우

<pre><code>$ ssh -o IdentitiesOnly=true user@hostname
</code></pre>

만약 접속되지 않을 경우 서버 데몬 설정파일 <code>/etc/ssh/sshd_config</code>을 변경합니다.

<pre><code>PasswordAuthentication  no
</code></pre>

sshd 재구동 후 로그인을 시도합니다.

<h1>포트번호 지정</h1>

기본 포트 22번이 아닌 3000번 등의 포트를 사용할 경우

<pre><code>$ ssh -p 3000 user@hostname
</code></pre>

<h1>별명</h1>

클라이언트에서 서버로 접속시 클라이언트의 ~/.ssh/config 파일을 이용하여 쉽게 서버에 접속할 수 있습니다. 아래는 ~/.ssh/config의 내용입니다.

<pre><code>Host foo
  Hostname hostname
  Port 22
  User user
</code></pre>

커맨드라인에서 아래 명령어를 입력해보세요.

<pre><code>$ ssh foo
</code></pre>

ssh는 config 파일을 참고하여

<pre><code>$ ssh -p 22 user@hostname
</code></pre>

을 자동으로 실행하여 서버에 접속 시도할 것입니다.

# 참고

샘플 코드: [https://github.com/jeonghwan-kim/ssh-settings](https://github.com/jeonghwan-kim/ssh-settings)