import { View, Text, StyleSheet, Image } from "react-native";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Login");
    }, 3000);
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title} className="text-white font-medium text-2xl">
        Url
        <Text style={styles.title} className="text-sky-400 font-semibold">
          {" "}
          Shortener
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#101010",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
