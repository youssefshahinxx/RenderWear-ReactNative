import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ClothingItem } from '@/interfaces/clothing';
import { Model } from '@/interfaces/model';
import { modelData } from '@/constants/modelData';
import { icons } from '@/constants/icons';

// Define history item interface
interface HistoryItem {
  id: string;
  modelId: string;
  modelName: string;
  clothingItems: ClothingItem[];
  prompt: string;
  generatedImage?: string;
  createdAt: string;
}

const SavedGeneration = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // State for selected items
  const [model, setModel] = useState<Model | null>(null);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Load data based on params or from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if model ID is passed as param
        if (params.modelId) {
          // First try to find in predefined models
          let foundModel = modelData.find(m => m.id === params.modelId);
          
          // If not found, check custom models
          if (!foundModel) {
            const storedModelsJson = await AsyncStorage.getItem('customModels');
            if (storedModelsJson) {
              const storedModels = JSON.parse(storedModelsJson);
              foundModel = storedModels.find((m: Model) => m.id === params.modelId);
            }
          }
          
          if (foundModel) {
            setModel(foundModel);
          }
        } else {
          // If no model ID, load last selected model from storage
          const lastModelJson = await AsyncStorage.getItem('lastSelectedModel');
          if (lastModelJson) {
            setModel(JSON.parse(lastModelJson));
          }
        }
        
        // Load selected clothing items
        if (params.itemIds) {
          const itemIds = (params.itemIds as string).split(',');
          const storedItemsJson = await AsyncStorage.getItem('customClothingItems');
          
          if (storedItemsJson) {
            const allItems = JSON.parse(storedItemsJson);
            const selectedClothingItems = allItems.filter((item: ClothingItem) => 
              itemIds.includes(item.id)
            );
            
            setSelectedItems(selectedClothingItems);
          }
        } else {
          // If no item IDs, load last selected items from storage
          const lastItemsJson = await AsyncStorage.getItem('lastSelectedItems');
          if (lastItemsJson) {
            setSelectedItems(JSON.parse(lastItemsJson));
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, [params]);
  
  // Handle removing a clothing item
  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };
  
  // Handle generation
  const handleGenerate = async () => {
    if (!model) {
      Alert.alert('Model Required', 'Please select a model to continue.');
      return;
    }
    
    if (selectedItems.length === 0) {
      Alert.alert('Clothing Required', 'Please select at least one clothing item.');
      return;
    }
    
    if (!prompt.trim()) {
      Alert.alert('Prompt Required', 'Please enter a prompt for the generation.');
      return;
    }
    
    setGenerating(true);
    
    try {
      // Mock image generation (would be replaced with actual API call)
      // In a real app, this would call an AI image generation service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // We're not setting a URL anymore since we don't have a real image
      // Instead, we'll set a flag that indicates generation is complete
      setGeneratedImage('generated');
      
      // Save to history
      const historyItem: HistoryItem = {
        id: `generation-${Date.now()}`,
        modelId: model.id,
        modelName: model.name,
        clothingItems: selectedItems,
        prompt: prompt.trim(),
        generatedImage: 'generated', // Just a placeholder
        createdAt: new Date().toISOString()
      };
      
      // Get existing history or create new array
      const historyJson = await AsyncStorage.getItem('generationHistory');
      const history = historyJson ? JSON.parse(historyJson) : [];
      
      // Add new item to history
      history.unshift(historyItem);
      
      // Save updated history
      await AsyncStorage.setItem('generationHistory', JSON.stringify(history));
      
      // Show success alert
      Alert.alert(
        'Generation Complete',
        'Your image has been generated and saved to history!',
        [
          { 
            text: 'View History', 
            onPress: () => router.push('/(tabs)/profile') 
          },
          { 
            text: 'OK', 
            style: 'default' 
          }
        ]
      );
    } catch (error) {
      console.error('Error generating image:', error);
      Alert.alert('Generation Failed', 'There was an error generating your image. Please try again.');
    } finally {
      setGenerating(false);
    }
  };
  
  // Handle changing the model
  const handleChangeModel = () => {
    router.push('/(tabs)/modelSelection');
  };
  
  // Handle adding clothing items
  const handleAddClothing = () => {
    router.push('/(tabs)/dressing');
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Header */}
          <View className="pt-4 pb-2 px-4 border-b border-gray-200">
            <Text className="text-2xl font-bold text-center">Image Generation</Text>
          </View>
          
          {/* Model Preview */}
          <View className="m-4 bg-gray-100 rounded-lg overflow-hidden">
            <View className="bg-gray-200 py-2 px-4 flex-row justify-between items-center">
              <Text className="font-semibold">Selected Model</Text>
              <TouchableOpacity 
                className="bg-secondary rounded-full px-3 py-1"
                onPress={handleChangeModel}
              >
                <Text className="text-white text-xs">Change</Text>
              </TouchableOpacity>
            </View>
            
            {model ? (
              <View className="p-4 items-center">
                <Image
                  source={typeof model.thumbnailImage === 'string' 
                    ? { uri: model.thumbnailImage } 
                    : model.thumbnailImage
                  }
                  className="w-40 h-40 rounded-lg"
                  resizeMode="cover"
                />
                <Text className="mt-2 font-medium">{model.name}</Text>
                <Text className="text-xs text-gray-500">{model.gender}</Text>
              </View>
            ) : (
              <View className="p-8 items-center">
                <TouchableOpacity 
                  className="bg-secondary py-2 px-4 rounded-lg"
                  onPress={handleChangeModel}
                >
                  <Text className="text-white font-medium">Select a Model</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {/* Selected Clothing Items */}
          <View className="m-4 bg-gray-100 rounded-lg overflow-hidden">
            <View className="bg-gray-200 py-2 px-4 flex-row justify-between items-center">
              <Text className="font-semibold">Selected Clothing ({selectedItems.length})</Text>
              <TouchableOpacity 
                className="bg-secondary rounded-full px-3 py-1"
                onPress={handleAddClothing}
              >
                <Text className="text-white text-xs">Add Items</Text>
              </TouchableOpacity>
            </View>
            
            {selectedItems.length > 0 ? (
              <View className="p-4">
                {selectedItems.map(item => (
                  <View 
                    key={item.id} 
                    className="flex-row items-center mb-2 bg-white p-2 rounded-md"
                  >
                    <Image
                      source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                      className="w-12 h-12 rounded-md mr-3"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="font-medium">{item.name}</Text>
                      <Text className="text-xs text-gray-500">{item.subCategory}</Text>
                    </View>
                    <TouchableOpacity 
                      className="bg-red-100 h-8 w-8 rounded-full items-center justify-center"
                      onPress={() => handleRemoveItem(item.id)}
                    >
                      <Text className="text-red-500 font-bold">×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View className="p-8 items-center">
                <TouchableOpacity 
                  className="bg-secondary py-2 px-4 rounded-lg"
                  onPress={handleAddClothing}
                >
                  <Text className="text-white font-medium">Select Clothing Items</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {/* Prompt Input */}
          <View className="m-4 bg-gray-100 rounded-lg overflow-hidden">
            <View className="bg-gray-200 py-2 px-4">
              <Text className="font-semibold">Generation Prompt</Text>
            </View>
            <View className="p-4">
              <TextInput
                className="bg-white p-3 rounded-md min-h-[100px] text-base"
                placeholder="Describe the scene or style you want (e.g., 'Professional outfit in an office setting')"
                multiline
                value={prompt}
                onChangeText={setPrompt}
                textAlignVertical="top"
              />
              <Text className="text-xs text-gray-500 mt-2">
                Be specific about the style, scene, lighting, and mood you want to create.
              </Text>
            </View>
          </View>
          
          {/* Generated Image (if available) */}
          {generatedImage && (
            <View className="m-4 bg-gray-100 rounded-lg overflow-hidden">
              <View className="bg-gray-200 py-2 px-4">
                <Text className="font-semibold">Generated Image</Text>
              </View>
              <View className="p-4 items-center">
                <Text className="text-lg font-bold">Image Generated Successfully!</Text>
                <Image
                  source={icons.untitled}
                  className="w-full aspect-square rounded-lg"
                  resizeMode="contain"
                  style={{ width: 200, height: 200 }}
                />
                <Text className="mt-2 text-sm text-gray-500">
                  Prompt: {prompt}
                </Text>
              </View>
            </View>
          )}
          
          {/* Generate Button */}
          <View className="px-4 mt-4">
            <TouchableOpacity
              className={`py-4 rounded-lg items-center ${
                generating ? 'bg-gray-400' : 'bg-secondary'
              }`}
              onPress={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="#FFF" size="small" />
                  <Text className="text-white font-bold ml-2">Generating...</Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-lg">Generate Image</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SavedGeneration;