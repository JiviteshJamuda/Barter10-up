import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";

export default class MyRecievedItems extends React.Component {
    constructor(){
        super();
        this.state={
            userId : firebase.auth().currentUser.email,
            recievedItemsList : [],
        }
        this.requestRef = null;
    }

    getRecievedItemsList = async()=>{
        this.requestRef = await db.collection("requests").where("user_id", "==", this.state.userId).where("item_status", "==", "recieved")
        .onSnapshot(snapshot=>{
            var recievedItemsList = snapshot.docs.map(doc=> doc.data())
            this.setState({ recievedItemsList : recievedItemsList })
        })
    }

    componentDidMount(){
        this.getRecievedItemsList();
    }

    componentWillMount(){
        this.requestRef();
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item, i }) => {
        return(
            <ListItem
                key={i}
                title={item.item}
                subtitle={item.item_status}
                titleStyle={{color:"black", fontWeight:"bold"}}
                bottomDivider
            />
        )
    }

    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader title="Recieved Items" navigation={this.props.navigation}/>
                <View style={{flex:1}}>
                    {
                        this.state.recievedItemsList.length === 0 ? 
                        (
                            <View style={styles.subContainer}>
                                <Text style={{fontSize:20}}>List Of All Recieved Items</Text>
                            </View>
                        ) 
                        :(
                            <FlatList
                                data={this.state.recievedItemsList}
                                keyExtractor={this.keyExtractor}
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
    subContainer : {
        flex:1, 
        fontSize:20,
        justifyContent:"center",
        alignItems:"center"
    },
})