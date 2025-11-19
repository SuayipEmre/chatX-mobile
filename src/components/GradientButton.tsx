import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity } from "react-native";


type Props = {
    text : string,
    onPress?: () => void
}
const GradientButton : React.FC<Props> = ({text, onPress}) => {
  return (
    <TouchableOpacity
    onPress={onPress}
    className="mt-10 rounded-2xl overflow-hidden">
      <LinearGradient
        colors={["#2563eb", "#3b82f6"]} // blue-600 → blue-400
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="py-4 rounded-2xl"
      >
        <Text className="text-white text-lg font-semibold text-center">
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}


export default GradientButton