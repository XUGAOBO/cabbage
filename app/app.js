'use strict';

import React, { Component } from 'react'
import Home from './pages/index'
import Chat from './pages/chat'
import { View, Text, Platform } from 'react-native'
export default class Navigator extends Component {
    constructor(...args){
      super(...args);
    }

    render(){
        return (
          <View>
            <Chat />
          </View>
        )
    }
}
