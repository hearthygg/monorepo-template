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

import { BookControllerCreateData, BookControllerFindAllData, BookControllerFindAllParams, BookControllerFindOneData, BookControllerRemoveData, BookControllerUpdateData, CreateBookDto, UpdateBookDto } from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class 图书管理<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 图书管理
   * @name BookControllerCreate
   * @summary 创建图书
   * @request POST:/dev-api/books
   * @secure
   * @response `201` `BookControllerCreateData` 创建成功
   */
  bookControllerCreate = (data: CreateBookDto, params: RequestParams = {}) =>
    this.request<BookControllerCreateData, any>({
      path: `/dev-api/books`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params
    });
  /**
   * No description
   *
   * @tags 图书管理
   * @name BookControllerFindAll
   * @summary 分页查询图书
   * @request GET:/dev-api/books
   * @secure
   * @response `200` `BookControllerFindAllData` 查询成功
   */
  bookControllerFindAll = (query: BookControllerFindAllParams, params: RequestParams = {}) =>
    this.request<BookControllerFindAllData, any>({
      path: `/dev-api/books`,
      method: 'GET',
      query: query,
      secure: true,
      ...params
    });
  /**
   * No description
   *
   * @tags 图书管理
   * @name BookControllerFindOne
   * @summary 获取图书详情
   * @request GET:/dev-api/books/{id}
   * @secure
   * @response `200` `BookControllerFindOneData` 查询成功
   */
  bookControllerFindOne = (id: string, params: RequestParams = {}) =>
    this.request<BookControllerFindOneData, any>({
      path: `/dev-api/books/${id}`,
      method: 'GET',
      secure: true,
      ...params
    });
  /**
   * No description
   *
   * @tags 图书管理
   * @name BookControllerUpdate
   * @summary 更新图书信息
   * @request PATCH:/dev-api/books/{id}
   * @secure
   * @response `200` `BookControllerUpdateData` 更新成功
   */
  bookControllerUpdate = (id: string, data: UpdateBookDto, params: RequestParams = {}) =>
    this.request<BookControllerUpdateData, any>({
      path: `/dev-api/books/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params
    });
  /**
   * No description
   *
   * @tags 图书管理
   * @name BookControllerRemove
   * @summary 删除图书
   * @request DELETE:/dev-api/books/{id}
   * @secure
   * @response `200` `BookControllerRemoveData` 删除成功
   */
  bookControllerRemove = (id: string, params: RequestParams = {}) =>
    this.request<BookControllerRemoveData, any>({
      path: `/dev-api/books/${id}`,
      method: 'DELETE',
      secure: true,
      ...params
    });
}
