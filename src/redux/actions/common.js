/*
 * @Description: 
 * @Autor: wangzc
 * @Date: 2020-05-07 10:17:46
 * @LastEditors: wangzc
 * @LastEditTime: 2020-05-07 22:02:21
 */
import { createAction } from 'redux-actions';
import * as actions from '@redux/constants/actionTypes';
import * as commonServ from '@redux/services/common';
import { error } from '@common/exception';

export const loading = createAction(actions.COMMON.LOADING, (loading) => {
    return { loading: loading }
});

// 验证码
export const doCaptcha = createAction(actions.COMMON.CAPTCHA, async ({mobile}) => {
	try {
		return await commonServ.doCaptcha(mobile)
	} catch (e) {
		throw error(e);
	}
}, ({ resolved, rejected }) => {
	return {
		resolved,
		rejected
	}
});

// 检查验证码
export const checkCaptcha = createAction(actions.COMMON.CHECK_CAPTCHA, async ({mobile, captcha}) => {
	try {
		return await commonServ.checkCaptcha(mobile, captcha)
	} catch (e) {
		throw error(e);
	}
}, ({ resolved, rejected }) => {
	return {
		resolved,
		rejected
	}
});

export const downWebFile = createAction(actions.COMMON.DO_DOWNLOAD_WEB_FILE, async ({param}) => {
	try {
		return await commonServ.downWebFile(param)
	} catch (e) {
		throw error(e);
	}
}, ({ resolved, rejected }) => {
	return {
		resolved,
		rejected
	}
});

