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
import { ContentType, HttpClient, RequestParams } from './http-client';

export class 认证<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 认证
   * @name AuthControllerRegister
   * @summary 用户注册
   * @request POST:/dev-api/auth/register
   * @response `201` `AuthControllerRegisterData` 注册成功
   * @response `400` `void` 注册失败
   */
  authControllerRegister = (data: RegisterDto, params: RequestParams = {}) =>
    this.request<AuthControllerRegisterData, void>({
      path: `/dev-api/auth/register`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params
    });
  /**
   * No description
   *
   * @tags 认证
   * @name AuthControllerLogin
   * @summary 用户登录
   * @request POST:/dev-api/auth/login
   * @response `200` `AuthControllerLoginData` 登录成功
   * @response `401` `void` 登录失败
   */
  authControllerLogin = (data: LoginDto, params: RequestParams = {}) =>
    this.request<AuthControllerLoginData, void>({
      path: `/dev-api/auth/login`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params
    });
  /**
   * No description
   *
   * @tags 认证
   * @name AuthControllerGetProfile
   * @summary 获取用户信息
   * @request GET:/dev-api/auth/profile
   * @secure
   * @response `200` `AuthControllerGetProfileData` 获取成功
   * @response `401` `void` 未授权
   */
  authControllerGetProfile = (params: RequestParams = {}) =>
    this.request<AuthControllerGetProfileData, void>({
      path: `/dev-api/auth/profile`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params
    });
  /**
   * No description
   *
   * @tags 认证
   * @name AuthControllerSendEmailCode
   * @summary 发送邮箱验证码
   * @request POST:/dev-api/auth/send-email-code
   * @response `200` `AuthControllerSendEmailCodeData` 验证码发送成功
   */
  authControllerSendEmailCode = (params: RequestParams = {}) =>
    this.request<AuthControllerSendEmailCodeData, any>({
      path: `/dev-api/auth/send-email-code`,
      method: 'POST',
      ...params
    });
}
