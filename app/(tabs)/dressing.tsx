import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Alert, InteractionManager } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClothingItem } from '@/interfaces/clothing';
import { clothingData } from '@/constants/clothingData';
import ClothingPicker from '@/components/ClothingPicker';
import ModelPreview from '@/components/ModelPreview';
import AddClothingButton from '@/components/AddClothingButton';
import AddClothingForm from '@/components/AddClothingForm';

const MAX_SELECTED_ITEMS = 3;

const Dressing = () => {
  const router = useRouter();
  const { modelId } = useLocalSearchParams<{ modelId: string }>();
  
  const [selectedCategory, setSelectedCategory] = useState<string>(clothingData[0]?.id || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [customClothingItems, setCustomClothingItems] = useState<ClothingItem[]>([]);
  const [categories, setCategories] = useState(clothingData);

  // Load custom clothing items from AsyncStorage on component mount
  useEffect(() => {
    const loadCustomClothingItems = async () => {
      try {
        const storedItemsJson = await AsyncStorage.getItem('customClothingItems');
        
        if (storedItemsJson) {
          const storedItems: ClothingItem[] = JSON.parse(storedItemsJson);
          setCustomClothingItems(storedItems);
          
          // Merge custom items with default categories
          const updatedCategories = [...clothingData];
          
          // Add custom items to their respective categories and subcategories
          storedItems.forEach(item => {
            const categoryIndex = updatedCategories.findIndex(cat => cat.id === item.category);
            
            if (categoryIndex !== -1) {
              const subCategoryIndex = updatedCategories[categoryIndex].subCategories.findIndex(
                subCat => subCat.id === item.subCategory
              );
              
              if (subCategoryIndex !== -1) {
                // Add item if it doesn't already exist
                if (!updatedCategories[categoryIndex].subCategories[subCategoryIndex].items.some(i => i.id === item.id)) {
                  updatedCategories[categoryIndex].subCategories[subCategoryIndex].items.push(item);
                }
              }
            }
          });
          
          setCategories(updatedCategories);
        }
      } catch (error) {
        console.error('Error loading custom clothing items:', error);
      }
    };
    
    loadCustomClothingItems();
  }, []);

  // Handle selecting a clothing item
  const handleSelectItem = (item: ClothingItem) => {
    // Check if an item from the same subCategory is already selected
    const existingItemIndex = selectedItems.findIndex(
      selectedItem => selectedItem.subCategory === item.subCategory
    );

    if (existingItemIndex !== -1) {
      // Replace the existing item
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex] = item;
      setSelectedItems(updatedItems);
    } else {
      // Check if we've reached the maximum number of items
      if (selectedItems.length >= MAX_SELECTED_ITEMS) {
        Alert.alert(
          "Maximum Items Reached",
          `You can only select up to ${MAX_SELECTED_ITEMS} items. Please remove an item before adding a new one.`,
          [{ text: "OK" }]
        );
        return;
      }
      
      // Add the new item
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Handle removing a selected item
  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  // Handle saving the outfit
  const handleSaveOutfit = () => {
    // Here you would implement saving the outfit
    console.log('Saving outfit with items:', selectedItems);
    // Navigate back or to a confirmation screen
    router.back();
  };

  // Toggle preview visibility
  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };

  // Handle adding a new clothing item
  const handleAddClothingItem = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  // Handle saving a new or edited clothing item
  const handleSaveClothingItem = async (item: ClothingItem) => {
    try {
      // Get existing custom clothing items from AsyncStorage
      const storedItemsJson = await AsyncStorage.getItem('customClothingItems');
      let customItems: ClothingItem[] = [];
      
      if (storedItemsJson) {
        customItems = JSON.parse(storedItemsJson);
      }
      
      const isEditing = !!editingItem;
      
      if (isEditing) {
        // Update existing item
        customItems = customItems.map(existingItem => 
          existingItem.id === item.id ? item : existingItem
        );
        
        // Update categories state
        const updatedCategories = [...categories];
        const categoryIndex = updatedCategories.findIndex(cat => cat.id === item.category);
        
        if (categoryIndex !== -1) {
          const subCategoryIndex = updatedCategories[categoryIndex].subCategories.findIndex(
            subCat => subCat.id === item.subCategory
          );
          
          if (subCategoryIndex !== -1) {
            // Update item in the subcategory
            updatedCategories[categoryIndex].subCategories[subCategoryIndex].items = 
              updatedCategories[categoryIndex].subCategories[subCategoryIndex].items.map(
                existingItem => existingItem.id === item.id ? item : existingItem
              );
          }
        }
        
        setCategories(updatedCategories);
      } else {
        // Add new item
        customItems.push(item);
        
        // Update categories state
        const updatedCategories = [...categories];
        const categoryIndex = updatedCategories.findIndex(cat => cat.id === item.category);
        
        if (categoryIndex !== -1) {
          const subCategoryIndex = updatedCategories[categoryIndex].subCategories.findIndex(
            subCat => subCat.id === item.subCategory
          );
          
          if (subCategoryIndex !== -1) {
            // Add item to the subcategory
            updatedCategories[categoryIndex].subCategories[subCategoryIndex].items.push(item);
          }
        }
        
        setCategories(updatedCategories);
      }
      
      // Save updated custom items back to AsyncStorage
      await AsyncStorage.setItem('customClothingItems', JSON.stringify(customItems));
      setCustomClothingItems(customItems);
      
      console.log(`Clothing item ${isEditing ? 'updated' : 'saved'} successfully:`, item.id);
    } catch (error) {
      console.error(`Error ${editingItem ? 'updating' : 'saving'} clothing item:`, error);
      Alert.alert('Error', `Failed to ${editingItem ? 'update' : 'save'} the clothing item. Please try again.`);
    }
    
    setShowAddForm(false);
    setEditingItem(null);
  };

  // Handle editing a clothing item
  const handleEditClothingItem = (item: ClothingItem) => {
    // Use InteractionManager to ensure UI thread is not blocked
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        setEditingItem(item);
        setShowAddForm(true);
      }, 500);
    });
  };

  // Handle deleting a clothing item
  const handleDeleteClothingItem = async (item: ClothingItem) => {
    try {
      // Get existing custom clothing items from AsyncStorage
      const storedItemsJson = await AsyncStorage.getItem('customClothingItems');
      let customItems: ClothingItem[] = [];
      
      if (storedItemsJson) {
        customItems = JSON.parse(storedItemsJson);
      }
      
      // Remove the item from customItems
      customItems = customItems.filter(existingItem => existingItem.id !== item.id);
      
      // Update categories state
      const updatedCategories = [...categories];
      const categoryIndex = updatedCategories.findIndex(cat => cat.id === item.category);
      
      if (categoryIndex !== -1) {
        const subCategoryIndex = updatedCategories[categoryIndex].subCategories.findIndex(
          subCat => subCat.id === item.subCategory
        );
        
        if (subCategoryIndex !== -1) {
          // Remove item from the subcategory
          updatedCategories[categoryIndex].subCategories[subCategoryIndex].items = 
            updatedCategories[categoryIndex].subCategories[subCategoryIndex].items.filter(
              existingItem => existingItem.id !== item.id
            );
        }
      }
      
      // Save updated custom items back to AsyncStorage
      await AsyncStorage.setItem('customClothingItems', JSON.stringify(customItems));
      setCustomClothingItems(customItems);
      setCategories(updatedCategories);
      
      // Remove from selected items if present
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem.id !== item.id));
      
      console.log('Clothing item deleted successfully:', item.id);
    } catch (error) {
      console.error('Error deleting clothing item:', error);
      Alert.alert('Error', 'Failed to delete the clothing item. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {showAddForm ? (
        <AddClothingForm 
          onClose={() => setShowAddForm(false)}
          onSave={handleSaveClothingItem}
          categories={categories}
          editItem={editingItem || undefined}
        />
      ) : (
        <>
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-gray-600">Back</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold">Dress Up</Text>
            <TouchableOpacity onPress={handleSaveOutfit}>
              <Text className="text-blue-600 font-medium">Save</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-1 flex-row">
            {/* Add Clothing Button */}
            <AddClothingButton onPress={handleAddClothingItem} />
            
            {/* Toggle button for preview */}
            <TouchableOpacity 
              className={`absolute top-2 ${isPreviewVisible ? 'left-[38%]' : 'left-0'} z-10 p-2 bg-primary rounded-r-lg`}
              onPress={togglePreview}
            >
              <Text className="text-black mr-2">{isPreviewVisible ? '◄' : '►'}</Text>
            </TouchableOpacity>

            {/* Left side: Model Preview */}
            {isPreviewVisible && (
              <View className="w-50">
                <ModelPreview
                  modelId={modelId || '1'} 
                  selectedItems={selectedItems} 
                />
                
                {selectedItems.length > 0 && (
                  <View className="mx-4 mt-4 mb-4">
                    <TouchableOpacity 
                      className="bg-red-500 py-2 rounded-lg"
                      onPress={() => setSelectedItems([])}
                    >
                      <Text className="text-white text-center font-medium">Clear All</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            
            {/* Right side: Clothing Picker */}
            <View className={`flex-1 ${isPreviewVisible ? 'ml-2' : ''}`}>
              <ClothingPicker
                categories={categories}
                onSelectItem={handleSelectItem}
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
                onSelectCategory={setSelectedCategory}
                onSelectSubCategory={setSelectedSubCategory}
                onEditItem={handleEditClothingItem}
                onDeleteItem={handleDeleteClothingItem}
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

export default Dressing