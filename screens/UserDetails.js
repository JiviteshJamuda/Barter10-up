import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Header, Icon } from "react-native-elements";
import firebase from "firebase";
import db from "../config";

export default class UserDetails extends React.Component {
    constructor(props){
        super(props);
        this.state={
            userId : firebase.auth().currentUser.email,
            exchangerId : this.props.navigation.getParam("details")["user_id"],
            requestId : this.props.navigation.getParam("details")["request_id"],
            item : this.props.navigation.getParam("details")["item"],
            description : this.props.navigation.getParam("details")["description"],
            exchangerName : "",
            exchangerContact : "",
            exchangerAddress : "",
            requestDocId : "",
            userName : "",
            exchangeDocId : "",
        }
    }

    getUserDetails = async()=>{
        await db.collection("users").where("email_id", "==", this.state.exchangerId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    exchangerName : doc.data().first_name,
                    exchangerContact : doc.data().contact, 
                    exchangerAddress : doc.data().address,
                })
            })
        })
        await db.collection("users").where("email_id", "==", this.state.userId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    userName : doc.data().first_name + " " + doc.data().last_name
                })
            })
        })

        await db.collection("requests").where("request_id", "==", this.state.requestId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    requestDocId : doc.id
                })
            })
        })
    }

    addBarters = async()=>{
        await db.collection("my_barters").add({
            item              : this.state.item,
            exchanger_name    : this.state.exchangerName,
            exchanger_contact : this.state.exchangerContact,
            exchanger_address : this.state.exchangerAddress,
            exchanger_id      : this.state.exchangerId,
            exchange_status   : "Barter Interested",
            user_id           : this.state.userId,
            description       : this.state.description,
            doc_id            : this.state.requestDocId,
            request_id        : this.state.requestId,
        })
    }

    addNotification = async()=>{
        var message = this.state.userName + " has shown interest";
        await db.collection("all_notification").add({
            user_id             : this.state.userId,
            exchanger_id        : this.state.exchangerId,
            date                : firebase.firestore.FieldValue.serverTimestamp(),
            message             : message,
            item                : this.state.item,
            notification_status : "unread",
            request_id          : this.state.requestId,
        })
    }

    componentDidMount(){
        this.getUserDetails();
    }

    render(){
        return(
            <ScrollView style={{flex:1}}>
                <Header 
                    leftComponent={<Icon name="arrow-left" type="feather" onPress={()=>{this.props.navigation.goBack()}}/>}
                    centerComponent={{ text:"Details", style:{fontSize:30} }}
                />
                <Text style={styles.text}>Item : {this.state.item}</Text>
                <Text style={styles.text}>Description : {this.state.description}</Text>
                <Text style={styles.text}>Exchanger Name : {this.state.exchangerName}</Text>
                <Text style={styles.text}>Exchanger Contact : {this.state.exchangerContact}</Text>
                <Text style={styles.text}>Exchanger Address : {this.state.exchangerAddress}</Text>
                <Text style={styles.text}>Exchanger ID : {this.state.exchangerId}</Text>
                <View style={{justifyContent:"center", flex:1,alignItems:"center"}}>
                    { this.state.requestDocId === "" ? 
                    (
                    <View></View>) : 
                    (<TouchableOpacity style={styles.button} 
                        onPress={()=>{
                            this.addBarters(); 
                            this.addNotification();
                            this.props.navigation.navigate("MyBarters");
                            console.log(this.state.requestDocId)
                        }}
                    >
                        <Text style={styles.buttonText}>Exchange</Text>
                    </TouchableOpacity>)}
                    
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    text : {
        fontSize : 20,
        margin : 20,
    },
    button : {
        width : 200,
        height : 60,
        backgroundColor : "green",
        borderWidth : 2,
        borderRadius : 70,
    },
    buttonText : {
        fontSize : 40,
        justifyContent : "center",
        alignContent : "center",
        alignSelf : "center"
    }
})