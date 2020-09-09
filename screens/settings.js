import React,{Component}from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert,
ScrollView} from 'react-native';
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";

export default class Settings extends React.Component {
    constructor(){
        super();
        this.state={
            emailId : "",
            firstName:"",
            lastName:"",
            address:"",
            contact:"",
            docId : "",
        }
    }

    getData = ()=>{
        var user = firebase.auth().currentUser;
        var email = user.email;

        db.collection("users").where("email_id", "==", email).get()
        .then(snapshot=>{
            snapshot.forEach((doc)=>{
                var data = doc.data();
                this.setState({
                    emailId : doc.email_id,
                    firstName : doc.first_name,
                    lastName : doc.last_name,
                    address : doc.address,
                    contact : doc.contact,
                    docId : doc.id,
                })
            })
        })        
    }

    updateData = ()=>{
        db.collection("users").doc(this.state.docId)
        .update({
            first_name : this.state.firstName,
            last_name : this.state.lastName,
            address : this.state.address,
            contact : this.state.contact,
        })
    }

    componentDidMount(){
        this.getData();
    }

    render(){
        return(
            <View>
                <View>
                    <MyHeader title="Settings" navigation={this.props.navigation}/>
                </View>
            <View style={styles.container}>               
                <View style={styles.formContainer}>                   
                    <TextInput style={styles.formTextInput}
                        placeholder="First Name"
                        maxLength={15}
                        onChangeText={(text)=>{
                            this.setState({
                                firstName : text
                            })
                        }}
                        value={this.state.firstName}
                    />
                    <TextInput style={styles.formTextInput}
                        placeholder="Last Name"
                        maxLength={15}
                        onChangeText={(text)=>{
                            this.setState({
                                lastName : text
                            })
                        }}
                        value={this.state.lastName}
                    />
                    <TextInput style={styles.formTextInput}
                        placeholder="contact"
                        maxLength={12}
                        onChangeText={(text)=>{
                            this.setState({
                                contact : text
                            })
                        }}
                        value={this.state.contact}
                    />
                    <TextInput style={styles.formTextInput}
                        placeholder="address"
                        numberOfLines={5}
                        onChangeText={(text)=>{
                            this.setState({
                                address : text
                            })
                        }}
                        value={this.state.address}
                    />
                    <TouchableOpacity style={styles.button}
                        onPress={()=>{
                            this.updateData();
                        }}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
      alignItems: 'center',
      justifyContent: 'center'
    },
    formContainer:{
      flex:1,
      width:'100%',
      alignItems: 'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
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
    buttonText:{
      fontSize:25,
      fontWeight:"bold",
      color:"#fff"
    }
  })