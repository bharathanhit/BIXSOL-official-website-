const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const PROVIDER = process.env.SCRAPER_PROVIDER || 'serpapi';

const DEFAULT_DEMO_RESULTS = [
  {
    id: 'demo-001',
    name: 'Sunrise Home Repairs',
    phone: '+91 98765 43210',
    address: 'Sector 14, Noida',
    website: '',
    mapUrl: 'https://www.google.com/maps',
    source: 'Demo',
  },
  {
    id: 'demo-002',
    name: 'Green Leaf Cafe',
    phone: '+91 87654 32109',
    address: 'Koramangala, Bangalore',
    website: '',
    mapUrl: 'https://www.google.com/maps',
    source: 'Demo',
  },
  {
    id: 'demo-003',
    name: 'Jyoti Events & Decor',
    phone: '+91 76543 21098',
    address: 'Andheri West, Mumbai',
    website: '',
    mapUrl: 'https://www.google.com/maps',
    source: 'Demo',
  },
];

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const buildSerpApiUrl = ({ query, location, limit }) => {
  const searchQuery = `${query}${location ? ` ${location}` : ''}`.trim();
  const params = new URLSearchParams({
    engine: 'google_maps',
    q: searchQuery,
    api_key: SCRAPER_API_KEY,
    google_domain: 'google.com',
    hl: 'en',
    num: String(limit || 10),
  });
  return `https://serpapi.com/search.json?${params.toString()}`;
};

const buildGoogleTextSearchUrl = ({ query, location }) => {
  const searchQuery = `${query}${location ? ` in ${location}` : ' in Tamil Nadu'}`.trim();
  const params = new URLSearchParams({
    query: searchQuery,
    key: GOOGLE_MAPS_API_KEY,
    region: 'in',
    language: 'en',
  });
  return `https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`;
};

const buildGoogleDetailsUrl = (placeId) => {
  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'name,formatted_address,formatted_phone_number,website,geometry,place_id,rating',
    key: GOOGLE_MAPS_API_KEY,
    language: 'en',
  });
  return `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;
};

const normalizeBusiness = (item) => {
  return {
    id: item.place_id || item.uuid || item.local_id || item.position?.toString() || item.name || `biz-${Math.random().toString(36).slice(2, 10)}`,
    name: item.title || item.name || item.name_raw || 'Unknown Business',
    phone: item.phone || item.phone_number || item.international_phone_number || item.displayed_phone || item.formatted_phone_number || '',
    address: item.address || item.raw_address || item.localized_address || item.formatted_address || '',
    website: item.website || item.website_url || '',
    mapUrl: item.mapUrl || item.url || item.map_url || item.website || 'https://www.google.com/maps',
    source: item.source || 'Unknown',
    rating: item.rating || '',
  };
};

const fetchGoogleMapsBusinesses = async ({ query, location, limit }) => {
  const searchUrl = buildGoogleTextSearchUrl({ query, location });
  const searchResponse = await fetch(searchUrl, { method: 'GET' });
  const searchResult = await searchResponse.json();

  if (searchResult.status !== 'OK' && searchResult.status !== 'ZERO_RESULTS') {
    throw new Error(searchResult.error_message || `Google Maps API error: ${searchResult.status}`);
  }

  const candidates = Array.isArray(searchResult.results) ? searchResult.results.slice(0, limit) : [];
  const detailsPromises = candidates.map(async (candidate) => {
    const placeId = candidate.place_id;
    if (!placeId) return null;
    const detailsUrl = buildGoogleDetailsUrl(placeId);
    const detailsResponse = await fetch(detailsUrl, { method: 'GET' });
    const detailsResult = await detailsResponse.json();
    if (detailsResult.status !== 'OK') return null;
    const payload = {
      place_id: placeId,
      name: detailsResult.result.name || candidate.name,
      phone: detailsResult.result.formatted_phone_number || '',
      address: detailsResult.result.formatted_address || candidate.formatted_address || '',
      website: detailsResult.result.website || '',
      url: `https://www.google.com/maps/place/?q=place_id:${placeId}`,
      rating: detailsResult.result.rating || candidate.rating || '',
      source: 'Google Maps',
    };
    return normalizeBusiness(payload);
  });

  const detailItems = await Promise.all(detailsPromises);
  return detailItems.filter(Boolean).filter(item => item.name).slice(0, limit);
};

const fetchOsmBusinesses = async ({ query, location, limit }) => {
  // Improve relevance by forming queries like "<query> in <location> India"
  const locPart = location ? `${location} India` : 'Tamil Nadu, India';
  let q = query ? `${query} in ${locPart}` : locPart;
  q = q.trim();
  const params = new URLSearchParams({ q, format: 'json', addressdetails: '1', limit: String(limit || 10) });
  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Bixsol/1.0 (developer@bixsol.local)'
    }
  });
  const items = await resp.json();
  if (!Array.isArray(items)) return [];
  return items.map(it => normalizeBusiness({
    place_id: it.osm_id || it.place_id || `${it.osm_type}-${it.osm_id}`,
    name: (it.display_name || '').split(',')[0] || 'Unknown',
    phone: '',
    address: it.display_name || '',
    website: '',
    url: it.url || `https://www.openstreetmap.org/${it.osm_type}/${it.osm_id}`,
    source: 'OpenStreetMap',
  })).slice(0, limit || 10);
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const payload = safeJsonParse(event.body || '{}');
  const query = (payload.query || '').trim();
  const location = (payload.location || '').trim();
  const limit = Math.min(Math.max(Number(payload.limit) || 10, 1), 25);

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Query is required' }),
    };
  }

  if (!GOOGLE_MAPS_API_KEY && !SCRAPER_API_KEY) {
    try {
      const osmResults = await fetchOsmBusinesses({ query, location, limit });
      if (Array.isArray(osmResults) && osmResults.length > 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({ businesses: osmResults, message: 'OpenStreetMap fallback results.' }),
        };
      }
    } catch (osmErr) {
      console.warn('OSM fallback failed:', osmErr);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        businesses: DEFAULT_DEMO_RESULTS,
        message: 'No API key configured. Demo results are returned for testing.',
      }),
    };
  }

  try {
    let businesses = [];
    if (GOOGLE_MAPS_API_KEY) {
      businesses = await fetchGoogleMapsBusinesses({ query, location, limit });
    } else if (SCRAPER_API_KEY && PROVIDER === 'serpapi') {
      const url = buildSerpApiUrl({ query, location, limit });
      const response = await fetch(url, { method: 'GET' });
      const result = await response.json();
      const rawBusinesses = result.local_results || result.nearby_results || result.results || [];
      businesses = Array.isArray(rawBusinesses)
        ? rawBusinesses.map(normalizeBusiness).filter(item => item.name).slice(0, limit)
        : [];
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No supported scraping provider configured.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ businesses }),
    };
  } catch (err) {
    console.error('Scrape businesses error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unable to fetch businesses' }),
    };
  }
};
