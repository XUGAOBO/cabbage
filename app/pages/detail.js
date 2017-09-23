import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Button,
    Image,
    View,
    FlatList,
    ImageBackground,
    ToastAndroid
  } from 'react-native';
import FlightInfo from '../components/flightInfo';
import {host} from '../utils/constants';
import * as api from '../api';
  const ToolbarAndroid = require('ToolbarAndroid');
  const BACK = require('../images/back.png');
  const toolbarActions = [
    {title: 'Filter'}
  ];
  const CABBAGE_BG = require('../images/cabbage.png');
export default class Detail extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
            actionText: '',
            dataSource: []
        }
    }

    componentDidMount() {
        this.getDataSource();
        
    }

    async getDataSource() {
        const data = await api.noticeList();
        this.setState({
            dataSource: data
        })
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                <ToolbarAndroid
                actions={toolbarActions}
                navIcon={BACK}
                onIconClicked={() => navigate('Home')}
                style={styles.toolbar}
                title="低价信息">
                <ImageBackground style={{height:100,width:300}} source={CABBAGE_BG}>
                </ImageBackground>
                </ToolbarAndroid>
                <View style={styles.content}>
                <FlatList 
                     data={this.state.dataSource}
                     renderItem={({item, index}) => (
                         <FlightInfo dataSource={item} key={index} />
                     )}
                 />
               </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
      },
    container: {
        flex: 1
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#F9F9F9'
    }
  });