import { Image } from "expo-image";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";


interface categoryProps {
    categories: category[]
    selectedCategory: string;
    onSelectCategory: (categoryName: string) => void;
}
interface category {
    id: string;
    name: string;
    image: string;
}
export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: categoryProps) {
  return (
    <View >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
       
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          return (
            <TouchableOpacity
              key={category.id}
            //   style={[homeStyles.categoryButton, isSelected && homeStyles.selectedCategory]}
              onPress={() => onSelectCategory(category.name)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: category.image }}
                // style={[homeStyles.categoryImage, isSelected && homeStyles.selectedCategoryImage]}
                contentFit="cover"
                transition={300}
              />
              <Text
                // style={[homeStyles.categoryText, isSelected && homeStyles.selectedCategoryText]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}