/**
 * Curated royalty-free photography (Unsplash License) and video (Pexels License).
 * Every asset used on the site is listed here and credited in CREDITS.md.
 */
import type { ProductImage } from "./types";

type Raw = [id: string, credit: string, alt: string];

const u = ([id, credit, alt]: Raw): ProductImage => ({
  src: `https://images.unsplash.com/${id}`,
  credit,
  alt,
});

const pool = (raws: Raw[]) => raws.map(u);

export const frockPool = pool([
  ["photo-1602303894456-398ce544d90b", "jeremybishop", "Woman in a yellow and red floral frock holding an orange flower"],
  ["photo-1542295669297-4d352b042bca", "olegivanovpht", "Woman in a light summer frock against a white wall"],
  ["photo-1582738509941-360b28c941ea", "gracamateusassane", "Woman in a white and red plaid frock wearing a black hat"],
  ["photo-1602303832953-05d841ee21f7", "jeremybishop", "Woman in a white frock standing in a sunlit hallway"],
  ["photo-1713109602723-742d185b0f36", "shirokov", "Woman in a white frock and straw hat"],
  ["photo-1786865573964-4da881ffd53c", "zulfugarkarimov", "Woman in a red polka-dot frock and sunglasses outdoors"],
  ["photo-1786865573488-220ead0edf93", "zulfugarkarimov", "Woman in a red polka-dot frock leaning on a railing"],
  ["photo-1669573929590-4806c8ffd3e6", "anamnesis33", "Woman in a soft frock standing on a porch"],
  ["photo-1717835558722-c823016e6c57", "mluotio83", "Woman in a yellow frock walking down a sidewalk"],
  ["photo-1789110519342-6d3f6b07a749", "enginakyurt", "Back view of a beige spaghetti-strap frock"],
  ["photo-1638188350702-8d32baf1abfb", "gracamateusassane", "Woman in a white frock on a phone call"],
  ["photo-1762154057377-cc9d3dd6900c", "sanskrutihomes", "Woman in a floral sundress standing outdoors"],
  ["photo-1602010069450-0a62034f235c", "debbyledet", "Woman in a black, white and red floral frock"],
  ["photo-1502868354157-ec2edd2a1651", "tamarabellis", "Woman in a white and red floral frock on a farm"],
  ["photo-1517970640957-23d07d5ed08c", "hannaholinger", "Woman in a white, blue and green printed frock"],
  ["photo-1592924514972-71c5938462d1", "devinnn_b", "Woman in a pink and white floral frock"],
  ["photo-1789110853872-f416085557fa", "enginakyurt", "Terracotta short-sleeve button-down frock"],
  ["photo-1789110519607-6176d668fb72", "enginakyurt", "Woman in a light green spaghetti-strap frock"],
  ["photo-1789110853844-d1a86b2c5b9b", "enginakyurt", "Green sleeveless frock with a rope belt"],
  ["photo-1747396206869-75ea57b325ce", "reistor", "Woman posing in a simple linen frock"],
  ["photo-1764298493197-a1c1cce57800", "byhomework", "Woman in a straw hat and linen frock against a wall"],
  ["photo-1610048616025-11a3dcc9fd0b", "bulbul252", "Woman in a white floral frock by a brown wall"],
  ["photo-1617258856138-402b60da4e2a", "skgphotography", "Woman in a blue floral frock"],
  ["photo-1726251654925-57aac6e36406", "p_kuzovkova", "Woman in a summer frock sitting on a stone wall"],
]);

