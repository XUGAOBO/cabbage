import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Platform, PermissionsAndroid } from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
// let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
// 目录/data/user/0/com.opms_rn/files/test.aac

export default class Chat extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentTime: 0.0,                                                   //开始录音到现在的持续时间
      recording: false,                                                   //是否正在录音
      stoppedRecording: false,                                            //是否停止了录音
      finished: false,                                                    //是否完成录音
      audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',          //路径下的文件名
      hasPermission: undefined,                                           //是否获取权限
    };
    this.prepareRecordingPath = this.prepareRecordingPath.bind(this);     //执行录音的方法
    this.checkPermission = this.checkPermission.bind(this);               //检测是否授权
    this.record = this.record.bind(this);                                 //录音
    this.stop = this.stop.bind(this);                                     //停止
    this.finishRecording = this.finishRecording.bind(this);
  }

  prepareRecordingPath(audioPath){
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",            //录音质量
      AudioEncoding: "aac",           //录音格式
      AudioEncodingBitRate: 32000     //比特率
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
    if(this.state.stoppedRecording){
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({recording: true});

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  async stop() {
    // 如果没有在录音
    if (!this.state.recording) {
      console.warn('没有录音, 无需停止!');
      return;
    }

    this.setState({stoppedRecording: true, recording: false});

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
      this.setState({ finished: didSucceed });
      console.warn(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
    }

  componentDidMount () {

    // 页面加载完成后获取权限
    this.checkPermission().then((hasPermission) => {
      this.setState({ hasPermission });

      //如果未授权, 则执行下面的代码
      if (!hasPermission) return;
      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = (data) => {
        this.setState({currentTime: Math.floor(data.currentTime)});
      };

      AudioRecorder.onFinished = (data) => {
        if (Platform.OS === 'ios') {
          this.finishRecording(data.status === "OK", data.audioFileURL);
        }
      };
    })
  }

  render() {
    return (
      <View>
      <TouchableHighlight  onPressIn={this.record} onPressOut={this.stop} style={styles.button}>
      <Text>录音
      </Text>
    </TouchableHighlight>
      </View>
    )
  }
}

var styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#2b608a",
    },
    controls: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    progressText: {
      paddingTop: 50,
      fontSize: 50,
      color: "#fff"
    },
    button: {
      padding: 20
    },
    disabledButtonText: {
      color: '#eee'
    },
    buttonText: {
      fontSize: 20,
      color: "#fff"
    },
    activeButtonText: {
      fontSize: 20,
      color: "pink"
    }
  });