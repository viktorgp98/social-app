import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;
    if (!emailAddress || !password) {
      setError("All fields are required!");
      return;
    }
    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setError(
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: unknown }).message)
          : String(err)
      );
    }
  };

  //Handle the text input changes
  const refPasswordInput = useRef<TextInput>(null);

  const focusOnPassword = () => {
    if (refPasswordInput && refPasswordInput.current) {
      refPasswordInput.current.focus();
    }
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View className="p-2">
        {/* Brand section*/}
        <View style={styles.brandSection}>
          <Image
            source={require("@/assets/images/auth-bg.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
          <Text style={styles.appName}>HackerStuff</Text>
          <Text style={styles.tagline}>Your daily dose of tech news</Text>
        </View>
        {/* LOGIN */}
        <View style={styles.loginSection} className="mt-5">
          <View
            style={{
              borderBottomWidth: 2,
              borderColor: error ? COLORS.error : COLORS.primary,
            }}
            className="w-60 mb-5"
          >
            <TextInput
              autoCapitalize="none"
              inputMode="email"
              value={emailAddress}
              placeholder="Enter email"
              placeholderTextColor={"white"}
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              className="text-center text-white"
              returnKeyType="next"
              onSubmitEditing={focusOnPassword}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 2,
              borderColor: error ? COLORS.error : COLORS.primary,
            }}
            className="mb-8 w-60"
          >
            <TextInput
              value={password}
              placeholder="Enter password"
              placeholderTextColor={"white"}
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
              className="text-center text-white"
              ref={refPasswordInput}
              returnKeyType="done"
              onSubmitEditing={hideKeyboard}
            />
          </View>
          {/* Error message */}
          {error && (
            <Text className="text-red-500 mb-5 font-bold">{error}</Text>
          )}
          <TouchableOpacity
            onPress={onSignInPress}
            className="rounded-xl  bg-primary w-60 px-20 py-2 mx-auto mb-5 shadow-lg shadow-primary"
          >
            <Text className="text-center text-white font-bold uppercase">
              Login
            </Text>
          </TouchableOpacity>
          <View
            style={{ display: "flex", flexDirection: "row", gap: 5 }}
            className="mt-5 "
          >
            <Text className="text-white">Don't have an account yet?</Text>
            <Link href="/sign-up">
              <Text className="font-bold text-md text-white">Sign Up</Text>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
