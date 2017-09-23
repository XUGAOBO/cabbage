
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

export default class MessageItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  render() {
    let {dataSource} = this.props;
    let icon = dataSource.owner === 'user' ? require('../images/user.png') : require('../images/portrait.png');
    let itemDriection = dataSource.owner === 'user' ? {flexDirection:'row-reverse'}: {flexDirection:'row'};
    let iconMargin = dataSource.owner === 'user' ?  {marginLeft: 10}  : {marginRight: 10} ; 
    return (
      <View style={styles.container_wrap}>
        <View style={[styles.container, itemDriection]}>
          <Image source={icon} style={[styles.icon, iconMargin]} />
          <View style={styles.msg_wrap}>
            <Text style={styles.msg_content}>{dataSource.content}</Text>
          </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container_wrap: {
    flex: 1,
    padding: 15,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    flexDirection:'row',
    alignItems: 'center',
  },
  icon: {
    height: 30,
    width: 30,
    marginRight: 10
  },
  msg_wrap: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  msg_content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#485465',
    maxWidth: 256,
  },
}); 