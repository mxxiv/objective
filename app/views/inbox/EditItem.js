/**
 * Created by Layman(http://github.com/anysome) on 16/3/19.
 */

import React, {StyleSheet, Component, ScrollView, View, Text, TouchableOpacity, ActionSheetIOS} from 'react-native';
import moment from 'moment';
import {styles, colors, airloy, api, L, toast} from '/../app/app';

import TextField from '/../app/widgets/TextField';
import TextArea from '/../app/widgets/TextArea';

export default class EditItem extends Component{

    constructor(props) {
        var {data, sectionId, ...others} = props;
        super(others);
        this._title = null;
        this.data = data || {title: '', detail: ''};
        this.state = {
            title: this.data.title,
            detail: this.data.detail
        };
    }

    componentWillMount() {
        let route = this.props.navigator.navigationContext.currentRoute;
        if ( route.rightButtonIcon ) {
            if ( this.props.sectionId === 1 ) {
                // edit project
                route.onRightButtonPress = async () => {
                    console.log('two button confirm if has total > 0 ');
                    let result = await airloy.net.httpGet(api.project.remove, {id: this.data.id});
                    if ( result.success) {
                        this.props.onDeleted(this.data);
                    } else {
                        toast(L(result.message));
                    }
                };
            } else {
                // edit chore
                route.onRightButtonPress = () => this._showOptions();
            }
            this.props.navigator.replace(route);
        }
    }

    async _save() {
        let result;
        this.data.detail = this.state.detail;
        if ( this.data.id ) {
            if ( this._title.value.length > 0 ) {
                this.data.title = this.state.title;
            }
            let url = this.props.sectionId === 1 ? api.project.update : api.inbox.update;
            result = await airloy.net.httpPost(url, this.data);
        } else {
            if ( this._title.value.length < 1 ) {
                this._title.focus();
                return ;
            }
            this.data.title = this.state.title;
            let url = this.props.sectionId === 1 ? api.project.add : api.inbox.add;
            result = await airloy.net.httpPost(url, this.data);
        }
        if ( result.success ) {
            this.props.onUpdated(result.info);
        } else {
            toast(L(result.message));
        }
    }

    render() {
        return (
            <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps>
                <View style={styles.section}>
                    <TextField
                        ref={c => this._title = c}
                        flat={true}
                        value={this.state.title}
                        onChangeText={(text) => this.setState({title:text})}
                        placeholder={this.data.title || '想做什么...'}
                        returnKeyType="done"
                    />
                    <View style={styles.separator} />
                    <TextArea
                        flat={true}
                        defaultValue={this.state.detail}
                        onChangeText={(text) => this.setState({detail:text})}
                        placeholder={this.data.detail || '如有备注...'}
                        returnKeyType="default"
                    />
                </View>
                { this.props.editable &&
                <TouchableOpacity style={styles.row} onPress={()=> this._save()}>
                    <Text style={styles.link}>保存</Text>
                </TouchableOpacity>
                }
            </ScrollView>
        );
    }
}

const style = StyleSheet.create({
    text: {
        paddingTop: 5,
        paddingBottom: 5,
        color: colors.dark1,
        fontSize: 14
    }
});