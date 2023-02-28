import { useEffect, useRef, useState } from 'react'
import { Button, Text, TextInput, Image, SafeAreaView, View, ActivityIndicator } from 'react-native'
import { db, notesRef, storage } from '../firebase/firebase'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParams } from '../App'
import { Note as INote } from '../firebase/models'
import * as ImagePicker from 'expo-image-picker'
import { useDownloadURL, useUploadFile } from 'react-firebase-hooks/storage'
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useDocument } from 'react-firebase-hooks/firestore'
import { Camera, CameraType } from 'expo-camera';

// Could clean up this component in the future


type Props = NativeStackScreenProps<StackParams, "note">

const Note = (props: Props) => {

  const { note } = props.route.params
  const [image, setImage] = useState<string>(note.imageURL)
  const [content, setContent] = useState(note.text)
  const [imageLoading, setImageLoading] = useState(false)
  const [cameraOut, setCameraOut] = useState(false)
  const [cameraProperties, setCameraProperties] = useState<{ cameraOut: boolean, cameraType: CameraType }>({ cameraOut: false, cameraType: CameraType.back })
  const cameraRef = useRef(null)

  const [uploadFile, uploadingFile] = useUploadFile();


  const handleChange = (text: string) => {
    setDoc(doc(db, 'notes', note.id), { updatedAt: new Date(), text: text, imageURL: image } as INote)
  }

  const handleDelete = () => {
    deleteDoc(doc(db, "notes", note.id))
  }

  const handleUploadImage = async (imagePath: string) => {
    setImageLoading(true)
    const res = await fetch(imagePath);
    const blob = await res.blob();

    const result = await uploadFile(storageRef(storage, note.id), blob)
    if (result) {
      getDownloadURL(storageRef(storage, result.metadata.fullPath)).then((url) => {
        setImageLoading(false)
        setImage(url)
        setDoc(doc(db, 'notes', note.id), { ...note, updatedAt: new Date(), imageURL: url } as INote)
      })

    }

  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {

      handleUploadImage(result.assets[0].uri)
    }
  };

  const toggleCamera = () => {
    setCameraProperties({ ...cameraProperties, cameraOut: !cameraProperties.cameraOut })
  }

  const takePhoto = async () => {
    if (cameraRef) {
      try {
        // @ts-ignore
        const data = await cameraRef.current.takePictureAsync()
        handleUploadImage(data.uri)
        toggleCamera()
      } catch (e) {
        console.log(e)
      }
    }
  }

  const toggleCameraType = () => {
    if (cameraProperties.cameraType == CameraType.back) {
      setCameraProperties({ ...cameraProperties, cameraType: CameraType.front })
    } else if (cameraProperties.cameraType == CameraType.front) {
      setCameraProperties({ ...cameraProperties, cameraType: CameraType.back })
    }
  }

  useEffect(() => {
    if (content === '') {
      handleDelete()
    } else {
      handleChange(content)

    }
  }, [content])




  return (
    <SafeAreaView style={{ backgroundColor: '#131312', minHeight: '100%' }}>
      <TextInput
        style={{ fontSize: 20, padding: 30, paddingTop: 40, color: 'white' }}
        multiline={true}
        onChangeText={(text) => setContent(text)}
      >
        {note.text}
      </TextInput>
      <View style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
        {uploadingFile || imageLoading ?
          <View style={{ width: '85%', height: 250, position: 'absolute', top: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
          : <></>}
        {image && !cameraProperties.cameraOut ? <Image style={{ width: '85%', height: 250 }} source={{ uri: image }}></Image> : <></>}
        {cameraProperties.cameraOut ?
          <Camera ref={cameraRef} type={cameraProperties.cameraType} style={{ width: '85%', height: 250, display: 'flex', justifyContent: 'flex-end' }}>
            <Button title='switch' onPress={toggleCameraType}></Button>
            <Button title='take' onPress={takePhoto}></Button>
          </Camera>
          : <></>}
      </View>
      <Button title='upload image' onPress={pickImage}></Button>
      <Button title={cameraProperties.cameraOut ? 'hide camera' : 'pull out a camera'} onPress={toggleCamera}></Button>
    </SafeAreaView>
  )
}

export default Note