import * as request from '@common/request'

export function getNotifyList(param) {
    return request.get('/api/notify/list', param);
}
export function getNotifyInfo(param) {
    return request.get('/api/notify/detail', param);
}
export function updateNotifyReadAll(userId) {
    return request.post('/api/notify/readAll?userId='+userId);
}