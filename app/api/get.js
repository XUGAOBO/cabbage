import qs from 'qs';
import { ToastAndroid as Toast } from 'react-native';
import { cacheLatest } from '../storage';

export default async (url, query = null) => {
    query && (url += `?${qs.stringify(query)}`);
    
    let res = {};
    try {
        res = await fetch(url)
        .then((response) => response.json())
        .then((responseJson) => JSON.parse(responseJson))
        // 设置缓存
        // if (url.indexOf('latest') > 0 && url.indexOf('before') === -1) {
        //     cacheLatest.set(res);
        // }
    }
    catch (err) {
        Toast.show('当前网络不可用，请检查你的网络设置', Toast.LONG);

        // 读取缓存
        if (url.indexOf('latest') > 0 && url.indexOf('before') === -1) {
            res = await cacheLatest.get();
        }
        return res;
    }

    return res;
}
