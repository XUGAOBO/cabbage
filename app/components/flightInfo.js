import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Button,
    Image,
    View,
    TouchableHighlight,
    TouchableOpacity
  } from 'react-native';
const UP = require('../images/up.png');
const UP_SELECT = require('../images/up_select.png');
const DOWN = require('../images/down.png');
const DOWN_SELECT = require('../images/down_select.png');
export default class FlightInfo extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
            upStatus: false,
            downStatus: false
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick(type) {
        this.setState(function(preState) {
            let status = `${type}Status`;
            return {
                [status]: !preState[status] 
            }
        })
    }

    render() {
        let {dataSource} = this.props;
        return (
           <View style={styles.container}>
                <Text style={styles.city}>{dataSource.airlineInfo}</Text>
                <Text style={styles.tip}>         {dataSource.noticeContent}</Text>
                <View style={styles.content}>
                    <Text style={styles.date}>{dataSource.publishTimeDesc}</Text>
                    <View style={styles.star}>
                    <TouchableOpacity  onPress={this.onClick.bind(this, 'up')} activeOpacity={0} underlayColor="#fff">
                    <Image style={styles.icon} source={this.state.upStatus ? UP_SELECT: UP} />
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={this.onClick.bind(this, 'down')} activeOpacity={0} underlayColor="#fff">
                    <Image style={styles.icon} source={this.state.downStatus ?DOWN_SELECT: DOWN} />
                    </TouchableOpacity>
                    </View>
                </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 6,
        backgroundColor: "#fff",
        marginTop: 20,
        padding:15
      },
    city: {
        fontSize: 16,
        color: '#485465',
        fontWeight: 'bold'
    },
    tip: {
        color: '#485465',
        fontSize: 14,
        lineHeight: 20,
        marginRight: 10,
        paddingVertical: 10
    },
    date: {
        color: '#A8B4C4'
    },
    star: {
        width: 80,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    icon: {
        width: 15,
        height: 15
    },
    cutLine: {
        height: 1,
        backgroundColor: '#E9E9E9',
    },
    content: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    }
  });
