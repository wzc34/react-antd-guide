/*
 * @Description: 
 * @Autor: wangzc
 * @Date: 2020-05-07 10:17:46
 * @LastEditors: wangzc
 * @LastEditTime: 2020-05-07 16:52:07
 */
import * as request from '@common/request'

export function getUserInfo(phone) {
    return request.post('/api/userInfo/data', {phone})
}
export function updateUserInfo(user) {
    return request.post('/api/userInfo/update', user)
}
export function checkUser(account) {
    return request.get('/api/userInfo/checkUser', {account})
}