export const dressPool = pool([
  ["photo-1761848572182-ae73d6f1cf7a", "chriscreations__", "Woman in a red dress at a dinner table"],
  ["photo-1609357605129-26f69add5d6e", "juniorreisfoto", "Woman in a green long-sleeve maxi dress in a field"],
  ["photo-1766365350371-655edd36e7b8", "gabrielonodegba", "Woman in a white maxi dress shielding her eyes from the sun"],
  ["photo-1685703203919-0c2cfc893c60", "ageing_better", "Woman in a long green dress"],
  ["photo-1671848633245-79cc98b0dbe8", "carlosm2514", "Woman in a colourful printed dress by a building"],
  ["photo-1783881210991-fe3c3c5759cd", "chriscreations__", "Elegant woman in a red dress by the coast"],
  ["photo-1766365350485-72904d0529a7", "gabrielonodegba", "Woman in a white dress on rocks by the ocean"],
  ["photo-1763539818199-4a721ae33de4", "hieuanhcauam", "Woman in a flowing dress outdoors"],
  ["photo-1676327478489-ae4f973d0bbe", "jkellner", "Woman in a yellow and blue floral midi dress"],
  ["photo-1681408467659-ae3f9740f379", "jkellner", "Woman in a floral midi dress leaning against a wall"],
  ["photo-1568252542512-9fe8fe9c87bb", "khaledkagii", "Woman in a maroon evening dress"],
  ["photo-1760893107461-baee57948240", "mahipalsocal", "Model in a sparkling purple embellished gown"],
  ["photo-1568251188392-ae32f898cb3b", "khaledkagii", "Woman in a black evening dress"],
  ["photo-1623580674393-edf6eb7090f8", "knightduong", "Woman in a black sleeveless dress"],
  ["photo-1765229277457-dd2f9f259f17", "fotografiaeditorial", "Woman in a purple sequinned gown with a slit"],
  ["photo-1765871421513-452fe03d15cc", "fotografiaeditorial", "Woman in a sparkling green evening gown"],
  ["photo-1765229277389-3a4a0de325c2", "fotografiaeditorial", "Woman in a purple formal dress"],
  ["photo-1583039949165-96ee24b0d8de", "hfestudio", "Woman in a red dress by a brick wall"],
  ["photo-1547697933-66bcb20f114a", "estermiguel", "Woman in a grey glitter gown beside a tree"],
  ["photo-1759992878336-a5dd342ea245", "reistor", "Woman in a floral wrap dress with a high slit"],
  ["photo-1625158244856-e5e20f733c1f", "elise_outside", "Woman in a white dress in a red flower field"],
  ["photo-1789145508216-ade0a26d518a", "xkatia", "Woman in a beige off-the-shoulder dress on the sand"],
  ["photo-1619794724492-651397287d94", "vinotm", "Woman in a black dress on an asphalt road"],
  ["photo-1653152707179-125e4e184a0b", "igorrand", "Woman in a green dress holding an apple"],
  ["photo-1664515226058-03952a19bd76", "rubenev520", "Woman in a red dress holding an umbrella"],
  ["photo-1551113006-731674fbb3ff", "naeimj", "Woman in a black and grey glittered long-sleeve dress"],
  ["photo-1700748910236-3b744b8dacad", "melbinjacob", "Woman in a brown dress and black boots"],
  ["photo-1700748910920-81f4826ede95", "melbinjacob", "Woman in a brown dress holding a black purse"],
]);

export const blousePool = pool([
  ["photo-1761117228880-df2425bd70da", "silkser", "Woman in a red blouse with a fine necklace"],
  ["photo-1761121317492-57feee4fc674", "silkser", "Back view of a red blouse"],
  ["photo-1680690517143-d813ac08cd13", "valentinaschick", "Woman wearing a white shirt and white trousers"],
  ["photo-1685278463552-51396b0a6287", "stachmann", "Woman in a crisp white shirt"],
  ["photo-1770294758906-c8762abb2c8b", "manitosilk_official", "Woman in a white sleeveless silk top"],
  ["photo-1600884350802-c6d0bf14dcc6", "marcc", "Woman in a white button-up blouse"],
  ["photo-1611235116156-0cbda6649efb", "maxdcrn", "Woman in an oversized white blouse"],
  ["photo-1665065952009-a5dc00f423d4", "cezarsmpio", "Close view of a white cotton shirt"],
  ["photo-1790539459975-3c468dcb209e", "stadinstudio", "Woman in a red satin blouse and black trousers"],
  ["photo-1790539460016-2c5a7a4e16be", "stadinstudio", "Woman in a red satin shirt outdoors"],
  ["photo-1567966456076-905a50a06d8c", "alexfae", "Beige V-neck top"],
  ["photo-1578747522731-9e5a179b02f7", "contentpixie", "White crew-neck sleeveless top with a gold necklace"],
  ["photo-1576193929684-06c6c6a8b582", "alipzn", "Woman in a black long-sleeve blouse"],
  ["photo-1613552465135-e5bdaada10bc", "edifieer", "Woman in a white long-sleeve blouse"],
  ["photo-1627117204847-ec306fe712bb", "ebadi__ahmad", "Woman in a green long-sleeve blouse"],
  ["photo-1786515441550-a380f8401a0a", "zulfugarkarimov", "Woman in a pale yellow halter top"],
  ["photo-1789110853466-4a541d4183a3", "enginakyurt", "Back view of a white eyelet blouse"],
  ["photo-1629737168222-baad8ecacebe", "bluemagnet", "Black and white checked button-up shirt"],
  ["photo-1662532577856-e8ee8b138a8b", "marjantaghipour", "Woman in a red blouse against a clear blue sky"],
  ["photo-1792695805509-3118afb732c8", "conniedevries", "Houndstooth blazer layered over a floral blouse"],
]);

