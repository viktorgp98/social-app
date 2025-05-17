import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const Login = () => {
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });
      if (setActive && createdSessionId) {
        /* Auth the current user */
        setActive({ session: createdSessionId });
        /* redirect to tabs */
        router.replace("/(tabs)/index" as any);
      }
    } catch (error) {
      console.log("0Auth error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Brand section*/}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="terminal-outline" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>HackerStuff</Text>
        <Text style={styles.tagline}>Your daily dose of tech news</Text>
      </View>
      {/* illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("@/assets/images/auth-bg.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>
      {/* login */}
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

export default Login;
