import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { notesRef, firebase } from './firebase/firebase';
import { Note } from './firebase/models'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import Login from './components/Login';
import NoteScreen from './components/Note';
import NotesScreen from './components/Notes';

export type StackParams = {
  login: {}
  note: {
    note: firebase.firestore.DocumentData
  }
  notes: {}
}

const Stack = createNativeStackNavigator<StackParams>();


export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#090909',
          }
        }}
        initialRouteName='notes'
      >
        <Stack.Screen
          name="login"
          component={Login}
          options={{
            headerTitle: 'Login',
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen
          name="notes"
          component={NotesScreen}
          options={{
            headerTitle: 'Notes',
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen
          name="note"
          component={NoteScreen}
          options={{
            headerTitle: 'Note',
            headerTintColor: 'white'
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
