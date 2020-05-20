/*
 * @Description: 
 * @Autor: wangzc
 * @Date: 2020-05-07 16:44:20
 * @LastEditors: wangzc
 * @LastEditTime: 2020-05-11 10:54:52
 */
import { createAction } from 'redux-actions';
import * as actions from '@redux/constants/actionTypes';
import * as notifyServ from '@redux/services/notify';
import { error } from '@common/exception';
import events from '@common/events'

export const getNotifyList = createAction(actions.NOTIFY.GET_NOTIFY_LIST, async ({param}) => {
	try {
		return await notifyServ.getNotifyList(param)
	} catch (e) {
		throw error(e);
	}
}, ({ resolved, rejected }) => {
	return {
		resolved,
		rejected
	}
});	
export const getNotifyInfo = createAction(actions.NOTIFY.GET_NOTIFY_INFO, async ({param}) => {
	try {
		events.emit('event_sync_task')
		return await notifyServ.getNotifyInfo(param)
	} catch (e) {
		throw error(e);
	}
}, ({ resolved, rejected }) => {
	return {
		resolved,
		rejected
	}
});	

export const updateNotifyReadAll = createAction(actions.NOTIFY.UPDATE_NOTIFY_READ_ALL, async ({userId}) => {
	try {
		return await notifyServ.updateNotifyReadAll(userId)
	} catch (e) {
		throw error(e);
	}
}, ({ resolved, rejected }) => {
	return {
		resolved,
		rejected
	}
});	

