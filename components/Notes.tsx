import { useAuthState } from "react-firebase-hooks/auth"
import { Button, FlatList, Text, View } from "react-native"
import { auth, notesRef, firestore, firebase } from "../firebase/firebase"
import { SafeAreaView } from "react-native-safe-area-context"
import { styles } from "../styles"
import { useCollection, useCollectionData } from "react-firebase-hooks/firestore"
import { Note } from "../firebase/models"
import Card from "./Card"
import { useNavigation } from "@react-navigation/core"
import { useEffect } from "react"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StackParams } from "../App"


const Notes = () => {

    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>()
    const query = notesRef.orderBy('updatedAt').limit(25)
    const user = auth.currentUser

    const [notes] = useCollectionData<firebase.firestore.DocumentData>(query, {idField: 'id'})
    
    const addNote = async () => {
        const newNote: Note = {
        text: 'hello content',
        updatedAt: new Date()
        }
        await notesRef.add(newNote)
    }

    useEffect(() => {
        if(!user) {
            navigation.navigate("login", {})
        }
    })
  

    const handleLogout = () => {
        auth.signOut()
        navigation.navigate("login", {})
    }

    return (
        <SafeAreaView style={styles.mainView}>
            <View style={styles.subMainView}>
                <Button title="add a note" onPress={addNote}></Button>
                <FlatList
                    data={notes}
                    renderItem={({item}) => <Card note={item}/>}
                ></FlatList>
                <Button title="log out" onPress={handleLogout}></Button>
            </View>
        </SafeAreaView>
    )
}

Notes.propTypes = {}

export default Notes