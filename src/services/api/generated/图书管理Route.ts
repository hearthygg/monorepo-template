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

import { BookControllerCreateData, BookControllerFindAllData, BookControllerFindOneData, BookControllerRemoveData, BookControllerUpdateData, CreateBookDto, UpdateBookDto } from './data-contracts';

export namespace 图书管理 {
  /**
   * No description
   * @tags 图书管理
   * @name BookControllerCreate
   * @summary 创建图书
   * @request POST:/dev-api/books
   * @secure
   * @response `201` `BookControllerCreateData` 创建成功
   */
  export namespace BookControllerCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateBookDto;
    export type RequestHeaders = {};
    export type ResponseBody = BookControllerCreateData;
  }

  /**
   * No description
   * @tags 图书管理
   * @name BookControllerFindAll
   * @summary 分页查询图书
   * @request GET:/dev-api/books
   * @secure
   * @response `200` `BookControllerFindAllData` 查询成功
   */
  export namespace BookControllerFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * 页码
       * @default 1
       * @example 1
       */
      page: number;
      /**
       * 每页数量
       * @default 10
       * @example 10
       */
      pageSize: number;
      /** 标题 */
      title?: string;
      /** 作者 */
      author?: string;
      /** ISBN */
      isbn?: string;
      /** 状态 */
      status?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = BookControllerFindAllData;
  }

  /**
   * No description
   * @tags 图书管理
   * @name BookControllerFindOne
   * @summary 获取图书详情
   * @request GET:/dev-api/books/{id}
   * @secure
   * @response `200` `BookControllerFindOneData` 查询成功
   */
  export namespace BookControllerFindOne {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = BookControllerFindOneData;
  }

  /**
   * No description
   * @tags 图书管理
   * @name BookControllerUpdate
   * @summary 更新图书信息
   * @request PATCH:/dev-api/books/{id}
   * @secure
   * @response `200` `BookControllerUpdateData` 更新成功
   */
  export namespace BookControllerUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateBookDto;
    export type RequestHeaders = {};
    export type ResponseBody = BookControllerUpdateData;
  }

  /**
   * No description
   * @tags 图书管理
   * @name BookControllerRemove
   * @summary 删除图书
   * @request DELETE:/dev-api/books/{id}
   * @secure
   * @response `200` `BookControllerRemoveData` 删除成功
   */
  export namespace BookControllerRemove {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = BookControllerRemoveData;
  }
}
