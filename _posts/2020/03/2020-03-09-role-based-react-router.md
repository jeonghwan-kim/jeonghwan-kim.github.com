---
title: 리액트 라우터 활용한 권한별 라우팅 제어
layout: post
category: dev
tags: react
---

# 인증과 인가

인증: Authentication, 401, NoAuthriza
인가: Authorization, 403, Forbidden ??

# <Router /> 인테페이스 살펴보기

render 속성을 잘 사용해 보자

# <RouteIf /> 권한별로 라우팅

const ROLE

if ROLE.NONE
if Comonent

# 권한별 라우팅

## 페이지별 권한 테이블

const myRole = {...}

## 권한없음

<RouteIf role={"NONE"}>

## 읽기 권한

<RouteIf role={"READ"}>
UserManagePage: disabled form

## 쓰기 권한

<RouteIf role={"READ"}>
UserManagePage: enabled form

# 정리

전체코드: github.com/jeonghwan-kim/role-based-react-router-sample
