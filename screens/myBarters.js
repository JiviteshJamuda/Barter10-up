import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, FlatList } from "react-native";
import db from "../config";
import firebase from "firebase";
import { ListItem, Header } from 'react-native-elements';
import MyHeader from "../components/MyHeader";

export default class MyBarters extends React.Component {
    constructor(){
        super();
        this.state={
            userId : firebase.auth().currentUser.email,
            userName : "",
            allBarters : [],
        }
    }

    getAllBarters = async()=>{
        await db.collection("my_barters").where("user_id", "==", this.state.userId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    allBarters : [...this.state.allBarters, doc.data()],
                })
            })
        })

        await db.collection("users").where("email_id", "==", this.state.userId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({ userName : doc.data().first_name + " " + doc.data().last_name })
            })
        })
        console.log(this.state.userName)
    }

    sendNotification = (details, exchangeStatus)=>{
        var requestId = details.request_id;
        var exchangerId = details.user_id;
        db.collection("all_notification").where("request_id", "==", requestId).where("user_id", "==", exchangerId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                var message = "";
                if (exchangeStatus === "Item Sent"){
                    message = this.state.userName + " sent you the item";
                } else {
                    message = this.state.userName + " has shown interest in exchanging the item";
                }
                db.collection("all_notification").doc(doc.id).update({
                    message : message,
                    notification_status : "unread",
                    date : firebase.firestore.FieldValue.serverTimestamp(),
                })
            })
        })
    }

    sendItem = (details)=>{
        if(details.exchange_status === "Item Sent"){
            var requestStatus = "Barter Interested";
            db.collection("my_barters").doc(details.doc_id).update({
                exchange_status : "Barter Interested"
            })
            this.sendNotification(details, requestStatus);
        } else {
            var requestStatus = "Item Sent";
            db.collection("my_barters").doc(details.doc_id).update({
                exchange_status : "Item Sent"
            })
            this.sendNotification(details, requestStatus);
        }
    }

    componentDidMount(){
        this.getAllBarters();
    }

    keyExtractor = (item, index) => index.toString()
    
      renderItem = ( {item, i} ) =>{
        return (
          <ListItem
            key={i}
            title={item.item}
            subtitle={item.exchanger_name}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            rightElement={
                <TouchableOpacity style={styles.button} onPress={()=>{ this.sendItem(item) }}>
                    <Text>{ item.exchange_status === "Item Sent" ? "Item Sent" : "Send Item"}</Text>
                </TouchableOpacity>
            }
            bottomDivider
          />
        )
      }

    render(){
        return(
            <ScrollView>
                <MyHeader title="My Barters" navigation={this.props.navigation}/>
                <FlatList
                    data={this.state.allBarters}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    button:{
        width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#ff5722",
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8
        }
    },
})