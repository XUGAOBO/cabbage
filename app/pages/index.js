import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Button,
    Image,
    View,
    FlatList
  } from 'react-native';
  import FlightCard from '../components/flightCard';
const CABBAGE_BG=require('../images/cabbage.png');
const CABBAGE = require('../images/cabbage_icon.png');
export default class Home extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
            dataSource: [
                {
                    "arrCity": "深圳",
                    "depCity": "北京",
                    "depTime": "2017-10-1",
                    "userPin": "xn_test"
                },
                {
                    "arrCity": "北京",
                    "depCity": "上海",
                    "depTime": "2017-10-1",
                    "userPin": "xn_test"
                },
                {
                    "arrCity": "北京",
                    "depCity": "深圳",
                    "depTime": "2017-10-11",
                    "userPin": "xn_test"
                },
                {
                    "arrCity": "北京",
                    "depCity": "深圳",
                    "depTime": "2017-10-11",
                    "userPin": "xn_test"
                },
                {
                    "arrCity": "北京",
                    "depCity": "深圳",
                    "depTime": "2017-10-11",
                    "userPin": "xn_test"
                }
            ],
        };
        this.onButtonPress = this.onButtonPress.bind(this);
    }

    componentDidMount() {
    }

    onButtonPress() {

    }

    render() {
        return (
           <View style={styles.container}>
           <Image style={styles.bg} source={CABBAGE_BG} />
            <View style={styles.top}>
                <View style={styles.wrapper}>
                    <Image style={styles.icon} source={CABBAGE} />
                    <Text style={styles.title}>Cabbage</Text>
                    <Text style={styles.title_zn}>智游助手</Text>
                    <Text style={styles.speak} onPress={this.onButtonPress}>和TA对话</Text>
                </View>
            </View>
            <View style={styles.content}>
            <Text style={styles.attention}>我的关注</Text>
            <FlatList 
                data={this.state.dataSource}
                renderItem={({item, index}) => (
                    <FlightCard dataSource={item} key={index} />
                )}
            />
            </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    top: {
        height: 250,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    bg: {
        height: 250,
        position: 'absolute',
        top: 0
    },
    wrapper: {
        height: 150,
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    title: {
        color:'#fff',
        fontSize:18
    },
    title_zn: {
        fontSize:12,
        color:'#fff',
        textAlign: 'center'
    },
    icon: {
        width: 67,
        height: 67
    },
    speak:{
        width: 126,
        height: 32,
        marginTop: 16,
        alignItems: 'center',
        textAlign: 'center',
        lineHeight: 20,
        backgroundColor: '#02E695',
        borderRadius:2,
        color: '#fff',
        fontSize: 16,
    },
    content: {
        flex:1,
        paddingHorizontal: 20,
        backgroundColor: '#F9F9F9'
    },
    attention: {
        color: '#485465',
        fontSize: 17
    }
  });
