import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      Linking.openURL(Linking.createURL("/(auth)/sign-in"));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <TouchableOpacity
      className="bg-grey px-5 py-2 mt-8"
      onPress={handleSignOut}
    >
      <Text className="rounded-xl text-white font-bold text-md text-center ">
        Sign out
      </Text>
    </TouchableOpacity>
  );
};
