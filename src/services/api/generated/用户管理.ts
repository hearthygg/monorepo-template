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

import { UserControllerCreateData, UserControllerFindAllData, UserControllerFindOneData, UserControllerRemoveData, UserControllerUpdateData } from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class 用户管理<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 用户管理
   * @name UserControllerCreate
   * @summary 创建新用户
   * @request POST:/dev-api/users
   * @response `200` `UserControllerCreateData` 请求成功
   * @response `400` `void` 请求参数错误
   * @response `401` `void` 未授权
   * @response `403` `void` 禁止访问
   * @response `404` `void` 资源不存在
   * @response `409` `void` 用户已存在
   * @response `500` `void` 服务器内部错误
   */
  userControllerCreate = (params: RequestParams = {}) =>
    this.request<UserControllerCreateData, void>({
      path: `/dev-api/users`,
      method: 'POST',
      ...params
    });
  /**
   * No description
   *
   * @tags 用户管理
   * @name UserControllerFindAll
   * @summary 获取所有用户
   * @request GET:/dev-api/users
   * @response `200` `UserControllerFindAllData` 请求成功
   * @response `400` `void` 请求参数错误
   * @response `401` `void` 未授权
   * @response `403` `void` 禁止访问
   * @response `404` `void` 资源不存在
   * @response `500` `void` 服务器内部错误
   */
  userControllerFindAll = (params: RequestParams = {}) =>
    this.request<UserControllerFindAllData, void>({
      path: `/dev-api/users`,
      method: 'GET',
      ...params
    });
  /**
   * No description
   *
   * @tags 用户管理
   * @name UserControllerFindOne
   * @summary 获取指定用户
   * @request GET:/dev-api/users/{id}
   * @response `200` `UserControllerFindOneData` 获取成功
   */
  userControllerFindOne = (id: string, params: RequestParams = {}) =>
    this.request<UserControllerFindOneData, any>({
      path: `/dev-api/users/${id}`,
      method: 'GET',
      ...params
    });
  /**
   * No description
   *
   * @tags 用户管理
   * @name UserControllerUpdate
   * @summary 更新用户
   * @request PUT:/dev-api/users/{id}
   * @response `200` `UserControllerUpdateData` 更新成功
   */
  userControllerUpdate = (id: string, params: RequestParams = {}) =>
    this.request<UserControllerUpdateData, any>({
      path: `/dev-api/users/${id}`,
      method: 'PUT',
      ...params
    });
  /**
   * No description
   *
   * @tags 用户管理
   * @name UserControllerRemove
   * @summary 删除用户
   * @request DELETE:/dev-api/users/{id}
   * @response `200` `UserControllerRemoveData` 删除成功
   */
  userControllerRemove = (id: string, params: RequestParams = {}) =>
    this.request<UserControllerRemoveData, any>({
      path: `/dev-api/users/${id}`,
      method: 'DELETE',
      ...params
    });
}
