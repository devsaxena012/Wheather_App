import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWeather, getCitySuggestions } from '../api/weatherService';

// Fetch Weather Data
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city) => {
    return await getWeather(city);
  }
);

// Fetch City Suggestions
export const fetchCitySuggestions = createAsyncThunk(
  'weather/fetchCitySuggestions',
  async (query) => {
    return await getCitySuggestions(query);
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: { data: null, loading: false, error: null, suggestions: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCitySuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      });
  },
});

export default weatherSlice.reducer;
