import { isFSA } from 'flux-standard-action';
import _ from 'lodash';

function isPromise(val) {
	return val && typeof val.then === 'function';
}

export default function promiseMiddleware({ dispatch }) {
	return next => action => {
		if (!isFSA(action)) {
			return isPromise(action)
				? action.then(dispatch)
				: next(action);
		}
		const { meta = {}, payload } = action;

		const id = _.uniqueId();
		if (isPromise(payload)) {
			// console.log(`======== ${action.type} START =======`)
			//通知 reducer 请求开始的 action
			dispatch({
				...action,
				payload: undefined,
				meta: {
					...meta,
					sequence: {
						type: 'start',
						id
					}
				}
			});
			return payload.then(
				//通知 reducer 请求成功结束的 action
				result => {
					// console.log(`======== ${action.type} END =======`)
					dispatch({
						...action,
						payload: result,
						meta: {
							...meta,
							sequence: {
								type: 'next',
								id
							}
						}
					})
				},
				//通知 reducer 请求失败的 action
				error => {
					// console.log(action.type+'通知 reducer 请求失败的 action');
					console.log(`======== ${action.type} ${error.name}:${error.message} =======`);
					dispatch({
						...action,
						payload: error,
						error: true,
						meta: {
							...meta,
							sequence: {
								type: 'next',
								id
							}
						}
					})
				}
			);
		}
		// console.log(action.type+'将action指派给下一个中间件');
		return next(action);
	};
}