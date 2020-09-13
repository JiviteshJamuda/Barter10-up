import React from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { ListItem, Header } from "react-native-elements";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/MyHeader";
import SwipeableFlatlist from "../components/SwipeableFlatlist";

export default class Notifications extends React.Component {
    constructor(props){
        super(props);
        this.state={
            userId : firebase.auth().currentUser.email,
            allNotifications : [],
        };
    }

    getNotifications = async()=>{
        await db.collection("all_notification").where("notification_status", "==", "unread").where("exchanger_id", "==", this.state.userId)
        .onSnapshot(snapshot=>{
            var allNotifications = [];
            snapshot.docs.map(doc=>{
                var notification = doc.data();
                notification["doc_id"] = doc.id;
                allNotifications.push(notification)
            });
            this.setState({ allNotifications : allNotifications })
        })
    }

    componentDidMount(){
        this.getNotifications();
    }

    keyExtractor = (item, index) => index.toString()
    
      renderItem = ( {item, i} ) =>{
        return (
          <ListItem
            key={i}
            title={item.item}
            subtitle={item.message}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            bottomDivider
          />
        )
      }

    render(){
        return(
            <ScrollView>
                <View>
                    <MyHeader title="Notifications" navigation={this.props.navigation}/>
                </View>
                <View>
                    {
                        this.state.allNotifications.length === 0 ?
                        (
                            <View style={{flex : 1, justifyContent : "center", alignItems : "center"}}>
                                <Text style={{fontSize : 20}}>You have no notifications</Text>
                            </View>
                        ) :
                        (
                            <SwipeableFlatlist allNotifications={this.state.allNotifications}/>
                        )
                    }
                </View>
            </ScrollView>
        )
    }
}

