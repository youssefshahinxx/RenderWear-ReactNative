import { icons } from '@/constants/icons';
import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { images } from '@/constants/images';

const collectionData = [
  { id: '1', image: icons.personb, title: 'Virtual Actor Dressing' },
  { id: '2', image: icons.untitled, title: 'Personalized Outfit Creation' },
  { id: '3', image: icons.starb, title: 'Seamless Integration' },
  { id: '4', image: icons.history, title: 'history' },
  // Add more items as needed
];

const CollectionComponent = () => {

  const renderItem = ({ item }: { item: typeof collectionData[0] }) => (
    <TouchableOpacity className="w-1/2 p-2">
      <View className="bg-primary rounded-xl shadow-lg overflow-hidden">
      <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          className="w-full h-40 object-cover"
          resizeMode="cover"  // Ensure the image is not stretched
          />
        <Text className="text-secondary text-center text-sm font-semibold p-2">{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="relative w-full">
    {/* <Image source={images.nbg} className="absolute w-full z-0"/> */}
    <View className="flex-1 p-4">
      <FlatList
      scrollEnabled={false}
      data={collectionData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2} // Ensures 2 columns in the grid
      columnWrapperStyle={{ justifyContent: 'space-between' }} // Space between columns
      />
    </View>
      </View>
  );
};

export default CollectionComponent;
