/**
 * Created by Layman(http://github.com/anysome) on 16/2/29.
 */
import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import {colors, styles} from '../../app';
import util from '../../libs/Util';
import objective from '../../logic/Objective';


export default class ListRow extends React.Component {

  constructor(props) {
    super(props);
    this.done = props.sectionId === 2;
    this.future = props.sectionId == 1;
  }

  _transform(data) {
    if (this.done) {
      return {
        icon: {name: 'md-checkbox', color: colors.light3},
        priority: data.priority,
        title: data.title,
        detail: data.detail,
        arrangeDate: moment(data.doneTime).format('H:mm')
      };
    } else if (this.future) {
      return {
        icon: {name: 'md-arrow-round-up', color: objective.getPriorityColor(data.priority)},
        priority: data.priority,
        title: data.title,
        detail: data.detail,
        reminder: data.reminder,
        arrangeDate: moment(data.today).format('M月 D日')
      };
    } else {
      return {
        icon: {color: objective.getPriorityColor(data.priority), name: 'md-square-outline'},
        priority: data.priority,
        title: data.title,
        detail: data.detail,
        reminder: data.reminder,
        arrangeDate: this.props.today === data.today ? false : moment(data.today).from(this.props.today)
      };
    }
  }

  render() {
    var transform = this._transform(this.props.data);
    return (
      <TouchableOpacity style={style.container} onPress={this.props.onPress} onLongPress={this.props.onLongPress}>
        { util.isAndroid() ?
          <TouchableOpacity onPress={this.props.onIconClick} style={style.icon}>
            <Icon size={28} name={transform.icon.name} color={transform.icon.color}/>
          </TouchableOpacity>
          :
          <Icon size={28} style={style.icon} name={transform.icon.name} color={transform.icon.color}
                onPress={this.props.onIconClick}/>
        }
        <Text style={[styles.title, style.body]}>
          { transform.priority > 8 ? <Text style={[style.alert, {color: transform.icon.color}]}>!! </Text> :
            transform.priority > 3 ? <Text style={[style.alert, {color: transform.icon.color}]}>! </Text> : null }
          {transform.title}
        </Text>
        {transform.reminder && <Icon size={20} name='ios-notifications-outline' color={colors.dark1}/>}
        {transform.arrangeDate && <Text style={style.hint}>{transform.arrangeDate}</Text>}
      </TouchableOpacity>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingRight: 16,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    backgroundColor: colors.light1
  },
  icon: {
    paddingLeft: 16
  },
  alert: {
    paddingRight: 5,
    fontSize: 20,
    fontWeight: 'bold'
  },
  body: {
    marginLeft: 10,
    marginRight: 10
  },
  tail: {
    alignItems: 'flex-end'
  },
  hint: {
    textAlign: 'right',
    fontSize: 12,
    color: colors.border,
    marginLeft: 5
  }
});
