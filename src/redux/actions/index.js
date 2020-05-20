/*
 * @Description: 
 * @Autor: wangzc
 * @Date: 2020-05-07 10:17:46
 * @LastEditors: wangzc
 * @LastEditTime: 2020-05-07 16:45:17
 */
import * as common from './common'
import * as login from './login'
import * as notify from './notify'
import * as user from './user'

export default {
    ...common,
    ...login,
    ...notify,
    ...user,
}