/*
 * @Description: 
 * @Autor: wangzc
 * @Date: 2020-05-07 10:17:46
 * @LastEditors: wangzc
 * @LastEditTime: 2020-05-07 16:53:40
 */
import * as actions from '@redux/constants/actionTypes';

let initState = {
    loading:false,
};
export default function updateLanguage(state=initState, action) {
    const {payload, error, meta = {}, type} = action;
    const {sequence = {}} = meta;
    if (sequence.type === 'start' || error) {
        return state;
    }
    switch (type) {
        case actions.COMMON.LOADING:
            return {...state,loading: payload.loading};
        default:
            return state;
    }
}