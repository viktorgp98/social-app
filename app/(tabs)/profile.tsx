import Loader from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { Text, View } from "react-native";

const Profile = () => {
  /* new */
  const { signOut, userId } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  const [editedProfile, setEditedProfile] = useState({
    fullName: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
  });

  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);
  const posts = useQuery(api.posts.getPostsByUser, {});
  const updateProfile = useMutation(api.users.updateProfile);
  const handleSaveProfile = async () => {};

  if (!currentUser || posts === undefined) return <Loader />;

  /* return (
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
  ); */

  return (
    <View style={styles.container}>
      <Text>Profile screen</Text>
    </View>
  );
};

export default Profile;
