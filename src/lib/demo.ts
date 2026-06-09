const DEMO_DESCRIPTIONS = [
  "1952 France 5 Francs banknote featuring portrait of Marie and Pierre Curie on obverse, with allegorical scientific imagery. Printed by Banque de France, light blue and cream tones. Minor edge wear consistent with circulation. Serial numbers intact.",
  "1964 Kennedy Half Dollar, United States. Obverse features left-facing portrait of President John F. Kennedy by Gilroy Roberts. Reverse displays Presidential Seal eagle design. 90% silver composition. Lightly circulated with original mint luster visible.",
  "Vintage linen postcard circa 1940s depicting the Blue Ridge Mountains, Virginia. Handwritten message on reverse dated August 1947. 'Visit Virginia — America's Colonial History' banner text across bottom. Divided back, used condition, light postal cancellation.",
  "1923 Germany 50 Millionen Mark hyperinflation banknote. Weimar Republic emergency currency, Reichsbank issue. Orange and brown printed design. Corner fold present; serial number clear. Historical artifact from German economic crisis period.",
  "1900 Liberty Head V Nickel, United States Mint Philadelphia. Charles Barber design obverse with Liberty facing left, roman numeral V reverse with CENTS denomination. Fine details visible, slight surface wear. 100% copper-nickel composition.",
  "Real photo postcard RPPC showing main street view of small town America, circa 1910-1920. Horse-drawn cart visible foreground, general store signage readable. Black and white photographic print on postcard stock. Minor crease upper right corner.",
  "1935 Canada One Dollar silver note. Blue seal George V portrait issue. Scenes of Parliament Hill reverse. Crisp original paper, light handling marks only. Prefix and serial clearly legible. Bank of Canada first series.",
  "Ancient Roman bronze coin circa 3rd century AD. Obverse shows laureate bust of emperor, reverse depicts standing figure with standard. 20mm diameter, 4.2 grams. Green patina consistent with age and burial. Exact emperor identification requires specialist review.",
  "1950s souvenir postcard featuring Niagara Falls panoramic view, New York/Ontario border. Chrome-era color lithograph with brilliant blues and whites. 'Wonder of the World' caption text. Unused, excellent condition with original gloss finish.",
  "1918 United States One Dollar Federal Reserve Note, New York district. Large size paper money, green seal. Female allegorical figure with eagle design. Circulated condition, all four corners present, center fold. Educational and historical collectible.",
]

export const DEMO_MODE_KEY = '__DEMO_MODE__'

export async function getDemoDescription(filename: string): Promise<string> {
  // Simulate realistic processing time (0.8 - 2.5 seconds)
  const delay = 800 + Math.floor(seededRandom(filename) * 1700)
  await new Promise(r => setTimeout(r, delay))

  // Pick a description based on filename hash so same file always gets same description
  const idx = Math.abs(hashCode(filename)) % DEMO_DESCRIPTIONS.length
  return DEMO_DESCRIPTIONS[idx]
}

function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return h
}

function seededRandom(seed: string): number {
  const h = Math.abs(hashCode(seed + 'rand')) % 1000
  return h / 1000
}
