/*
 * @Description: 
 * @Autor: wangzc
 * @Date: 2020-05-07 10:17:46
 * @LastEditors: wangzc
 * @LastEditTime: 2020-05-07 22:02:02
 */
import * as request from '@common/request'

export function doCaptcha(mobile) {
    return request.post('/api/common/captcha?mobile='+mobile)
}
export function checkCaptcha(mobile, captcha) {
    return request.post('/api/common/checkCaptcha?mobile='+mobile+'&captcha='+captcha)
}
// 下载
export function downWebFile(param) {
    return request.downWebload('/api/common/downWebFile?url='+param.url);
}
