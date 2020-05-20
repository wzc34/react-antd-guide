import { message } from 'antd';
export default function utilsMiddleware({ dispatch }) {
	return next => action => {
		const { payload, error } = action;
		let msg
		if (error) {
			msg = payload.message
			if (typeof msg == 'object' && msg) {
				msg = JSON.stringify(msg)
			}
		}
		if (error && payload.type === 'http') {
			message.warning(`${msg}`)
		}
		if (error && payload.type === 'error') {
			message.destroy()
			message.error(`${msg}`)
		}
		if (error && payload.type === 'warn') {
			message.warning(`${msg}`)
		}
		if (error && payload.type === 'info') {
			message.info(`${msg}`)
		}
		next(action);
	}
}
