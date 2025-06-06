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

export interface RegisterDto {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 邮箱 */
  email: string;
  /** 昵称 */
  nickname?: string;
}

export interface LoginDto {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
}

export interface UserInfoDto {
  /** 用户ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 昵称 */
  nickname?: string;
  /** 头像URL */
  avatar?: string;
  /** 用户状态 */
  status: string;
}

export interface CreateBookDto {
  /**
   * 图书标题
   * @example "三体"
   */
  title: string;
  /**
   * 作者
   * @example "刘慈欣"
   */
  author: string;
  /**
   * ISBN
   * @example "9787536692930"
   */
  isbn: string;
  /**
   * 出版日期
   * @format date-time
   * @example "2008-01-01"
   */
  publishDate: string;
  /**
   * 价格
   * @example 23
   */
  price: number;
  /**
   * 描述
   * @example "科幻小说"
   */
  description?: string;
  /** 封面图片URL */
  coverUrl?: string;
  /**
   * 库存数量
   * @example 100
   */
  stock: number;
}

export interface UpdateBookDto {
  /**
   * 图书标题
   * @example "三体"
   */
  title?: string;
  /**
   * 作者
   * @example "刘慈欣"
   */
  author?: string;
  /**
   * ISBN
   * @example "9787536692930"
   */
  isbn?: string;
  /**
   * 出版日期
   * @format date-time
   * @example "2008-01-01"
   */
  publishDate?: string;
  /**
   * 价格
   * @example 23
   */
  price?: number;
  /**
   * 描述
   * @example "科幻小说"
   */
  description?: string;
  /** 封面图片URL */
  coverUrl?: string;
  /**
   * 库存数量
   * @example 100
   */
  stock?: number;
}

export interface CreateTeamDto {
  /**
   * 团队空间名称
   * @example "前端团队"
   */
  name: string;
  /**
   * 团队空间的描述信息
   * @example "负责Web前端和移动端应用开发，使用最新的技术栈"
   */
  description: string;
  /** 团队头像 */
  avatar?: string;
}

export interface Team {
  /** 团队ID */
  id: number;
  /** 团队名称 */
  name: string;
  /** 团队描述 */
  description: string;
  /** 团队头像 */
  avatar: string;
  /** 团队状态：active-活跃, inactive-未激活, archived-已归档 */
  status: string;
  /**
   * 创建时间
   * @format date-time
   */
  createdAt: string;
  /**
   * 更新时间
   * @format date-time
   */
  updatedAt: string;
}

export type UserControllerCreateData = any;

export type UserControllerFindAllData = any;

export type UserControllerFindOneData = any;

export type UserControllerUpdateData = any;

export type UserControllerRemoveData = any;

export type AuthControllerRegisterData = any;

export type AuthControllerLoginData = any;

export type AuthControllerGetProfileData = UserInfoDto;

export type AuthControllerSendEmailCodeData = any;

export type BookControllerCreateData = any;

export interface BookControllerFindAllParams {
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
}

export type BookControllerFindAllData = any;

export type BookControllerFindOneData = any;

export type BookControllerUpdateData = any;

export type BookControllerRemoveData = any;

export type TeamControllerCreateData = Team;
