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
    FlatList,
} from 'react-native';
import db from "../config";
import firebase from "firebase";
import { ListItem } from 'react-native-elements'
import MyHeader from "../components/MyHeader";

export default class List extends React.Component {
    constructor(){
        super()
        this.state = {
          requests : []
        }
      this.requestRef= null
      }
    
      getRequests =()=>{
        this.requestRef = db.collection("requests")
        .onSnapshot((snapshot)=>{
          var requestedList = snapshot.docs.map(document => document.data());
          this.setState({
            requests : requestedList
          });
        })
      }
    
      componentDidMount(){
        this.getRequests()
      }
    
      componentWillUnmount(){
        this.requestRef();
      }
    
      keyExtractor = (item, index) => index.toString()
    
      renderItem = ( {item, i} ) =>{
        return (
          <ListItem
            key={i}
            title={item.item}
            subtitle={item.description}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            rightElement={
                <TouchableOpacity style={styles.button}
                  onPress={()=>{
                    this.props.navigation.navigate("Details", {"details" : item});
                    
                  }}
                >
                  <Text style={{color:'#ffff'}}>Exchange</Text>
                </TouchableOpacity>
              }
            bottomDivider
          />
        )
      }
    
      render(){
        return(
          <View style={{flex:1}}>
            <View style={{flex:1}}>
              <MyHeader title="Exchange Items" navigation={this.props.navigation}/>
              {
                this.state.requests.length === 0
                ?(
                  <View style={styles.subContainer}>
                    <Text style={{ fontSize: 20}}>List Of All exchange offers ...</Text>
                  </View>
                )
                :(
                  <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.requests}
                    renderItem={this.renderItem}
                  />
                )
              }
            </View>
          </View>
        )
      }
}

const styles = StyleSheet.create({
    subContainer:{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    },
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
    }
  })
  