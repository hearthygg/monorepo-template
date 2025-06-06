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

export namespace 团队空间 {
  /**
   * No description
   * @tags 团队空间
   * @name TeamControllerCreate
   * @summary 创建团队空间
   * @request POST:/dev-api/teams
   * @secure
   * @response `201` `TeamControllerCreateData` 创建成功
   * @response `400` `void` 创建失败
   */
  export namespace TeamControllerCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateTeamDto;
    export type RequestHeaders = {};
    export type ResponseBody = TeamControllerCreateData;
  }
}
