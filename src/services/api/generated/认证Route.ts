/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { AuthControllerGetProfileData, AuthControllerLoginData, AuthControllerRegisterData, AuthControllerSendEmailCodeData, LoginDto, RegisterDto } from './data-contracts';

export namespace 认证 {
  /**
   * No description
   * @tags 认证
   * @name AuthControllerRegister
   * @summary 用户注册
   * @request POST:/dev-api/auth/register
   * @response `201` `AuthControllerRegisterData` 注册成功
   * @response `400` `void` 注册失败
   */
  export namespace AuthControllerRegister {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RegisterDto;
    export type RequestHeaders = {};
    export type ResponseBody = AuthControllerRegisterData;
  }

  /**
   * No description
   * @tags 认证
   * @name AuthControllerLogin
   * @summary 用户登录
   * @request POST:/dev-api/auth/login
   * @response `200` `AuthControllerLoginData` 登录成功
   * @response `401` `void` 登录失败
   */
  export namespace AuthControllerLogin {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LoginDto;
    export type RequestHeaders = {};
    export type ResponseBody = AuthControllerLoginData;
  }

  /**
   * No description
   * @tags 认证
   * @name AuthControllerGetProfile
   * @summary 获取用户信息
   * @request GET:/dev-api/auth/profile
   * @secure
   * @response `200` `AuthControllerGetProfileData` 获取成功
   * @response `401` `void` 未授权
   */
  export namespace AuthControllerGetProfile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AuthControllerGetProfileData;
  }

  /**
   * No description
   * @tags 认证
   * @name AuthControllerSendEmailCode
   * @summary 发送邮箱验证码
   * @request POST:/dev-api/auth/send-email-code
   * @response `200` `AuthControllerSendEmailCodeData` 验证码发送成功
   */
  export namespace AuthControllerSendEmailCode {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AuthControllerSendEmailCodeData;
  }
}
