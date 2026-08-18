import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    // We restrict search to Maharashtra, India
    // Nominatim allows bounding box or country/state restrictions
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.append('q', query);
    url.searchParams.append('state', 'Maharashtra');
    url.searchParams.append('country', 'India');
    url.searchParams.append('format', 'json');
    url.searchParams.append('addressdetails', '1');
    url.searchParams.append('limit', '8');

    // Nominatim requires a user-agent
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'HomeBite-LocalApp-Dev/1.0',
        'Accept-Language': 'en'
      }
    });

    if (!response.ok) {
      console.error("Nominatim API error", response.status);
      return NextResponse.json({ results: [] });
    }

    const data = await response.json();

    // Map to our UserLocation format
    const results = data.map((item: any) => {
      const address = item.address || {};
      
      // Determine the best name for the locality/area
      const localityName = address.suburb || address.neighbourhood || address.city_district || address.town || address.village || address.city || item.name;
      
      // Determine city
      const city = address.city || address.town || address.county || "Maharashtra";

      // Build a friendly label: "Locality, City" or just "City" if they searched for a city directly
      let label = localityName;
      if (localityName !== city && city !== "Maharashtra") {
        label = `${localityName}, ${city}`;
      } else if (localityName === "Maharashtra") {
        label = "Maharashtra";
      }

      return {
        label: label,
        locality: localityName,
        city: city,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      };
    });

    // Remove duplicates by label
    const uniqueResults = results.filter((v: any, i: number, a: any[]) => 
      a.findIndex(t => (t.label === v.label)) === i
    );

    return NextResponse.json({ results: uniqueResults });

  } catch (error) {
    console.error("Error fetching location data:", error);
    return NextResponse.json({ results: [] });
  }
}
