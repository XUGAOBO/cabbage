import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Button,
    Image,
    View
  } from 'react-native';
const FLIGHT=require('../images/flight.png');
export default class FlightCard extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
        };
        this.suggest = this.suggest.bind(this);
        this.pay = this.pay.bind(this);
    }

    suggest() {

    }
    pay() {

    }

    render() {
        let {dataSource} = this.props;
        return (
           <View style={styles.container}>
                <Text style={styles.date}>{dataSource.depTime}</Text>
                <View style={styles.segment}>
                    <Text style={styles.city}>{dataSource.arrCity}</Text>
                    <Image style={styles.icon} source={FLIGHT} />
                    <Text style={styles.city}>{dataSource.depCity}</Text>
                </View>
                <Text style={styles.cutLine}></Text>
                <View style={styles.bottom}>
                    <Text style={styles.tip} onPress={this.suggest}>购买建议</Text>
                    <Text style={styles.tip} onPress={this.pay}>立即够买</Text>
                </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      height: 140,
      borderRadius: 6,
      backgroundColor: "#fff",
      marginTop: 20,
      padding:15
    },
    date: {
        fontSize: 16,
        color: '#A8B4C4',
        paddingBottom: 10
    },
    segment: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingBottom: 10
    },
    icon: {
        width: 27,
        height: 21
    },
    city: {
        fontSize: 20,
        color: '#485465'
    },
    cutLine: {
        height: 1,
        backgroundColor: '#E9E9E9',
    },
    bottom: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    tip: {
        color: '#02E695',
        fontSize: 13,
        marginRight: 10
    }
  });
