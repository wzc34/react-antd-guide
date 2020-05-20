import * as request from '@common/request'

export function doLogin(account, password) {
    return request.post('/api/login?account='+account+'&password='+password)
}

export function doRegister(phone,password,cnname, company) {
    return request.post('/api/regist?phone='+phone+'&password='+password+'&cnname='+cnname, company)
}

export function doCheckCompanyName(cnname) {
    return request.get('/api/company/third/search?cnname='+encodeURI(cnname))
}