import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [username, setUsername] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [error, setError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    if (!username || !emailAddress || !password) {
      setError("All fields are required!");
      return;
    } else [setError("")];

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        username,
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setError(
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: unknown }).message)
          : String(err)
      );
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <>
        <View
          style={styles.container}
          className="items-start align-middle p-2 pt-20 mx-auto w-auto"
        >
          <Text className="font-bold text-4xl">Verify{"\n"} your email</Text>
          <View
            style={{
              borderBottomWidth: 2,
              borderColor: error ? COLORS.error : COLORS.primary,
            }}
            className="w-60  mb-8"
          >
            <TextInput
              value={code}
              placeholder="Enter your verification code"
              onChangeText={(code) => setCode(code)}
              className="mt-8"
            />
          </View>
          <TouchableOpacity
            className="rounded-xl  bg-primary w-60 px-20 py-2 mx-auto mb-5 shadow-md shadow-primary"
            onPress={onVerifyPress}
          >
            <Text className="text-white font-bold uppercase text-center">
              Verify
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <View
      style={styles.container}
      className="items-start align-middle p-2 pt-10 mx-auto w-auto"
    >
      <>
        <Text className="w-auto text-left font-bold text-4xl text-wrap pt-20 mb-8">
          Create{"\n"} your account
        </Text>
        <View
          style={{
            borderBottomWidth: 2,
            borderColor: error ? COLORS.error : COLORS.primary,
          }}
          className="w-60  mb-5"
        >
          <TextInput
            autoCapitalize="none"
            value={username}
            placeholder="Create an username"
            onChangeText={(username) => setUsername(username)}
          />
        </View>
        <View
          style={{
            borderBottomWidth: 2,
            borderColor: error ? COLORS.error : COLORS.primary,
          }}
          className="w-60  mb-5"
        >
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            inputMode="email"
            onChangeText={(email) => setEmailAddress(email)}
          />
        </View>
        <View
          style={{
            borderBottomWidth: 2,
            borderColor: error ? COLORS.error : COLORS.primary,
          }}
          className="w-60   mb-8"
        >
          <TextInput
            value={password}
            placeholder="Enter password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        {/* Error message*/}
        {error && <Text className="text-red-500 mb-8 font-bold">{error}</Text>}
        <TouchableOpacity
          className="rounded-xl  bg-primary w-60 px-20 py-2 mx-auto mb-5 shadow-md shadow-primary"
          onPress={onSignUpPress}
        >
          <Text className="text-white font-bold uppercase">Continue</Text>
        </TouchableOpacity>
        <View
          style={{ display: "flex", flexDirection: "row", gap: 3 }}
          className="mt-5"
        >
          <Text>Already have an account?</Text>
          <Link href="/sign-in">
            <Text className="font-bold text-md">Sign in</Text>
          </Link>
        </View>
      </>
    </View>
  );
}
