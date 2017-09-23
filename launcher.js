import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Image,
  StyleSheet
} from 'react-native';
import Home from './app/pages/index';
import Detail from './app/pages/detail';
import Chat from './app/pages/chat';
import Person from './app/pages/person';
import {StackNavigator, TabNavigator} from 'react-navigation';

//默认选项
const TAB_CABBAGE_NORMAL=require('./app/images/shape.png');
const TAB_MESSAGE_NORMAL=require('./app/images/message.png');
const TAB_PERSONAL_NORMAL = require('./app/images/personal.png');
//选中
const TAB_CABBAGE_PRESS=require('./app/images/shape_select.png');
const TAB_MESSAGE_PRESS=require('./app/images/message_select.png');
const TAB_PERSONAL_PRESS=require('./app/images/personal.png');

const styles = StyleSheet.create({
    icon: {
        width: 22,
        height: 25
      }
  });
  // 导航注册
const SimpleApp = TabNavigator({
    Detail: {
        screen: Detail,
        navigationOptions: {
            tabBarLabel: '消息',
            tabBarIcon: ({tintColor,focused}) => (
                focused
                    ?
                    <Image source={TAB_MESSAGE_PRESS}  style={styles.icon} />
                    :
                    <Image source={TAB_MESSAGE_NORMAL} style={styles.icon} />
            )
        }
    },
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarLabel: '小白',
            tabBarIcon: ({tintColor,focused}) => (
                focused
                    ?
                    <Image source={TAB_CABBAGE_PRESS} style={styles.icon} />
                    :
                    <Image source={TAB_CABBAGE_NORMAL} style={styles.icon} />
            )
        }
    },
    Person: {
        screen: Person,
        navigationOptions: {
            tabBarLabel: '个人中心',
            tabBarIcon: ({tintColor,focused}) => (
                focused
                    ?
                    <Image source={TAB_PERSONAL_PRESS} style={styles.icon} />
                    :
                    <Image source={TAB_PERSONAL_NORMAL} style={styles.icon} />
            )
        }
    }
},{
    tabBarPosition: 'bottom',
    swipeEnabled:false,
    animationEnabled:true,
    initialRouteName: 'Detail',
    tabBarOptions: {
        style: {
            height:50,
            backgroundColor: '#f4f5f6'
        },
        showIcon: true,
        pressColor: '#eaeaea',
        activeBackgroundColor:'white',
        activeTintColor:'green',
        inactiveBackgroundColor:'#f4f5f6',
        inactiveTintColor:'#000',
        indicatorStyle: {
            height: 0
        },
        iconStyle: {
            width: 22,
            height: 25
        },
        labelStyle: {
            height: 25
        },
        showLabel:true,
    }
})

  const MyApp = StackNavigator({
    SimpleApp: {
        screen: SimpleApp,
        navigationOptions: {
            header: null
        }
    },
    Chat: {
        screen: Chat
    }
  });

AppRegistry.registerComponent('cabbageRN', () => MyApp);
