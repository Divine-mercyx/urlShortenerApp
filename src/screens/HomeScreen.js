import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import axios from "axios";

export default function HomeScreen() {
  const [user, setUser] = useState({});
  const [originalUrl, setOriginalUrl] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const url = "https://urlshortener-etcr.onrender.com/shorten";

  const getUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.log("user fetch error:", error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const handleShorten = async () => {
    if (!originalUrl) {
      Alert.alert("Missing URL", "Please enter a valid URL to shorten");
      return;
    }

    setIsGenerating(true);

    try {
      const payload = {
        originalUrl,
        shortUrl: customUrl,
        user: user,
      };
      await axios.post(url, payload);
      setShortenedUrl(`https://urlshortener-etcr.onrender.com/${customUrl}`);
    } catch (error) {
      Alert.alert("Error", "Failed to shorten the URL. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    const supported = Linking.canOpenURL(shortenedUrl);
    if (supported) {
      await Linking.openURL(shortenedUrl);
    } else {
      window.alert("do not know how to open url");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>URL Shortener</Text>
        <Text style={styles.subtitle}>
          Create short, memorable links instantly
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Original URL</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="https://your-long-url.com/example"
              placeholderTextColor="#888"
              value={originalUrl}
              onChangeText={setOriginalUrl}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="url"
            />
            <Feather
              name="link"
              size={20}
              color="#888"
              style={styles.inputIcon}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Custom Short Code (Optional)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="my-custom-alias"
              placeholderTextColor="#888"
              value={customUrl}
              onChangeText={setCustomUrl}
              style={styles.input}
              autoCapitalize="none"
            />
            <Text style={styles.domainPrefix}>shrt.xyz/</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, isGenerating && styles.buttonDisabled]}
          onPress={handleShorten}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Text style={styles.buttonText}>Generating...</Text>
          ) : (
            <Text style={styles.buttonText}>Shorten URL</Text>
          )}
        </TouchableOpacity>
      </View>

      {shortenedUrl && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Your Short URL:</Text>
          <TouchableOpacity style={styles.resultBox} onPress={copyToClipboard}>
            <Text style={styles.resultUrl} numberOfLines={1}>
              {shortenedUrl}
            </Text>
            <Feather name="copy" size={18} color="#3b82f6" />
          </TouchableOpacity>
          <Text style={styles.hintText}>Tap to copy to clipboard</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Logged in as: {user?.username}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#e2e8f0",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
  },
  inputContainer: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#e2e8f0",
    marginBottom: 8,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    color: "#f1f5f9",
    paddingVertical: 14,
    fontSize: 16,
  },
  inputIcon: {
    marginLeft: 8,
  },
  domainPrefix: {
    color: "#94a3b8",
    marginRight: 4,
  },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 20,
  },
  resultLabel: {
    color: "#94a3b8",
    marginBottom: 8,
  },
  resultBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#334155",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  resultUrl: {
    color: "#60a5fa",
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  hintText: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerText: {
    color: "#64748b",
    fontSize: 12,
  },
});
