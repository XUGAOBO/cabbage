'use strict';

import React, { Component } from 'react'
import Navigator from './app'
import { View, Platform } from 'react-native'
export default class rootApp extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Navigator />
      </View>
    )
  }
}
