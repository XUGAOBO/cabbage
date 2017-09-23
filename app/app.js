'use strict';

import React, { Component } from 'react'
import Home from './pages/index'
import Chat from './pages/chat'
import Detail from './pages/detail'
import {
    StyleSheet,
    Text,
    Image,
    View
  } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
const TabNavigatorItem =TabNavigator.Item;
//默认选项
const TAB_CABBAGE_NORMAL=require('./images/shape.png');
const TAB_MESSAGE_NORMAL=require('./images/message.png');
const TAB_PERSONAL_NORMAL = require('./images/personal.png');
//选中
const TAB_CABBAGE_PRESS=require('./images/shape_select.png');
const TAB_MESSAGE_PRESS=require('./images/message_select.png');
const TAB_PERSONAL_PRESS=require('./images/personal.png');

export default class App extends Component {
  //默认选中
  constructor(){
    super();
    this.state={
      selectedTab:'Home',
    }
  }
  //点击方法
  onPress(tabName){
   if(tabName){
     this.setState({
         selectedTab:tabName,
       }
     );
   }
 }

//渲染选项
 renderTabView(title,tabName,isBadge){
      let tabNomal;
      let tabPress;
      let current;
      switch (tabName) {
        case 'Home':
          tabNomal=TAB_CABBAGE_NORMAL;
          tabPress=TAB_CABBAGE_PRESS;
          current = () =>{
            return <Home />
          };
          break;
       case 'Chat':
        tabNomal=TAB_MESSAGE_NORMAL;
        tabPress=TAB_MESSAGE_PRESS;
        current = () => {
            return <Chat />
        };
        break;
        case 'Detail':
        tabNomal=TAB_PERSONAL_NORMAL;
        tabPress=TAB_PERSONAL_PRESS;
        current = () => {
            return <Detail />
        };
        default:
        break;
      }
      // renderBadge={()=>isBadge?<View style={styles.badgeView}><Text style={styles.badgeText}>15</Text></View>:null}
      return(
       <TabNavigatorItem
        selected={this.state.selectedTab===tabName}
        title={title}
        titleStyle={styles.tabText}
        selectedTitleStyle={styles.selectedTabText}
        renderIcon={()=><Image style={styles.icon} source={tabNomal}/>}
        renderSelectedIcon={()=><Image style={styles.icon} source={tabPress}/>}
        onPress={()=>this.onPress(tabName)}
        >
       <View style={styles.page}>
        {current()}
       </View>
       </TabNavigatorItem>
     );
   }

      //自定义TabView
    tabBarView(){
          return (
            <TabNavigator
             tabBarStyle={styles.tab}
            >
            {this.renderTabView('消息','Chat',false)}
            {this.renderTabView('小白','Home',true)}
            {this.renderTabView('个人中心', 'Detail', false)}
            </TabNavigator>
          );
        }

  //渲染界面
  render() {
    var tabView=this.tabBarView();
    return (
      <View style={styles.container}>
             {tabView}
            </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabText: {
        fontSize: 10,
        color: 'black'
    },
    selectedTabText: {
        fontSize: 10,
        color: 'green'
    },
    tab:{
    height: 52,
    alignItems:'center',
    backgroundColor:'#f4f5f6',
   },
   tabIcon:{
    width:25,
    height:18,
  },
  badgeView:{
    width:22,
    height:14 ,
    backgroundColor:'#f85959',
    borderWidth:1,
    marginLeft:10,
    marginTop:3,
    borderColor:'#FFF',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:8,
  },
  badgeText:{
    color:'#fff',
    fontSize:8,
  },
    icon: {
        width: 25,
        height: 22
    },
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
});
