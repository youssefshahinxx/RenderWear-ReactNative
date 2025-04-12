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
            <View className="mb-4 border border-primary bg-[#F0F0F0] rounded-xl">
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
    <View className="flex-1 bg-primary mb-10 pb-10">
        
        <ScrollView className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 20}}>
            {/* Featured Banner */}
            {/* <View className="bg-[#F0F0F0] rounded-xl mx-5 mt-20 p-5">
                <Text className="text-dark-200 text-xl font-bold mb-2">
                Welcome, Creative!
                </Text>
                <Text className="text-dark-200 opacity-90">
                    Transform your ideas into stunning visuals with our AI-powered tool
                </Text>
            </View> */}

            
            <View className="flex-1 align-center justify-center mr-10">
            </View>

            <View className="flex-1 align-center justify-center mx-4 mt-10 pt-5  mr-10">
                <Image source={icons.girl} className="w-[393px] h-[430px]" resizeMode="cover"/>
            </View>

            <View className="mt-2 mx-5">
                <Text className="text-[30px] mb-1 font-bold justify-center text-center text-dark-100">
                What Do We Do?    
                </Text>
                <Text className="text-dark-100 mb-1 justify-center text-center">We blend creativity and technology to revolutionize virtual styling.</Text>
                <Text className="text-light-300 mt-1 justify-center text-center">Our app takes curated actor images and a handpicked collection of clothing pieces, then uses the power of AI to generate realistic visuals of your chosen actor wearing your selected outfits. </Text>
            </View>
            
                {/* Action Button */}
            <ActionButton label="Get Started" />

            <View className="mt-10">
            </View>
            
            {/* <View className="mt-10 mx-5">
                <Text className="text-[30px] font-bold text-center text-dark-100 mb-4">
                    AI-Powered Outfit Generation
                </Text>
                <Text className="text-light-300 text-center mb-8">
                    Instantly create unique outfit designs{'\n'}Style Anytime, Anywhere!
                </Text>
                <View className="flex-row justify-between px-4">
                    <View className="items-center">
                        <Image source={icons.person} className="w-12 h-12 mb-2" resizeMode="contain" />
                        <Text className="text-dark-100 text-center text-sm">Fashion{'\n'}Enthusiasts</Text>
                    </View>
                    <View className="items-center">
                        <Image source={icons.untitled} className="w-12 h-12 mb-2" resizeMode="contain" />
                        <Text className="text-dark-100 text-center text-sm">Production{'\n'}Teams</Text>
                    </View>
                    <View className="items-center">
                        <Image source={icons.starb} className="w-12 h-12 mb-2" resizeMode="contain" />
                        <Text className="text-dark-100 text-center text-sm">Everyone{'\n'}Else</Text>
                    </View>
                </View>
            </View> */}

            {/* AI Features Carousel */}
            <CarouselGallrey/>


            {/* AI Features */}
            

            <View className="flex-1 align-center justify-center mt-10 mr-10">
            </View>
            <View className=" mt-10">
                <Text className="text-[30px] mb-1 font-bold justify-center text-center text-dark-100">
                Revolutionizing Try-On Experiences   
                </Text>
                {/* <Text className="text-dark-100 mb-1 justify-center text-center">We blend creativity and technology</Text> */}
                <Text className="text-light-300 mt-1 justify-center shadow-l text-center">Create, customize, and try-on outfits in real time using advanced AI technologies.</Text>
            </View>
            {/* Collection Cards */}
            <CollectionComponent/>

            {/* Dropdown Features */}
            <View className="mb-10 mt-6 mx-5">
                <Text className="text-xl mb-4 font-bold text-dark-100 ">
                How It Works: Your Virtual Styling
                </Text>
                {dropdownData.map((item) => (
                    <DropdownItem key={item.id} item={item} />
                ))}
            </View>   

            {/* Target Users Section */}
            
        </ScrollView>
    </View>
  );
}
