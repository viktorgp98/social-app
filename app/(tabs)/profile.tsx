import { SignOutButton } from "@/components/SignOutButton";
import { SignedIn, useUser } from "@clerk/clerk-expo";
import React from "react";
import { Text, View } from "react-native";

const Profile = () => {
  const { user } = useUser();
  return (
    <View className="flex-1 items-center align-middle mt-20">
      <Text className="text-4xl font-bold mb-10">Profile</Text>
      <SignedIn>
        <View className="text-[15px] flex-row gap-3">
          <Text>Hello</Text>
          <Text className="font-bold">{user?.username}</Text>
        </View>
        <SignOutButton />
      </SignedIn>
    </View>
  );
};

export default Profile;
