import qs from 'query-string';
import constants from './constants';
import methods from './methods';
var CryptoJS = require("crypto-js");
// const urlPrefix = 'http://192.168.1.106:8080'
const urlPrefix = process.env.REACT_APP_API;
// const isProd = process.env.NODE_ENV === 'production'

function saveToken(token) {
	if(token && token!==null){
		token = CryptoJS.AES.encrypt(token, constants.secretKey).toString();
		//解决malformed utf-8 data问题
		token = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(token));
		methods.setLocalStorage(constants.localKey.token, token)
	}
}

function genHeader(){
	var header = constants.headers
	//...
	return header
}

function filterJSON(res) {
	if (res._bodyText || res.body || res._bodyBlob) {
		return res.json();
	}
	return null;
}

function filterStatus(res) {
	saveToken(res.headers.get('client-token'))
	if (res.status >= 200 && res.status < 300) {
		return res
	}
	let error = new Error('处理异常');
	error.name = res.status
	error.type = 'http';
	throw error;
}

function filterData(res,url,metaData) {
	if(res && res.code && res.code !== 200){
		let error = new Error(res.message);
		error.type = 'warn';
		error.name = res.code
		// console.log('url', url,'code==>',res.code)
		if(res.code===1007){
			//token刷新时间过期重新登录
			setInterval(() => {
				methods.removeLocalStorage(constants.localKey.token)
				methods.removeLocalStorage(constants.localKey.accountInfo)				
				window.location.href='/login'
			}, 1000*3);
		}else if(res.code===1005){
			//token过期，需要重新刷新token
			// ...
		}
		throw error;
	}
	return res.data
}


function sendRequest(url,metaData) {
	return fetch(url, metaData)
	.then(res=>{
		return filterStatus(res)
	})
	.then(res=>{
		return filterJSON(res)
	})
	.then(res=>{
		return filterData(res,url,metaData)
	})
	.catch((e) => {
		throw e;
	});
}

export function get(url, params) {
	url = urlPrefix + url;
	if (params) {
		url += `?${qs.stringify(params)}`;
	}

	return sendRequest(url,{
		method: 'GET',
		headers: genHeader(),
	})
}


export function post(url, body) {
	url = urlPrefix + url;

	if (body) {
		body = JSON.stringify(body)
	}
	return sendRequest(url,{
		method: 'POST',
		headers: genHeader(),
		body: body
	})
}

export function downWebload(url, params) {
	url = urlPrefix + url;
	if (params) {
		url += `?${qs.stringify(params)}`;
	}
	const metaData = {
		method: 'GET',
		headers: genHeader(),
	}
	return fetch(url, metaData)
		.then(res=>{
			return filterStatus(res)
		})
		.then(res=>{
			return res
		})
		.catch((e) => {
			throw e;
		})
}

export function del(url, params) {
	url = urlPrefix + url;
	if (params) {
		url += `?${qs.stringify(params)}`;
	}

	return sendRequest(url, {
		method: 'DELETE',
		headers: genHeader(),
	})
};

export function put(url, params, json) {
	url = urlPrefix + url;
	let _header = {};
	if (params) {
		if(!json){
			url += `?${qs.stringify(params)}`;
			_header ={
				method: 'PUT',
				headers: genHeader()
			}
		}else{//api接收为entity
			_header ={
				method: 'PUT',
				headers: genHeader(),
				body: JSON.stringify(params)
			}
		}
	}

	return sendRequest(url, _header)
};