export const skirtPool = pool([
  ["photo-1708363390847-b4af54f45273", "livioart", "Woman wearing a white shirt and black skirt"],
  ["photo-1789110854735-67c4e4737aa2", "enginakyurt", "White skirt with blue floral print"],
  ["photo-1789110519584-ce21260be4e6", "enginakyurt", "Woman in a white tank and red polka-dot skirt"],
  ["photo-1789110854402-7aa666508ef4", "enginakyurt", "White denim skirt with embellishment"],
  ["photo-1789110854005-6376fa97be36", "enginakyurt", "Black wrap skirt with a colourful print"],
  ["photo-1590852669429-d1cd8775ea59", "jamscreativephotography", "Woman in a white blouse and black floral skirt"],
  ["photo-1533659828870-95ee305cee3e", "vickyworld", "Smiling woman in a black skirt"],
  ["photo-1778590328057-5cb7f6af0d2d", "degli", "Woman in a denim jacket and black skirt outdoors"],
  ["photo-1762343041454-8f1fdd459811", "zulfugarkarimov", "Woman in a white skirt on a boat railing"],
  ["photo-1762342685668-a76f1a57d7d1", "zulfugarkarimov", "Woman in a black top and white skirt by the water"],
  ["photo-1789110853398-539d78dd63bc", "enginakyurt", "Woman in a white t-shirt and black skirt"],
  ["photo-1762343036425-f20316fd98ed", "zulfugarkarimov", "Woman in a white midi skirt by a railing"],
  ["photo-1762342676887-bf683bb21695", "zulfugarkarimov", "Woman in a white skirt sitting by the sea"],
  ["photo-1762343041573-aa2827852bc9", "zulfugarkarimov", "Woman posing in a white skirt"],
  ["photo-1762342676026-09e25daaf607", "zulfugarkarimov", "Woman in a white skirt on the waterfront"],
  ["photo-1783379800024-ee203699d0b0", "1hundredimages", "Woman in a green patterned top and black skirt"],
  ["photo-1620352361319-46d190f61c64", "faruktokluoglu", "Woman in a red top and white skirt"],
  ["photo-1773254214740-9fbc8d92688a", "rkalburgie", "Woman in a yellow turtleneck and patterned skirt"],
]);

export const pantsPool = pool([
  ["photo-1580651214613-f4692d6d138f", "fedotov_vs", "Woman in a white shirt and blue tailored trousers"],
  ["photo-1551854838-212c50b4c184", "concretelies_photography", "Woman in orange wide trousers"],
  ["photo-1789110519976-ea1f044db897", "enginakyurt", "Yellow trousers with a brown belt"],
  ["photo-1789110520148-bb52ba37759b", "enginakyurt", "Brown linen trousers with a drawstring waist"],
  ["photo-1789110854083-e4752bded644", "enginakyurt", "White high-waisted trousers"],
  ["photo-1789110520755-058df30bf9cb", "enginakyurt", "Wide-leg black trousers with a white geometric print"],
  ["photo-1789110520143-9f54f069b43f", "enginakyurt", "Mustard linen trousers with a drawstring waist"],
  ["photo-1789110853687-71692f0e86be", "enginakyurt", "Back view of beige wide-leg trousers"],
  ["photo-1789110520465-efc5ff05c95e", "enginakyurt", "Lavender utility trousers with a drawstring"],
  ["photo-1789110520410-4fce7246f844", "enginakyurt", "Light green cropped trousers"],
  ["photo-1789110854331-6d3cabfef781", "enginakyurt", "Red linen trousers with a beige top"],
  ["photo-1687825515654-23620796760c", "lauraaoliveira", "Woman in a white top and green trousers"],
  ["photo-1789111161072-766f7c6284cc", "enginakyurt", "Blue denim trousers seen from behind"],
  ["photo-1789110520500-de902eeb2b16", "enginakyurt", "Wide-leg trousers with a yellow tropical print"],
  ["photo-1789110520665-f07353f0afbe", "enginakyurt", "Wide-leg trousers with a red palm print"],
  ["photo-1789110520223-57e0438ff94a", "enginakyurt", "Wide-leg trousers with a floral pattern"],
  ["photo-1789110854236-8de32351d62a", "enginakyurt", "Blue denim trousers with a tie waist"],
  ["photo-1789110519554-bdca2e4549e5", "enginakyurt", "Woman in a white top and black trousers"],
  ["photo-1789110854083-ae8c8ad4086f", "enginakyurt", "Wide-leg trousers with a green and black print"],
  ["photo-1751399566412-ad1194241c5c", "alekonpictures", "Woman in a brown trouser suit"],
  ["photo-1774850236254-f0aa024ca20c", "skytechaviation0", "Smiling woman in a blazer and black trousers"],
  ["photo-1758598306980-c47a94c6708c", "silverkblack", "Woman in a grey trouser suit"],
]);

