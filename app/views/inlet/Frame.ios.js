/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {StyleSheet, NavigatorIOS, TabBarIOS, PushNotificationIOS, AppState, AlertIOS} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {airloy, colors, api} from '../../app';
import util from '../../libs/Util';
import EventTypes from '../../logic/EventTypes';

import Agenda from '../agenda/Agenda';
import Target from '../check/Target';
import Anything from './Anything';
import Me from '../me/Me';
import Discover from '../discover/Discover';


export default class Frame extends React.Component {

	constructor() {
		super();
		this.lastPage = null;
		this.state = {
			currentPage: 'Me'
		};
    this.iconSize = 28;
		this.icons = new Map();
    this.today = util.getTodayStart();
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
	}

	componentWillMount() {
		// draw icon images for later use case
		['ios-archive-outline', 'ios-more-outline', 'ios-add', 'ios-filing-outline',
      'ios-create-outline', 'ios-trash-outline'].forEach(name => {
				Icon.getImageSource(name, 32).then(source => this.icons.set(name, source));
		});
		PushNotificationIOS.addEventListener('notification', this._onNotification);
    AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount() {
		PushNotificationIOS.removeEventListener('notification', this._onNotification);
    AppState.removeEventListener('change', this._handleAppStateChange);
		console.log(`-------- Frame unmounting`);
	}

	_handleAppStateChange(currentAppState) {
		if ( currentAppState === 'active') {
			if ( new Date().getTime() - this.today > 86400000 ) {
				this.today = util.getTodayStart();
				airloy.net.httpGet(api.check.list);
				airloy.event.emit(EventTypes.targetChange);
				airloy.event.emit(EventTypes.agendaChange);
				airloy.event.emit(EventTypes.meChange);
			}
			console.log(' current time = ' + this.today );
		}
	}

	getToday() {
		return this.today;
	}

	_onNotification(notification) {
		console.log(JSON.stringify(notification));
		AlertIOS.alert(
			'新的消息',
			notification.getMessage(),
			[{
				text: '知道了',
				onPress: null,
			}]
		);
	}

	_selectTab(tabPage) {
		if (this.state.currentPage === tabPage) {

		} else {
			this.setState({currentPage: tabPage});
			this.lastPage = null;
			airloy.event.emit(EventTypes.tabChange, tabPage);
		}
	}

	isPageActive(tabPage) {
		//console.log(`current ${this.state.currentPage} and active is ${tabPage}`);
		return this.state.currentPage === tabPage || this.lastPage === tabPage;
	}

	getIcon(iconName) {
		return this.icons.get(iconName);
	}

	_openAdd() {
		this.lastPage = this.state.currentPage;
		this.setState({currentPage: 'Anything'});
	}

	closeAdd() {
		this.setState({currentPage: this.lastPage});
		this.lastPage = null;
	}

	_renderNavigator(component, title, hideBar = false){
		return <NavigatorIOS
			style={{flex:1}}
			navigationBarHidden={hideBar}
			titleTextColor={colors.dark1}
			tintColor={colors.accent}
			translucent={true}
			includeOpaqueBars={false}
			navTintColor={colors.light1}
			itemWrapperStyle={style.navigation}
			initialRoute={{
				component: component,
				title: title,
				passProps:{
					frame: this,
			  	}
        	}}
		/>;
	}

	render() {
		return (
			<TabBarIOS tintColor={colors.accent}
					   translucent={true}>
				<Icon.TabBarItem
					title="待办"
					iconName="ios-star-outline"
					selectedIconName="ios-star"
					iconSize={this.iconSize}
					selected={this.state.currentPage === 'Agenda'}
					onPress={() => this._selectTab('Agenda')}>
					{this._renderNavigator(Agenda, "待办")}
				</Icon.TabBarItem>
				<Icon.TabBarItem
					title="目标"
					iconName="ios-checkmark-circle-outline"
					selectedIconName="md-checkmark-circle"
					iconSize={this.iconSize}
					selected={this.state.currentPage === 'Target'}
					onPress={() => this._selectTab('Target')}>
					{this._renderNavigator(Target, "目标")}
				</Icon.TabBarItem>
				<Icon.TabBarItem iconName="md-add" title={null} iconSize={this.iconSize}
								 selected={this.state.currentPage === 'Anything'}
								 onPress={() => this._openAdd()}>
					<Anything onClose={() => this.closeAdd()} />
				</Icon.TabBarItem>
				<Icon.TabBarItem
					title="我"
					iconName="ios-person-outline"
					selectedIconName="ios-contact"
					iconSize={this.iconSize}
					selected={this.state.currentPage === 'Me'}
					onPress={() => this._selectTab('Me')}>
					{this._renderNavigator(Me, "我", true)}
				</Icon.TabBarItem>
				<Icon.TabBarItem
					title="发现"
					iconName="ios-navigate-outline"
					selectedIconName="ios-navigate"
					iconSize={this.iconSize}
					selected={this.state.currentPage === 'Discover'}
					onPress={() => this._selectTab('Discover')}>
					{this._renderNavigator(Discover, "发现")}
				</Icon.TabBarItem>
			</TabBarIOS>
		);
	}
}

const style = StyleSheet.create({
	navigation: {
		backgroundColor: colors.light2
	}
});
