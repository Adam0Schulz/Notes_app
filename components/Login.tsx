import { Text, TextInput, StyleSheet, SafeAreaView, View, Button } from "react-native"
import { auth } from '../firebase/firebase'
import { styles } from "../styles"
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/core"
import { StackParams } from "../App"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useAuthState } from "react-firebase-hooks/auth"
import { signInWithEmailAndPassword } from "firebase/auth";



const Login = () => {

  const [credentials, setCredentials] = useState<{ email: string, password: string }>({ email: '', password: '' })

  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>()

  const user = auth.currentUser

  useEffect(() => {
    auth.onAuthStateChanged((user: any) => {
      if (user) {
        navigation.navigate("notes", {})
      }
    })

  }, [])


  const handleLogin = () => {
    if (!user) { navigation.navigate("notes", {}) }
    signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      .catch((error: any) => alert(error.message))
  }

  return (
    <SafeAreaView style={styles.mainView}>
      <View style={styles.subMainView}>
        <Text style={localStyle.heading}>Welcome!</Text>
        <TextInput
          style={localStyle.textInput}
          multiline={false}
          placeholder="E-mail"
          placeholderTextColor={"white"}
          onChangeText={(text) => setCredentials({ ...credentials, email: text })}
        ></TextInput>
        <TextInput
          style={localStyle.textInput}
          multiline={false}
          placeholder="password"
          placeholderTextColor={"white"}
          secureTextEntry={true}
          onChangeText={(text) => setCredentials({ ...credentials, password: text })}
        ></TextInput>
        <Button title="Log in" onPress={handleLogin}></Button>
      </View>
    </SafeAreaView>
  )
}

const localStyle = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    padding: 15
  },
  heading: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20
  }
})

export default Login