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
import { DrawerItems } from "react-navigation-drawer";
import { Avatar } from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';

export default class SidebarMenu extends React.Component {
    constructor(){
        super();
        this.state={
          image : "",
          userId : firebase.auth().currentUser.email,
          name : "",
          docId : "",
    
        }
      }
    
      selectPicture = async()=>{
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
          mediaTypes : ImagePicker.MediaTypeOptions.All,
          allowsEditing : true,
          aspect : [4,3],
          quality : 1,
        })
        if(!cancelled){
          this.uploadImage(uri, this.state.userId);
          this.setState({ image : uri });
        } 
      }
    
      uploadImage = async(uri, imageName)=>{
        var response = await fetch(uri);
        var blob = await response.blob();
        var ref = firebase.storage().ref().child("user_profiles/" + imageName);
        return (
          ref.put(blob).then((response)=>{
            this.fetchImage(imageName);
          })
        )
      }
    
      fetchImage = (imageName)=>{
        var storageRef = firebase.storage().ref().child("user_profiles/" + imageName);
        storageRef.getDownloadURL().then((url)=>{
          this.setState({ image : url })
        })
        .catch((err)=>{
          this.setState({ image : "#" })
        })
      }
    
      getUserDetails = ()=>{
        db.collection("users").where("email_id", "==", this.state.userId).onSnapshot(snapshot=>{
          snapshot.forEach(doc=>{
            this.setState({
              name : doc.data().first_name + " " + doc.data().last_name,
              docId : doc.id,
              image : doc.data().image
            })
          })
        })
      }
    
      componentDidMount(){
        this.getUserDetails();
        this.fetchImage(this.state.userId);
      }

    render(){
        return(
            <View style={{flex:1}}>
                <View style={{flex:0.5, alignItems:"center", backgroundColor:"orange"}}>
                    <Avatar
                        rounded
                        source={{
                            uri : this.state.image
                        }}
                        size="medium"
                        onPress={()=>{
                            this.selectPicture();
                        }}
                        containerStyle = {styles.imageContainer}
                        showEditButton
                    />
                    <Text style={{fontWeight:"100", fontSize:20, paddingTop:10}}>{this.state.name}</Text>
                </View>
                <DrawerItems {...this.props}/>
                <View style={{flex:1, justifyContent:"flex-end", paddingBottom:30}}>
                    <TouchableOpacity style={{justifyContent:"center", padding:10, height:30, width:"100%"}}
                        onPress={()=>{
                            this.props.navigation.navigate("LoginScreen");
                            firebase.auth().signOut();
                        }}
                    >
                        <Text>Log out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