export const fabricPool = pool([
  ["photo-1528458909336-e7a0adfed0a5", "anniespratt", "Close-up of beige linen weave"],
  ["photo-1591195854242-8804547cdcab", "enginakyurt", "Close-up of brown woven fabric"],
  ["photo-1643313262988-cdc5f50c6019", "enginakyurt", "Close-up of soft grey fabric texture"],
  ["photo-1764437835706-ba9d63250bd2", "loganvoss", "Textured beige fabric"],
  ["photo-1776278515617-09ab61ec1eb8", "sigmund", "Light beige fabric with a fine grid weave"],
  ["photo-1619459074324-33d5f591c53e", "marcusurbenz", "Brown and black knit texture"],
  ["photo-1588610992315-5654831ceebd", "matreding", "White cotton laid on a wooden table"],
  ["photo-1630955110816-6fbcd2b87de4", "buburuzachan", "Red and white floral printed textile"],
  ["photo-1613891737415-be7670d21c19", "wanderfleur", "White and blue striped textile"],
  ["photo-1605871665507-46679ed05528", "enginakyurt", "Folded brown textile"],
]);

export const atelierImages = {
  cutting: u(["photo-1787505136265-9a99dad3bbac", "soujest", "A designer cutting white fabric in the VELORA studio"]),
  fitting: u(["photo-1787505136296-1e8f0750e5ff", "soujest", "Adjusting a white dress on a mannequin in the atelier"]),
  workshop: u(["photo-1770910195240-ddec777b77f6", "adrienolichon", "Mannequins and sewing supplies in a clothing workshop"]),
  sketching: u(["photo-1787505136259-5195dfbfcd01", "soujest", "A designer writing notes on a clipboard in the studio"]),
  spools: u(["photo-1705970268658-6f4d289099af", "paulo_pescada", "A rack of coloured thread spools"]),
  redDress: u(["photo-1705970268643-ee5981567df5", "paulo_pescada", "A red dress hanging beside spools of thread"]),
  machine: u(["photo-1618866903271-595806e0679d", "lexoge", "A tailored jacket beside a sewing machine"]),
  window: u(["photo-1771555557406-d1cae82cdbca", "liliantruong2603", "Spools of thread displayed in a shop window"]),
  desk: u(["photo-1600447766334-36a93f35a21d", "beazy", "A design desk with fabric swatches and tools"]),
};

export const boutiqueImages = {
  interior: u(["photo-1441984904996-e0b6ba687e04", "mercantile", "VELORA boutique interior with hanging racks"]),
  racks: u(["photo-1555529771-835f59fc5efe", "charlesdeluvio", "Clothes hanging on metal racks"]),
  display: u(["photo-1718985342149-7178154e0aee", "lauraperuchi", "A boutique display with clothes and hats"]),
  department: u(["photo-1521335629791-ce4aec67dd15", "prudenceearl", "Rows of clothes in a bright store"]),
  shopping: u(["photo-1525562723836-dca67a71d5f1", "camorin13", "A woman browsing clothes in a boutique"]),
  neutral: u(["photo-1769107805465-bfd41863f1a0", "___atmos", "A rail of neutral-toned dresses"]),
  coat: u(["photo-1621785847991-884bae1f95f1", "maybejensen", "A white coat hanging on a rail"]),
  windowRack: u(["photo-1640921734615-aeb4efe3e614", "lyssa739", "A rack of clothes beside a sunlit window"]),
  gown: u(["photo-1774009501393-bac5a0a11afc", "soujest", "A strapless white gown on a mannequin in a shop window"]),
};

