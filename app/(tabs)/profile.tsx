import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ClothingItem } from '@/interfaces/clothing';
import { Model } from '@/interfaces/model';
import { icons } from '@/constants/icons';

// Define an interface for history items
interface HistoryItem {
  id: string;
  modelId: string;
  modelName: string;
  clothingItems: ClothingItem[];
  prompt: string;
  generatedImage?: string;
  createdAt: string;
}

// Mock profile data (replace with real user data later)
const profileData = {
  username: '@georgia_overdrive',
  displayName: 'Georgia Overdrive',
  profileImage: icons.personb, // Using existing icon instead of asset
  bio: 'Digital fashion creator | AI enthusiast',
  following: 0,
  followers: 0,
  likes: 0
};

const Profile = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'actors' | 'items' | 'history'>('actors');
  const [actors, setActors] = useState<Model[]>([]);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const { width } = Dimensions.get('window');

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load actors
        const storedActorsJson = await AsyncStorage.getItem('customModels');
        if (storedActorsJson) {
          setActors(JSON.parse(storedActorsJson));
        }

        // Load clothing items
        const storedItemsJson = await AsyncStorage.getItem('customClothingItems');
        if (storedItemsJson) {
          setClothingItems(JSON.parse(storedItemsJson));
        }

        // Load history (placeholder for now)
        const storedHistoryJson = await AsyncStorage.getItem('generationHistory');
        if (storedHistoryJson) {
          setHistoryItems(JSON.parse(storedHistoryJson));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Render a model/actor card
  const renderActorItem = ({ item }: { item: Model }) => (
    <TouchableOpacity 
      className="m-1"
      onPress={() => router.push({
        pathname: '/(tabs)/modelSelection',
        params: { modelId: item.id }
      })}
      style={{ width: width / 3 - 8 }}
    >
      <View className="relative">
        <Image
          source={typeof item.thumbnailImage === 'string' ? { uri: item.thumbnailImage } : item.thumbnailImage}
          className="w-full aspect-square rounded-md"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
          <Text className="text-white text-xs" numberOfLines={1}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render a clothing item card
  const renderClothingItem = ({ item }: { item: ClothingItem }) => (
    <TouchableOpacity 
      className="m-1"
      onPress={() => {/* Navigate to clothing detail */}}
      style={{ width: width / 3 - 8 }}
    >
      <View className="relative">
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          className="w-full aspect-square rounded-md"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
          <Text className="text-white text-xs" numberOfLines={1}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render a history item card
  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity 
      className="m-1"
      onPress={() => {/* Navigate to history detail */}}
      style={{ width: width / 3 - 8 }}
    >
      <View className="relative">
        <Image
          source={item.generatedImage ? { uri: item.generatedImage } : icons.history}
          className="w-full aspect-square rounded-md"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
          <Text className="text-white text-xs" numberOfLines={1}>{item.prompt}</Text>
        </View>
        <Text className="text-xs text-gray-500 mt-1">{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Profile Header */}
      <View className="items-center pt-4 pb-2 px-4 border-b border-gray-200">
        <View className="relative">
          <Image
            source={profileData.profileImage}
            className="w-24 h-24 rounded-full"
          />
          <TouchableOpacity 
            className="absolute bottom-0 right-0 bg-cyan-500 w-8 h-8 rounded-full items-center justify-center"
          >
            <Text className="text-white text-xl">+</Text>
          </TouchableOpacity>
        </View>
        
        <Text className="text-xl font-bold mt-2">{profileData.username}</Text>
        
        {/* Stats Row */}
        <View className="flex-row justify-center mt-4 w-full">
          <View className="items-center mx-6">
            <Text className="text-xl font-bold">{profileData.following}</Text>
            <Text className="text-gray-500">Following</Text>
          </View>
          
          <View className="items-center mx-6">
            <Text className="text-xl font-bold">{profileData.followers}</Text>
            <Text className="text-gray-500">Followers</Text>
          </View>
          
          <View className="items-center mx-6">
            <Text className="text-xl font-bold">{profileData.likes}</Text>
            <Text className="text-gray-500">Likes</Text>
          </View>
        </View>
        
        {/* Edit Profile Button */}
        <View className="flex-row mt-4 w-full">
          <TouchableOpacity className="flex-1 bg-gray-100 py-2 rounded-lg border border-gray-300">
            <Text className="text-black text-center font-semibold">Edit profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="ml-2 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
            <Text className="text-black">▼</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bio */}
        <TouchableOpacity className="mt-3 mb-2 w-full items-center">
          <Text className="text-center text-gray-500">+ Add bio</Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Navigation */}
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity 
          className={`flex-1 items-center py-3 ${activeTab === 'actors' ? 'border-b-2 border-black' : ''}`}
          onPress={() => setActiveTab('actors')}
        >
          <Text className={activeTab === 'actors' ? 'font-bold' : ''}>Actors</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-1 items-center py-3 ${activeTab === 'items' ? 'border-b-2 border-black' : ''}`}
          onPress={() => setActiveTab('items')}
        >
          <Text className={activeTab === 'items' ? 'font-bold' : ''}>Items</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-1 items-center py-3 ${activeTab === 'history' ? 'border-b-2 border-black' : ''}`}
          onPress={() => setActiveTab('history')}
        >
          <Text className={activeTab === 'history' ? 'font-bold' : ''}>History</Text>
        </TouchableOpacity>
      </View>
      
      {/* Content Area */}
      <View className="flex-1">
        {activeTab === 'actors' && (
          actors.length > 0 ? (
            <FlatList
              data={actors}
              renderItem={renderActorItem}
              keyExtractor={item => item.id}
              numColumns={3}
              contentContainerStyle={{ padding: 2 }}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">No actors added yet</Text>
              <TouchableOpacity 
                className="mt-4 bg-primary py-2 px-4 rounded-lg"
                onPress={() => router.push('/modelSelection')}
              >
                <Text className="text-white font-medium">Add Actors</Text>
              </TouchableOpacity>
            </View>
          )
        )}
        
        {activeTab === 'items' && (
          clothingItems.length > 0 ? (
            <FlatList
              data={clothingItems}
              renderItem={renderClothingItem}
              keyExtractor={item => item.id}
              numColumns={3}
              contentContainerStyle={{ padding: 2 }}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">No clothing items added yet</Text>
              <TouchableOpacity 
                className="mt-4 bg-primary py-2 px-4 rounded-lg"
                onPress={() => router.push('/dressing')}
              >
                <Text className="text-white font-medium">Add Clothing Items</Text>
              </TouchableOpacity>
            </View>
          )
        )}
        
        {activeTab === 'history' && (
          historyItems.length > 0 ? (
            <FlatList
              data={historyItems}
              renderItem={renderHistoryItem}
              keyExtractor={item => item.id}
              numColumns={3}
              contentContainerStyle={{ padding: 2 }}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">No generation history yet</Text>
              <TouchableOpacity 
                className="mt-4 bg-primary py-2 px-4 rounded-lg"
                onPress={() => router.push('/savedGeneration')}
              >
                <Text className="text-white font-medium">Create Generation</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>
      
      {/* Bottom Tab Bar - This would typically be handled by the app's navigation */}
      <View className="flex-row justify-around py-3 border-t border-gray-200">
        <TouchableOpacity className="items-center">
          <Text className="text-2xl">|||</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center">
          <Text className="text-2xl">🔒</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center">
          <Text className="text-2xl">✉️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center">
          <Text className="text-2xl">👤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;