import React, {Component} from 'react';
import { View, Text, Platform } from 'react-native';
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
            <Text>这是一个测试</Text>
          </View>
        )
    }
}