export const lifestyleImages = {
  seaside: u(["photo-1496747611176-843222e1e57c", "tamarabellis", "Woman in a flowing dress walking by the sea with a woven bag"]),
  field: u(["photo-1746093154128-dd3907edcfed", "ionelaaaaa", "Woman in a dress twirling in a field at golden hour"]),
  flowers: u(["photo-1746093397786-4de644a8d6a9", "ionelaaaaa", "Woman smiling in a flower field wearing a dress"]),
  group: u(["photo-1785088560830-25149acf5178", "cordallman", "Eight women in colourful dresses standing together"]),
  garden: u(["photo-1786053807536-7676bd99f0ae", "cesaroneill", "Two women posing together in a garden"]),
  bouquet: u(["photo-1761745806834-cf91edc124ef", "celinecao", "Woman in a white dress holding flowers in a field"]),
  meadow: u(["photo-1717337680237-157e89c64a22", "beaverfernandez", "Woman standing in a meadow holding a bouquet"]),
  road: u(["photo-1478146896981-b80fe463b330", "theunsteady5", "Woman in a long dress standing in the middle of a road"]),
  door: u(["photo-1618244965061-1d27b208d6e8", "theawguide", "Woman in a brown coat beside a black wooden door"]),
  city: u(["photo-1554325109-87755d48a3fb", "marissacristina", "Woman walking through the city carrying a bag"]),
  pose: u(["photo-1664195455972-53827f75bad4", "ionelaaaaa", "Woman posing in a relaxed tailored outfit"]),
  runway: u(["photo-1762430790606-bf626757a00b", "kensvisionx", "Model walking the runway at a fashion show"]),
  rocks: u(["photo-1589565962511-1df0fb5471b2", "beccatapert", "Woman in a white dress walking on rocky ground"]),
  denim: u(["photo-1574413230698-f80892c96e13", "apostolosv", "Woman in a denim jacket walking along a path"]),
  gowns: u(["photo-1765229276796-c93c73cc3f3b", "fotografiaeditorial", "Two women in elegant gowns posing indoors"]),
  balcony: u(["photo-1657373307141-349a3393d4d9", "egorkomarov", "Woman standing on a balcony in a summer dress"]),
  shirtLook: u(["photo-1680690517143-d813ac08cd13", "valentinaschick", "Woman wearing a white shirt and white wide-leg trousers"]),
  stage: u(["photo-1551163943-3f6a855d1153", "romaxp", "Woman in an evening dress seated on a chair on stage"]),
};

export const portraitImages = [
  u(["photo-1580489944761-15a19d654956", "jakenackos", "Portrait of Amaya, a VELORA customer"]),
  u(["photo-1489278353717-f64c6ee8a4d2", "jblesly", "Portrait of Nadeesha, a VELORA customer"]),
  u(["photo-1562337404-3044c84ac061", "kozyrka_kate", "Portrait of Sophie, a VELORA customer"]),
  u(["photo-1567516364473-233c4b6fcfbe", "krivitskiy", "Portrait of Tharushi, a VELORA customer"]),
  u(["photo-1548382131-e0ebb1f0cdea", "wilks_and_cookies", "Portrait of Hannah, a VELORA customer"]),
  u(["photo-1534180477871-5d6cc81f3920", "belart84", "Portrait of Dilini, a VELORA customer"]),
  u(["photo-1611695434369-a8f5d76ceb7b", "nicotitto", "Portrait of Isabel, a VELORA customer"]),
  u(["photo-1623717217554-72ca676de535", "igorrodrigues", "Portrait of Kavya, a VELORA customer"]),
];

export const heroVideo = {
  desktop: "https://videos.pexels.com/video-files/38765207/16470641_1280_720_25fps.mp4",
  desktopHd: "https://videos.pexels.com/video-files/38765207/16470644_1920_1080_25fps.mp4",
  mobile: "https://videos.pexels.com/video-files/18317242/18317242-hd_720_1280_30fps.mp4",
  poster: "https://images.pexels.com/videos/38765207/pexels-photo-38765207.jpeg",
  posterMobile: "https://images.pexels.com/videos/18317242/mujer-con-vestido-beige-caminando-18317242.jpeg",
  credit: "Ventara Films (desktop) and a Pexels contributor (mobile) on Pexels",
};

/** Tiny blush gradient used as blur placeholder for remote images. */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64," +
  "PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0IDUnPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0nZycgeDE9JzAnIHkxPScwJyB4Mj0nMScgeTI9JzEnPjxzdG9wIG9mZnNldD0nMCcgc3RvcC1jb2xvcj0nI2Y0ZTNkYycvPjxzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nI2Q5YzdiMCcvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSc0JyBoZWlnaHQ9JzUnIGZpbGw9J3VybCgjZyknLz48L3N2Zz4=";
