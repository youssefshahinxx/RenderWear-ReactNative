import {ActivityIndicator, FlatList, Image, ScrollView, Text, View, Dimensions, TouchableOpacity, ImageBackground} from "react-native";
import {icons} from "@/constants/icons";
import {useRouter} from "expo-router";
import { useState } from "react";
import ActionButton from "@/components/ActionButton";
import CollectionComponent from "@/components/CollectionCards";
import { images } from "@/constants/images";
import CarouselGallrey from "@/components/CarouselGallrey";


const dropdownData = [
  {
    id: '1',
    icon: icons.person,
    title: '1. Choose Your Actor',
    description: 'Browse our curated gallery of actor images and select the one that embodies your creative vision. With detailed profiles and carousel previews, finding the perfect face for your style story has never been easier.'
  },
  {
    id: '2',
    icon: icons.star,
    title: '2. Select Your Outfit',
    description: 'Mix and match from an exclusive collection of clothing pieces. Navigate through categories like tops, bottoms, and accessories to create a unique ensemble that speaks to your style.'
  },
  {
    id: '3',
    icon: icons.dresser,
    title: '3. Generate Your Look',
    description: 'Leverage our cutting-edge AI to bring your concept to life. See your chosen actor wearing the selected outfit in realistic images, and explore multiple angles to perfect your look before making a decision.'
  }
];

export default function Index() {
    const router = useRouter();
    const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
    // const screenWidth = Dimensions.get('window').width;
    // const screenHeight = Dimensions.get('window').height;

    const DropdownItem = ({ item }: { item: typeof dropdownData[0] }) => {
        const isExpanded = expandedDropdown === item.id;

        const toggleDropdown = () => {
            setExpandedDropdown(isExpanded ? null : item.id);
        };

        return (
            <View className="mb-4 border border-primary rounded-xl">
                <TouchableOpacity 
                    onPress={toggleDropdown} 
                    className="flex-row items-center justify-between p-4"
                >
                    <View className="flex-row items-center">
                        <Image source={item.icon} className="w-6 h-6 mr-3" />
                        <Text className="text-dark-100 font-semibold">{item.title}</Text>
                    </View>
                    <Text className="text-light-300">{isExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                
                {isExpanded && (
                    <View className="p-4 bg-primary border-t border-light-300">
                        <Text className="text-dark-100">{item.description}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
    <View className="flex-1 bg-primary mb-10">
        <ScrollView className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 20}}>
        <Image source={icons.logo} className="w-[180px] h-[70px] mt-20 mb-5 mx-auto"/>

            {/* Welcome Message */}
            <View className="mb-6">
                <Text className="text-2xl font-bold text-dark-100">
                    Welcome, Creative!
                </Text>
                <Text className="text-light-300 mt-1">
                    Ready to transform your imagination into reality?
                </Text>
            </View>

            {/* Featured Banner */}
            <View className="bg-secondary rounded-xl p-5 mb-2">
                <Text className="text-white text-xl font-bold mb-2">
                    Unleash Your Creativity
                </Text>
                <Text className="text-white opacity-90">
                    Transform your ideas into stunning visuals with our AI-powered tool
                </Text>
            </View>

            {/* AI Features Carousel */}
            <CarouselGallrey/>

            {/* Image
            <View className="mb-0 mt-10 items-center">
                <Image 
                    source={icons.person} 
                    className="w-[300px] h-[200px] rounded-xl" 
                    resizeMode="cover"
                /></View> */}

            {/* AI Features */}
            <View className="mt-6">
                <Text className="text-[30px] mb-1 font-bold justify-center text-center text-dark-100">
                What Do We Do?    
                </Text>
                <Text className="text-dark-100 mb-1 justify-center text-center">We blend creativity and technology to revolutionize virtual styling.</Text>
                <Text className="text-light-300 mt-1">Our app takes curated actor images and a handpicked collection of clothing pieces, then uses the power of AI to generate realistic visuals of your chosen actor wearing your selected outfits. Whether you're a stylist looking to experiment or a fashion enthusiast exploring new trends, we enable you to visualize and perfect your style before making any choices.</Text>
            </View>

            {/* Action Button */}
            <ActionButton label="Visualize Now" />

            {/* Collection Cards */}
            {/* <Image source={images.nbg} className=" w-full z-0"/> */}
            <CollectionComponent/>

            {/* Dropdown Features */}
            <View className="mb-10 mt-6">
                <Text className="text-xl font-bold text-dark-100 ">
                How It Works: Your Virtual Styling
                </Text>
                {dropdownData.map((item) => (
                    <DropdownItem key={item.id} item={item} />
                ))}
            </View>   
        </ScrollView>
    </View>
  );
}
