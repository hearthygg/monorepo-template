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

import { CreateTeamDto, TeamControllerCreateData } from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class 团队空间<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 团队空间
   * @name TeamControllerCreate
   * @summary 创建团队空间
   * @request POST:/dev-api/teams
   * @secure
   * @response `201` `TeamControllerCreateData` 创建成功
   * @response `400` `void` 创建失败
   */
  teamControllerCreate = (data: CreateTeamDto, params: RequestParams = {}) =>
    this.request<TeamControllerCreateData, void>({
      path: `/dev-api/teams`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params
    });
}
