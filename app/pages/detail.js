import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Button,
    Image,
    View,
    FlatList
  } from 'react-native';
  import FlightInfo from '../components/flightInfo';
export default class Detail extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
            dataSource: [
                    {
                
                        "airlineInfo": "上海-深圳",
                
                        "noticeContent": "wow,您订阅的2017-10-1到深圳的航班降价了，当前价1260.0你现在可以从京东机票预定海南航空的机票",
                
                        "publishTimeDesc": "2017-09-21 21:02"
                    },
                
                    {
                        "airlineInfo": "北京-深圳",
        
                        "noticeContent": "您订阅的2017-10-1到深圳的航班当前价格为:1234.0请继续等待，直到2017-09-28",
       
                        "publishTimeDesc": "2017-09-21 21:02"
                    },
                    {
                
                        "airlineInfo": "深圳-北京",
           
                        "noticeContent": "您订阅的2017-10-1到北京的航班当前价格为:1234.0请继续等待，直到2017-09-28",
  
                        "publishTimeDesc": "2017-09-21 21:02"
                    },
                
                    {
                        "airlineInfo": "北京-上海",
                
                
                        "noticeContent": "wow,您订阅的2017-10-1到上海的航班降价了，当前价1260.0你现在可以从京东机票预定海南航空的机票",
                
                
                        "publishTimeDesc": "2017-09-21 21:02"
                 
                    }]
        };
    }

    render() {
        let {dataSource} = this.props;
        return (
           <View style={styles.container}>
           <FlatList 
                data={this.state.dataSource}
                renderItem={({item, index}) => (
                    <FlightInfo dataSource={item} key={index} />
                )}
            />
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: '#F9F9F9'
    }
  });