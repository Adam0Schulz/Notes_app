import { useEffect, useState } from 'react'
import { Button, Text, TextInput, Image } from 'react-native'
import { notesRef } from '../firebase/firebase'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParams } from '../App'
import { Note as INote } from '../firebase/models'
import * as ImagePicker from 'expo-image-picker'

type Props = NativeStackScreenProps<StackParams, "note">

const Note = (props: Props) => {

  const [images, setImages] = useState<any[]>([])

  

  const { note } = props.route.params

  const [content, setContent] = useState(note.text)

  const handleChange = (text: string) => {
    notesRef.doc(note.id).update({ updatedAt: new Date(), text: text } as INote)
  }

  const handleDelete = () => {
    notesRef.doc(note.id).delete()
  }

  useEffect(() => {
    if (content === '') {
      handleDelete()
    } else if (notesRef.doc(note.id)) {
      handleChange(content)

    }
  }, [content])

  return (
    <>
    <TextInput
      style={{ fontSize: 20, padding: 30, paddingTop: 40, backgroundColor: '#131312', minHeight: '80%', color: 'white' }}
      multiline={true}
      onChangeText={(text) => setContent(text)}
    >
      {note.text}
    </TextInput>
    
    </>
  )
}

export default Note