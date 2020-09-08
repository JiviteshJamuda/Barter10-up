import React from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { ListItem, Header } from "react-native-elements";
import db from "../config";
import firebase from "firebase";

export default class Notifications extends React.Component {
    constructor(){
        super();
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
                <Header
                    centerComponent={{text:"Notifications", style:{fontSize : 25, fontWeight : "bold"}}}
                />
                <FlatList
                    data={this.state.allNotifications}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                />
            </ScrollView>
        )
    }
}

