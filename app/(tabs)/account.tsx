import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "~/lib/useColorScheme";

export default function AccountPage() {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View className="flex items-center justify-center h-full">
      <Button className="flex flex-row gap-4 items-center">
        <Ionicons
          name={"logo-google"}
          size={16}
          color={isDarkColorScheme ? "black" : "white"}
        />
        <Text>Login with Google</Text>
      </Button>
    </View>
  );
}
