
export interface FormattedAddress {
  address_line_1: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
}

export const getFormattedAddress = async (latitude: number, longitude: number): Promise<FormattedAddress> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
    {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }
  );
  
  const data = await response.json();
  
  return {
    address_line_1: data.display_name.split(',')[0] || '',
    street: data.address?.road || '',
    city: data.address?.city || data.address?.town || '',
    state: data.address?.state || '',
    zipcode: data.address?.postcode || '',
  };
};
