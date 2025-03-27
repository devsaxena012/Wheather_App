import { useState, useEffect } from "react";
import { 
  View, Text, TextInput, FlatList, 
  TouchableOpacity, StyleSheet, ActivityIndicator, Alert 
} from "react-native";
import { Button, Card } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from "react-native-animatable";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather, fetchCitySuggestions } from "../app/store/weatherSlice";
import { Feather } from "@expo/vector-icons"; 
import * as Location from "expo-location";
import axios from "axios";

export default function HomeScreen() {
  const [city, setCity] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useDispatch();
  const { loading, data, suggestions, error } = useSelector((state) => state.weather);

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  // Get user location and fetch weather
  const getCurrentLocationWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access for weather updates.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Convert coordinates to city name
      const API_KEY = "0c2b1f56f23c49f6b91141703251903";
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`
      );

      const detectedCity = response.data.location.name;
      setCity(detectedCity);
      dispatch(fetchWeather(detectedCity));

    } catch (error) {
      Alert.alert("Error", "Failed to get location. Please try again.");
    }
  };

  // Handle text input and city suggestions
  const handleCityChange = (text) => {
    setCity(text);
    if (text.length > 2) {
      dispatch(fetchCitySuggestions(text));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle city selection
  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity);
    setShowSuggestions(false);
    dispatch(fetchWeather(selectedCity));
  };

  const handleSearch = () => {
    if (city) dispatch(fetchWeather(city));
    setShowSuggestions(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.gradient}>
        <Text style={styles.title}>Weather App</Text>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter city"
            value={city}
            onChangeText={handleCityChange}
          />
          {city.length > 0 && (
            <TouchableOpacity onPress={() => { setCity(""); setShowSuggestions(false); }} style={styles.clearIcon}>
              <Feather name="x" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* City suggestions list */}
        {showSuggestions && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            style={styles.suggestionList}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectCity(item.name)} style={styles.suggestionItem}>
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.noCityFound}>No city found</Text>
            )}
          />
        )}

<Button mode="contained" onPress={handleSearch} loading={loading} style={styles.button}>
        Search
      </Button>

        {/* Loading Spinner */}
        {loading && <ActivityIndicator size="large" color="white" style={styles.loader} />}

        {/* Error Message */}
        {error && <Text style={styles.errorText}>Error: {error}</Text>}

        {/* Weather Info */}
        {!loading && data && data.current && (
          <Animatable.View animation="fadeInUp" duration={1000} style={styles.weatherContainer}>
            <Card style={styles.card}>
              <Card.Content>
                <Feather name="cloud" size={80} color="#4facfe" />
                <Text style={styles.city}>{data.location.name}</Text>
                <Text style={styles.temperature}>{data.current.temp_c}°C</Text>
                <Text style={styles.condition}>{data.current.condition.text}</Text>
              </Card.Content>
            </Card>
          </Animatable.View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  gradient: { flex: 1, width: "100%", alignItems: "center", paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, padding: 8 },
  clearIcon: { padding: 5 },

  suggestionList: {
    width: "80%",
    maxHeight: 200,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  suggestionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  suggestionText: { textAlign: "center", fontSize: 16 },
  noCityFound: { padding: 10, color: "red", textAlign: "center" },

  loader: { marginVertical: 20 },

  errorText: { color: "red", fontSize: 16, marginVertical: 10 },

  weatherContainer: { alignItems: "center", marginTop: 20, padding: 20 },
  card: { width: 250, alignItems: "center", padding: 20, borderRadius: 10 },
  city: { fontSize: 30, fontWeight: "bold", color: "#333", marginTop: 10 },
  temperature: { fontSize: 50, fontWeight: "bold", color: "#4facfe" },
  condition: { fontSize: 20, color: "#666" },
});
