import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Button,
    Image,
    View,
    FlatList,
    ToastAndroid
  } from 'react-native';
  import * as api from '../api';
  import FlightCard from '../components/flightCard';
const CABBAGE_BG=require('../images/cabbage.png');
const CABBAGE = require('../images/cabbage_icon.png');
const NODATA = require('../images/noData.png');
export default class Home extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            dataSource: [],
            date: new Date().getTime(),
            ready: false
        };
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        if (params) {
            this.getDataSource();
        }
    }

    async getDataSource() {
        const data = await api.watchList();
        this.setState({
            dataSource: data
        })
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
           <View style={styles.container}>
           <Image style={styles.bg} source={CABBAGE_BG} />
            <View style={styles.top}>
                <View style={styles.wrapper}>
                    <Image style={styles.icon} source={CABBAGE} />
                    <Text style={styles.title}>Cabbage</Text>
                    <Text style={styles.title_zn}>智游助手</Text>
                    <View style={styles.speak}>
                        <Text style={styles.speak_txt} onPress={()=>{navigate('Chat')}}>和TA对话</Text>
                    </View>
                </View>
            </View>
            {
                this.state.dataSource.length > 0 ? 
                <View style={styles.content}>
                <Text style={styles.attention}>我的关注</Text>
                <FlatList 
                    data={this.state.dataSource}
                    renderItem={({item, index}) => {
                        // alert(item.depTime)
                        // if (Object.prototype.toString.call('[object Object]')) {
                        //     item.depTime = item.depTime.datetime;
                        // }
                        return <FlightCard dataSource={item} key={index} />
                    }}
                />
                </View> : 
                <View style={styles.noData}>
                <Image source={NODATA} />
                </View>
            }
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#02E695',
        borderRadius:2,
    },
    speak_txt: {
        textAlign: 'center',
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
    },
    noData: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    }
  });
