import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View
  } from 'react-native';
const CABBAGE_BG=require('../images/cabbage.png');
export default class Home extends Component {

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
           <Image style={styles.icon} source={CABBAGE_BG}/>
            <Text>这是一个测试</Text>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    icon: {
        width: 25,
        height: 22
    }
  });
