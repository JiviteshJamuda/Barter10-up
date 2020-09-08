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
import db from "../config"
import { BottomTabNavigator } from "./BottomTabNavigator";
import SidebarMenu from "./SidebarMenu";
import { createDrawerNavigator } from "react-navigation-drawer";
import Settings from "../screens/settings";
import MyBarters from "../screens/myBarters";
import Notifications from "../screens/notifications";

export const DrawerNavigator = createDrawerNavigator(
    {
        Home : {screen: BottomTabNavigator},
        Settings : {screen: Settings},
        MyBarters : {screen : MyBarters},
        Notifications : {screen : Notifications},
    },
    {
        contentComponent: SidebarMenu
    },
    {
        initialRouteName : "Home"
    }
)