
import React, {Component} from 'react';
import { NavigationActions } from 'react-navigation'
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

  goToPath() {
    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'SimpleApp'})
        ]
      })
      const {navigate} = this.props.navigateRN;
      this.props.navigateRN.dispatch(resetAction)
      navigate('Home', { date: new Date().getTime() })
  }

  getContent(content) {
    if (content && content.indexOf('关注') > -1) {
      return <TouchableOpacity >
      <Text style={styles.msg_content}>{content}</Text>
      <Text style={[styles.msg_content, styles.msg_content_focus]} onPress={()=>{this.goToPath()}}>查看“关注请戳这里”</Text>
      </TouchableOpacity>
    }
    return <Text style={styles.msg_content}>{content}</Text>
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
            {
              this.getContent(dataSource.content)
            }
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
  msg_content_focus: {
    color: '#02E695'
  }
}); 