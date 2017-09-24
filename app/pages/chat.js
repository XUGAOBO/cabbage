import React, {
  Component
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Platform,
  PermissionsAndroid,
  FlatList,
  Button,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {
  AudioRecorder,
  AudioUtils
} from '../recorder';

import MessageItem from '../components/messageItem'
import Modal from 'react-native-modal';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import * as api from '../api';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0.0, //开始录音到现在的持续时间
      recording: false, //是否正在录音
      stoppedRecording: false, //是否停止了录音
      finished: false, //是否完成录音
      audioPath: AudioUtils.DownloadsDirectoryPath + '/sample.pcm', //路径下的文件名
      hasPermission: undefined, //是否获取权限
      modalVisible: false,
      currentFlight: null,
      dataSource: [
          {
            owner: 'robot',
            content: '您好,请问有什么需要帮您的吗?'
          }
      ],
    };
    this.prepareRecordingPath = this.prepareRecordingPath.bind(this);     //执行录音的方法
    this.checkPermission = this.checkPermission.bind(this);               //检测是否授权
    this.record = this.record.bind(this);                                 //录音
    this.stop = this.stop.bind(this);                                     //停止
    this.finishRecording = this.finishRecording.bind(this);
  }
  componentDidMount() {
    // 页面加载完成后获取权限
    this.checkPermission().then((hasPermission) => {
      this.setState({
        hasPermission
      });

      //如果未授权, 则执行下面的代码
      if (!hasPermission) return;
      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = (data) => {
        this.setState({
          currentTime: Math.floor(data.currentTime)
        });
      };

      AudioRecorder.onFinished = (data) => {
        if (Platform.OS === 'ios') {
          this.finishRecording(data.status === "OK", data.audioFileURL);
        }
      };
    })
  }

  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      sampleRateInHz: 16000,
      channelConfig: 'CHANNEL_IN_MONO',
      audioEncoding: 'ENCODING_PCM_16BIT',
    });
  }

  checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    const rationale = {
      'title': '获取录音权限',
      'message': 'XXX正请求获取麦克风权限用于录音,是否准许'
    };

    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      .then((result) => {
        return (result === true || PermissionsAndroid.RESULTS.GRANTED)
      })
  }

  async record() {
    if (this.state.recording) {
      console.warn('正在录音中!');
      return;
    }
    if (!this.state.hasPermission) {
      console.error('没有获取录音权限!');
      return;
    }
    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }
    this.setState({
      recording: true
    });
    try {
      await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  async stop() {
    if (!this.state.recording) {
      return;
    }

    this.setState({
      stoppedRecording: true,
      recording: false
    });

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === 'android') {
        this.finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }

  }

  _onPressInButton() {
    this.record();
  }
  _onPressOutButton() {
    this.stop();
  }

  async finishRecording(didSucceed, filePath) {
    this.setState({
      finished: didSucceed
    });
    let recordDuration = this.state.currentTime;
    let newMsg = [];
    if(recordDuration < 0.5) {
      ToastAndroid.showWithGravity(
        '说话时间太短,再来一次行吧',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      )
    } else {
      const res = await this._upload();
      this._hideModal();
      if(res.status == 200 ) {
        res = res.body;
        newMsg.push({ // 用户录制的音频
           owner: 'user',
           content: res.ask
          });
        if(res.status == 1) { // 请求机票接口,,------不知道显示啥东西 // ToDo
          _setCurrentFlight(res.answer);
          const bestData = await this.getBestFlight(res.answer); // 最优航班
          newMsg = [{
            owner: 'robot',
            content: `${bestData}-是否为你订阅此段行程？`
          }]
        }else if(res.status == 2) { // 语音解析成功，交互结果
          newMsg.push({
            owner: 'robot',
            content: res.answer.text
          });
        }else if(res.status == 3) {
            newMsg.push({
                owner: 'robot',
                content: res.answer
              });
        } else if ( res.status == 4) {
            newMsg.push({
                owner: 'robot',
                content: '我好像没听懂'
              });
        }else if(res.status == 5) { // 订阅成功
          this.setState({
            currentFlight: 
          });
          await this._addWatch();
          newMsg.push({
            owner: 'robot',
            content: '好的，已为您订阅，您可以在“关注”中查看此行程的购买建议。'
          })
        }
      } else if(res.status == 404) {
        ToastAndroid.showWithGravity(
          '系统异常',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
      }else {
        ToastAndroid.showWithGravity(
          '不好意思,我们解析不了',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
      }
       this._showMessage(newMsg);
    }
  }

  async getBestFlight(params) {
      let po = {};
      params.forEach((item) => {
        if (item.name == 'startLoc.city') {
            po.arrCity = item.normValue;
        }
        if (item.name == 'endLoc.city') {
            po.depCity = item.normValue;
        }
        if (item.name == 'startDate') {
            po.depTime = item.normValue;
        }
      });
      const data = await api.addList();
    // const res = await fetch('url', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(params)
    // })
    // return res.json();
  }

  _setCurrentFlight(params) {
    let po = {};
    params.forEach((item) => {
      if (item.name == 'startLoc.city') {
          po.arrCity = item.normValue;
      }
      if (item.name == 'endLoc.city') {
          po.depCity = item.normValue;
      }
      if (item.name == 'startDate') {
          po.depTime = item.normValue;
      }
    });
    this.setState({
      currentFlight: po
    })
  }

  async _addWatch() {
    let po = this.state.currentFlight;
    const data = await api.addList(po);
  }

  _captureRef = (ref) => { this._listRef = ref; };
  render() {
    return ( 
      <View style={styles.container}>
       <FlatList
        ref={this._captureRef.bind(this)} 
        data={this.state.dataSource}
        renderItem={({item}) =>
          <MessageItem 
          navigateRN={this.props.navigation}
          dataSource={item}
          />
        }
       />
       <View style={styles.footer}>
        <Image source={require('../images/keyboard.png')}  style={styles.icon} />
        <TouchableOpacity onPressIn={this._onPressInButton.bind(this)} onPressOut={this._onPressOutButton.bind(this)}>
          <View style={styles.btn}>
           <Text style={styles.btn_txt}>请按住说话</Text>
          </View>
        </TouchableOpacity>
       </View>
       <Modal isVisible={this.state.modalVisible}>
        <View style={{ flex: 1, justifyContent:'center', alignItems:'center' }}>
          <Bubbles size={10} color="#FFF" />
        </View>
      </Modal>
      </View>
    )
  }

  async _upload() {
    this._showModal();
    let formData = new FormData();
    formData.append('file', {
      uri: 'file://' + AudioUtils.DownloadsDirectoryPath + '/sample.pcm',
      type: 'multipart/form-data',
      name: 'sample.pcm',
    })
    formData.append('fm','pcm');
    let res = await fetch('http://47.95.117.162:8018/voice2.do', {
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data'},
        body: formData
      })
      .then((response) => response.json())
      .then((responseJson) => JSON.parse(responseJson))
        .catch((e) => {
            res = {}
            console.warn(e.message)
        })
    this._hideModal();
    return res;
  }

  _showMessage(newMsg) {
    this.setState(function(preState){
      return {
        dataSource: preState.dataSource.concat(newMsg)
      }
    }, () => {
        setTimeout(() => {
            this._srollToEnd();
        },0);
      
    });
  }
  _srollToEnd() {
    this._listRef !== undefined && this._listRef.scrollToEnd();
  }

  _showModal() {
    this.setState({
      modalVisible:  true
    })
  }
  _hideModal() {
    this.setState({
      modalVisible:  false
    })
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  footer: {
    height: 57,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 20,
    marginRight: 10
  },
  btn: {
    width: 300,
    height: 38,
    backgroundColor: '#F5F5F5',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn_txt: {
    color: '#485465',
    fontSize: 17,
  },
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});