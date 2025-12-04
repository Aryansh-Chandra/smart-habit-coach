import React, { useState } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { TabView } from "react-native-tab-view";

import HomeScreen from "../screens/HomeScreen";
import InsightsScreen from "../screens/InsightsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const routes = [
  { key: "home", title: "Home" },
  { key: "insights", title: "Insights" },
  { key: "settings", title: "Settings" },
];

export default function SwipeTabs({ navigation }) {
  const [index, setIndex] = useState(0);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "home":
        return <HomeScreen navigation={navigation} />;
      case "insights":
        return <InsightsScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  const bottomTabs = [
    {
      key: "home",
      label: "Home",
      icon: require("../../assets/icons/home.png"),
    },
    {
      key: "insights",
      label: "Insights",
      icon: require("../../assets/icons/insights.png"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: require("../../assets/icons/settings.png"),
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Swipeable content */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={() => null}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
      />

      {/* FLOATING ADD BUTTON – FIXED HERE */}
      {index === 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate("AddHabit")}
          style={{
            position: "absolute",
            bottom: 90, // lifted above bottom bar
            right: 25,
            backgroundColor: "#007bff",
            width: 65,
            height: 65,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            elevation: 6,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
          }}
        >
          <Text style={{ color: "white", fontSize: 35, marginTop: -3 }}>+</Text>
        </TouchableOpacity>
      )}

      {/* Custom bottom bar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          height: 65,
          borderTopWidth: 0.5,
          borderTopColor: "#ddd",
          backgroundColor: "#fff",
        }}
      >
        {bottomTabs.map((tab, i) => {
          const focused = index === i;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setIndex(i)}
              style={{ alignItems: "center" }}
            >
              <Image
                source={tab.icon}
                style={{
                  width: 28,
                  height: 28,
                  tintColor: focused ? "#007bff" : "#999",
                  marginBottom: 2,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 11,
                  color: focused ? "#007bff" : "#999",
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
