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
  FlatList
} from 'react-native';
import {
  AudioRecorder,
  AudioUtils
} from '../recorder';

import MessageItem from '../components/messageItem'

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
      dataSource: [
        {
          owner: 'user',
          content: '今天的最低价是2000元，你应该再等一等，过几天买价格可能还会更低，只要在11月25日之前下单。订阅这段行程，可能每张机票还可以省500元，航班价格趋于合理或者有上涨趋势时，小白将会在第一时间告知你~是否为你订阅此段行程？'
        },
        {
          owner: 'robot',
          content: '订阅'
        },
        {
          owner: 'robot',
          content: '好的，已为你订阅，你可以在“关注”中查看此行程的购买建议。查看“关注”请戳这里'
        },
        {
          owner: 'user',
          content: '帮我查一下北京飞成都，12月6日的航班什么时候买比较划算？'
        },

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
        // alert(result);     //结果: granted ,    PermissionsAndroid.RESULTS.GRANTED 也等于 granted
        return (result === true || PermissionsAndroid.RESULTS.GRANTED)
      })
  }

  async record() {
    console.warn('recorder-------begin')
    // 如果正在录音
    if (this.state.recording) {
      console.warn('正在录音中!');
      return;
    }

    //如果没有获取权限
    if (!this.state.hasPermission) {
      console.warn('没有获取录音权限!');
      return;
    }

    //如果暂停获取停止了录音
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
    console.warn('执行stop');
    // 如果没有在录音
    if (!this.state.recording) {
      console.warn('没有录音, 无需停止!');
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

  finishRecording(didSucceed, filePath) {
    this.setState({
      finished: didSucceed
    });
    console.warn(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
  }

  render() {
    return ( 
      <View style={styles.container}>
       <FlatList
        data={this.state.dataSource}
        renderItem={({item}) =>
          <MessageItem dataSource={item} />
        }
       />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
});