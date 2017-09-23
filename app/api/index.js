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
    noticeList: `${host}plane/noticeList`
}

export const watchList = () => get(cabbage.watchList, {userPin: 'xn_test'});
export const noticeList = () => get(cabbage.noticeList, {userPin: 'xn_test'});
