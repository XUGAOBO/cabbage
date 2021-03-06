import get from './get';
import {host} from '../utils/constants'

const version = 4;

function replace(str, target, value) {
    if (Array.isArray(target) && Array.isArray(value)) {
        for (let i = 0, len = target.length; i < len; i++) {
            str = str.replace(new RegExp(`${target[i]}`, 'g'), value[i]);
        }
    }
    return str.replace(new RegExp(`${target}`, 'g'), value);
}

const cabbage = {
    // 价格列表
    watchList: `${host}plane/watchList`,
    // 关注列表
    noticeList: `${host}plane/noticeList`,
    // 添加关注
    addList: `${host}plane/addWatch`,
    getBestList:  'http://172.27.35.6:8000/predict'
}

export const watchList = () => get(cabbage.watchList, {userPin: 'xn_test'});
export const noticeList = () => get(cabbage.noticeList, {userPin: 'xn_test'});
export const addList = (po) => get(cabbage.addList, po);
export const getBestList = (po) => get(cabbage.getBestList, po);
