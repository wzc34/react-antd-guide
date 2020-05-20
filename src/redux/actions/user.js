/*
 * @Description: 
 * @Autor: wangzc
 * @Date: 2020-05-07 10:17:46
 * @LastEditors: wangzc
 * @LastEditTime: 2020-05-07 16:51:46
 */
import { createAction } from 'redux-actions';
import * as actions from '@redux/constants/actionTypes';
import * as userServ from '@redux/services/user';
import { error } from '@common/exception';

export const getUserInfo = createAction(actions.USER.GET_USER_INFO, async ({phone }) => {
	try {
		return await userServ.getUserInfo(phone);
	} catch (e) {
		throw error(e);
	}
}, ({ resolved, rejected }) => {
	return {
		resolved,
		rejected
	}
});
export const updateUserInfo = createAction(actions.USER.UPDATE_USER_INFO, async ({user }) => {
	try {
		return await userServ.updateUserInfo(user);
	} catch (e) {
		throw error(e);
	}
}, ({ resolved, rejected }) => {
	return {
		resolved,
		rejected
	}
});
export const checkUser = createAction(actions.USER.CHECK_USER, async ({account }) => {
	try {
		return await userServ.checkUser(account);
	} catch (e) {
		throw error(e);
	}
}, ({ resolved, rejected }) => {
	return {
		resolved,
		rejected
	}
});
