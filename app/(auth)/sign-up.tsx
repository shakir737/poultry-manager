import { authStyles } from "@/assets/styles/auth.style";
import { COLORS } from "@/constants/color";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { addUsers } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";

interface Authentication {
  name: string;
  companyName: string;
  email: string;
  password: string;
}
export default function page  () {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editMode, setEditMode] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSignUp = async () => {
    if (editMode.name === "" || editMode.companyName === "" || editMode.email === "" || editMode.password === "") return Alert.alert("Error", "Please fill in all fields");
  setLoading(true);
    const user = {
    name: editMode.name,
    email: editMode.email,
    companyName: editMode.companyName,
    password: editMode.password
   }

  await addUsers(user);
  Alert.alert("Success", "User Registration: successfull");
  setLoading(false)
  router.push("/(tabs)/home");
   
  };

  const handleInputChange = (key: keyof Authentication, value: string) => {
    setEditMode(prevData => ({ ...prevData, [key]: value }));
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        style={authStyles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Container */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("@/assets/images/loginIcon.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Create Account</Text>
     <View style={authStyles.formContainer}>
          <View style={authStyles.inputContainer}>
                    <TextInput
                     style={authStyles.textInput}
                     value={editMode.name}
                     onChangeText={text => handleInputChange('name', text)}
                     placeholderTextColor={COLORS.textLight}
                     placeholder="Enter your name"
                     />
          </View>

           <View style={authStyles.inputContainer}>
                    <TextInput
                     style={authStyles.textInput}
                     value={editMode.companyName}
                     onChangeText={text => handleInputChange('companyName', text)}
                     placeholderTextColor={COLORS.textLight}
                     placeholder="Enter your company name"
                     />
          </View> 
         
            {/* Email Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter email"
                placeholderTextColor={COLORS.textLight}
                value={editMode.email}
                onChangeText={text => handleInputChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter password"
                placeholderTextColor={COLORS.textLight}
                value={editMode.password}
                onChangeText={text => handleInputChange("password", text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <TouchableOpacity style={authStyles.linkContainer} onPress={() => router.push("/(auth)")}>
              <Text style={authStyles.linkText}>
                Already have an account? <Text style={authStyles.link}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
