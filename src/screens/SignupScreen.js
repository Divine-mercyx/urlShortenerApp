import {View, Text, StyleSheet, TextInput, TouchableOpacity, Button, Alert} from "react-native";
import {useState} from "react";
import axios from "axios";
import {useNavigation} from "@react-navigation/native";


export default function SignupScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const url = "https://urlshortener-etcr.onrender.com/api/v1/register"

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            window.alert("Please fill all fields");
            return;
        }

        if (password.length < 6) {
            window.alert("password length should be at least 6 characters");
            return;
        }

        if (username.length < 3) {
            window.alert("username length should be at least 3 characters");
            return;
        }

        try {
            const payload = {
                username: username,
                password: password,
            }
            const { data } = await axios.post(url, payload);
            window.alert(data.message);
            navigation.navigate("Login")
        } catch (error) {
            window.alert(error.response.data.message);
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <Text className="text-sky-400 text-2xl">Signup Here</Text>
            </View>

            <View className="w-full p-5">
                <View className="bg-zinc-900 p-1 mb-7 w-full rounded-2xl">
                    <TextInput
                        placeholder="Enter email"
                        placeholderTextColor="grey"
                        value={username}
                        onChangeText={setUsername}
                        keyboardType="default"
                        className="text-white p-4"
                    />
                </View>

                <View className="bg-zinc-900 p-1 mb-7 w-full rounded-2xl">
                    <TextInput
                        placeholder="Enter password"
                        placeholderTextColor="grey"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        className="text-white p-4"
                    />
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("Login")} className="mb-6 text-right">
                    <Text className="text-gray-500 text-right">Already have an account?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSubmit} className="p-5 text-center rounded-2xl bg-sky-600 w-full">
                    <Text className="text-white text-center">
                        Signup
                    </Text>
                </TouchableOpacity>
            </View>


        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#101010",
    }
})
