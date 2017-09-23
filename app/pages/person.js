import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Button,
    Image,
    View,
    FlatList,
    ImageBackground
  } from 'react-native';
export default class Person extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
            actionText: ''
        };
    }

    render() {
        return (
            <View>
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
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: '#F9F9F9'
    }
  });