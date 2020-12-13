import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    ScrollView, 
    KeyboardAvoidingView,
    Alert,
    TextInput, 
    Modal,
} from 'react-native';
import db from "../config";
import firebase from "firebase"
import MyHeader from "../components/MyHeader"

export default class Exchange extends React.Component {
    constructor(){
        super();
        this.state={
            item:"",
            description:"",
            userId:firebase.auth().currentUser.email,
            isItemRequestActive : "",
            itemStatus : "",
            userDocId : "",
            requestedItem : "",
            docId : "",
            requestId : "",
        }
    }

    getItemRequest = async()=>{
        await db.collection("requests").where("user_id", "==", this.state.userId).get()
        .then(snapshot=>{
          snapshot.forEach(doc=>{
            if (doc.data().item_status !== "recieved") {
              this.setState({
                requestId : doc.data().request_id,
                requestedItem : doc.data().item,
                itemStatus : doc.data().item_status,
                docId : doc.id,
              })
            }
          })
        })
    }

    addItem = async()=>{
        var id = this.createUniqueId();
        db.collection("requests").add({
            item : this.state.item,
            description : this.state.description,
            request_id : id, 
            user_id : this.state.userId,
            item_status : "requested",
            date : firebase.firestore.FieldValue.serverTimestamp(),
        });
        
        await this.getItemRequest();

        db.collection("users").where("email_id", "==", this.state.userId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                db.collection("users").doc(doc.id).update({
                    isItemRequestActive : true,
                })
            })
        })

        this.setState({
            item : "",
            description : "",
            requestId : id,
        })

        return alert("Item Requested Successfully !");
    }

    createUniqueId = ()=>{
        return Math.random().toString(36).substring(5)
    }

    getIsItemRequestActive = async()=>{
        await db.collection("users").where("email_id", "==", this.state.userId).onSnapshot((query)=>{
            query.forEach((doc)=>{
                this.setState({ isItemRequestActive : doc.data().isItemRequestActive, userDocId : doc.id })
            })
        })
    }

    updateItemRequestStatus = ()=>{
        db.collection("requests").doc(this.state.docId).update({
            item_status : "recieved"
        })
        db.collection("users").where("email_id", "==", this.state.userId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                db.collection("users").doc(doc.id).update({
                    isItemRequestActive : false,
                })
            })
        })
    }

    sendNotification = ()=>{
        db.collection("users").where("email_id", "==", this.state.userId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                var firstName = doc.data().first_name;
                var lastName = doc.data().last_name;

                db.collection("all_notification").where("request_id", "==", this.state.requestId).get()
                .then(snapshot=>{
                    snapshot.forEach(doc=>{
                        var exchangerId = doc.data().exchanger_id;
                        var item = doc.data().item;

                        db.collection("all_notification").add({
                            exchanger_id : exchangerId,
                            message : firstName + " " + lastName + " recieved the item : " + item,
                            notification_status : "unread",
                            item : item,
                        })
                    })
                })
            })
        })
    }

    componentDidMount(){
        this.getItemRequest();
        this.getIsItemRequestActive();
    }

    render(){
        if(this.state.isItemRequestActive === true){
            return(
                <View style={{flex : 1, justifyContent : "center"}}>
                    <View style={{borderColor : "orange", borderWidth : 2, justifyContent : "center"}}>
                        <Text>Item Name : {this.state.requestedItem}</Text>
                    </View>
                    <View style={{borderColor : "orange", borderWidth : 2, justifyContent : "center"}}>
                        <Text>Item Status : {this.state.itemStatus}</Text>
                    </View>
                    <TouchableOpacity style={{borderWidth:1, borderColor : "orange", backgroundColor : "orange", width : 300, alignSelf : "center", alignItems : "center", height :30, marginTop : 30}}
                        onPress={()=>{
                            this.updateItemRequestStatus();
                            this.sendNotification();
                        }}
                    >
                        <Text>I Recieved The Item</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return(
                <View>
                    <MyHeader title="Request Item" navigation={this.props.navigation}/>
                    <KeyboardAvoidingView style={styles.keyBoardStyle} behavior="padding">
                    <TextInput style={styles.formTextInput}
                        placeholder="Item name"
                        onChangeText={(text)=>{
                            this.setState({
                                item : text
                            })
                        }}
                        value={this.state.item}
                    />
                    <TextInput style={[styles.formTextInput,{height:300}]}
                        placeholder="Item description"
                        numberOfLines={8}
                        multiline
                        onChangeText={(text)=>{
                            this.setState({
                                description : text
                            })
                        }}
                        value={this.state.description}
                    />
                    <TouchableOpacity style={styles.button}
                        onPress={()=>{
                            this.addItem();
                            this.setState({
                                item : "",
                                description : "",
                            })
                        }}
                    >
                        <Text>Add Item</Text>
                    </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            )
        }
        
    }
}

const styles = StyleSheet.create({
    keyBoardStyle : {
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"50%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"15%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )
  