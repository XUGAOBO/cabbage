import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Platform, PermissionsAndroid } from 'react-native';

export default class Detial extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <View>
            <Text>个人中心</Text>
          </View>
        )
    }
}
