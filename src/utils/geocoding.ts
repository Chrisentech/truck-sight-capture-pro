
export interface FormattedAddress {
  address_line_1: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
}

export const getFormattedAddress = async (latitude: number, longitude: number): Promise<FormattedAddress> => {
  try {
    // Using OpenStreetMap's Nominatim with more detailed parameters for better accuracy
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18&accept-language=en`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'TruckAssistanceApp/1.0', // Adding user agent improves service reliability
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('Geocoding response:', JSON.stringify(data, null, 2));
    
    return {
      address_line_1: data.display_name?.split(',')[0] || '',
      street: data.address?.road || data.address?.street || '',
      city: data.address?.city || data.address?.town || data.address?.village || '',
      state: data.address?.state || '',
      zipcode: data.address?.postcode || '',
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

// Alternative geocoding function using MapBox if needed in the future
// Would require API key setup
/* 
export const getFormattedAddressAlt = async (latitude: number, longitude: number): Promise<FormattedAddress> => {
  // Implementation for alternative service
}; 
*/
