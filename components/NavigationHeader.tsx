import { View } from "react-native";
import { Text } from "./ui/text";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { router } from "expo-router";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import Constants from "expo-constants";

export default function NavigationHeader({
  title,
  back,
}: {
  title: string;
  back?: { title?: string; href?: string };
}) {
  return (
    <View
      className="py-4 pl-4 pr-2 flex flex-row justify-between items-center bg-background border-b border-muted-foreground/10"
      style={{ marginTop: Constants.statusBarHeight }}
    >
      <View className="flex flex-row items-center justify-start gap-2">
        {back && (
          <Button onPress={() => router.back()} variant="ghost" size="icon">
            <ArrowLeft
              className="text-foreground"
              size={23}
              strokeWidth={2.5}
            />
          </Button>
        )}
        <Text className="font-bold text-2xl">{title}</Text>
      </View>
      <ThemeToggle />
    </View>
  );
}
