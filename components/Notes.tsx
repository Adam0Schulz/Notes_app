import { useAuthState } from "react-firebase-hooks/auth"
import { Button, FlatList, Image, Text, View } from "react-native"
import { auth, notesRef, db, noteConverter } from "../firebase/firebase"
import { SafeAreaView } from "react-native-safe-area-context"
import { styles } from "../styles"
import { useCollection, useCollectionData } from "react-firebase-hooks/firestore"
import { Note } from "../firebase/models"
import Card from "./Card"
import { useNavigation } from "@react-navigation/core"
import { useEffect } from "react"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StackParams } from "../App"
import { DocumentData, Firestore, addDoc, limit, orderBy, query, where } from "firebase/firestore"



const Notes = () => {

    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>()
    const user = auth.currentUser

    const [notes] = useCollectionData<DocumentData>(query(notesRef.withConverter(noteConverter), orderBy("updatedAt"), limit(20)))

    const addNote = async () => {
        const newNote: Note = {
            text: 'New Note',
            updatedAt: new Date(),
            imageURL: ''
        }
        await addDoc(notesRef, newNote)
    }

    useEffect(() => {
        if (!user) {
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
                    renderItem={({ item }) => <Card note={item} />}
                ></FlatList>
                <Button title="log out" onPress={handleLogout}></Button>
            </View>
        </SafeAreaView>
    )
}

export default Notes