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

export namespace 用户管理 {
  /**
   * No description
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
  export namespace UserControllerCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UserControllerCreateData;
  }

  /**
   * No description
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
  export namespace UserControllerFindAll {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UserControllerFindAllData;
  }

  /**
   * No description
   * @tags 用户管理
   * @name UserControllerFindOne
   * @summary 获取指定用户
   * @request GET:/dev-api/users/{id}
   * @response `200` `UserControllerFindOneData` 获取成功
   */
  export namespace UserControllerFindOne {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UserControllerFindOneData;
  }

  /**
   * No description
   * @tags 用户管理
   * @name UserControllerUpdate
   * @summary 更新用户
   * @request PUT:/dev-api/users/{id}
   * @response `200` `UserControllerUpdateData` 更新成功
   */
  export namespace UserControllerUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UserControllerUpdateData;
  }

  /**
   * No description
   * @tags 用户管理
   * @name UserControllerRemove
   * @summary 删除用户
   * @request DELETE:/dev-api/users/{id}
   * @response `200` `UserControllerRemoveData` 删除成功
   */
  export namespace UserControllerRemove {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UserControllerRemoveData;
  }
}
