import { Button, Text, TouchableOpacity } from "react-native"
import { Note } from "../firebase/models"
import { useNavigation } from "@react-navigation/core"
import { StackParams } from "../App"
import {notesRef} from '../firebase/firebase'
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { DocumentData } from "firebase/firestore"

interface Props {
    note: DocumentData
}

const Card = (props: Props) => {

    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>()

    

  return (
    
    <TouchableOpacity
        style={{padding: 15, width: 350 , borderBottomWidth: 1, borderBottomColor: '#333'}}
        onPress={() => navigation.navigate("note", {note: props.note})}
    >
        <Text style={{color: 'white'}} numberOfLines={1}>{props.note.text}</Text>
    </TouchableOpacity>
    
  )
}

export default Card