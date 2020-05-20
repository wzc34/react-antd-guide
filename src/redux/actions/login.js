import { createAction } from 'redux-actions';
import * as actions from '@redux/constants/actionTypes';
import * as loginServ from '@redux/services/login';
import { error } from '@common/exception';
import constants from '@common/constants';
import methods from '@common/methods'

//登录
export const doLogin = createAction(actions.LOGIN.DO_LOGIN, async ({ account, password }) => {
	try {
		return await loginServ.doLogin(account, password);
	} catch (e) {
		throw error(e);
	}
}, ({ resolved, rejected }) => {
	return {
		resolved,
		rejected
	}
});	

export const doLogout = createAction(actions.LOGIN.DO_LOG_OUT, async () => {
	methods.removeLocalStorage(constants.localKey.token)
	return methods.removeLocalStorage(constants.localKey.accountInfo)
}, ({ resolved, rejected }) => {
	return {
		resolved,
		rejected
	}
});	

export const doRegister = createAction(actions.LOGIN.DO_REGISTER, async ({ phone,password,cnname, company }) => {
	try {
		return await loginServ.doRegister(phone,password,cnname, company);
	} catch (e) {
		throw error(e);
	}
}, ({ resolved, rejected }) => {
	return {
		resolved,
		rejected
	}
});
export const doCheckCompanyName = createAction(actions.LOGIN.DO_CHECK_CNNAME, async ({cnname }) => {
	try {
		return await loginServ.doCheckCompanyName(cnname);
	} catch (e) {
		throw error(e);
	}
}, ({ resolved, rejected }) => {
	return {
		resolved,
		rejected
	}
});
