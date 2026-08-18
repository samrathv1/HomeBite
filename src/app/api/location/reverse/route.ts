import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lon');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse');
    url.searchParams.append('lat', lat);
    url.searchParams.append('lon', lng);
    url.searchParams.append('format', 'json');
    url.searchParams.append('addressdetails', '1');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'HomeBite-LocalApp-Dev/1.0',
        'Accept-Language': 'en'
      }
    });

    if (!response.ok) {
      console.error("Nominatim Reverse API error", response.status);
      return NextResponse.json({ label: "Current Location", locality: "", city: "" });
    }

    const data = await response.json();
    const address = data.address || {};
    
    // Determine the best name for the locality/area
    const localityName = address.suburb || address.neighbourhood || address.city_district || address.town || address.village || address.city || data.name || "Current Location";
    
    // Determine city
    const city = address.city || address.town || address.county || address.state || "Maharashtra";

    // Build a friendly label
    let label = localityName;
    if (localityName !== city && city !== "Maharashtra") {
      label = `${localityName}, ${city}`;
    } else if (localityName === "Maharashtra") {
      label = "Maharashtra";
    }

    return NextResponse.json({ 
      label,
      locality: localityName,
      city: city,
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    });

  } catch (error) {
    console.error("Error fetching reverse location data:", error);
    return NextResponse.json({ label: "Current Location", locality: "", city: "" });
  }
}
