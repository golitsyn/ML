var mlmeta = {};
mlmeta['version'] = "4.9.1";

var tips = [
  "Tip: If you hold down the action button for a few seconds it will stay pressed!",
  "Tip: Cover your entire house in floors to keep underground thieves from breaking in!",
  "Tip: Tap on an enemy to target them. You will automatically fight, great for spears!",
  "Tip: To unlock all cosmetics, please login and support the game at mysteralegacy.com",
  "Tip: Upgrade Pack Rat to increase weight capacity, and Scholar to increase exp gain!"
  ];
mlmeta.tip = tips[Math.floor(Math.random() * tips.length)];

mlmeta.servers = [
  {
  "title": "USTexas",
  "ip": "ust.mysteralegacy.com"
},
  {
  "title": "USWest",
  "ip": "usw.mysteralegacy.com"
},
  {
  "title": "USEast",
  "ip": "use.mysteralegacy.com"
},
  {
  "title": "Europe",
  "ip": "eu.mysteralegacy.com"
},
  {
  "title": "Brasil",
  "ip": "br.mysteralegacy.com"
},
  {
  "title": "SE Asia(maintenance)",
  "ip": "sea.mysteralegacy.com"
},
  {
  "title": "London",
  "ip": "ldn.mysteralegacy.com"
},
  {
  "title": "USEast2",
  "ip": "use2.mysteralegacy.com"
},
  {
  "title": "Sudamérica",
  "ip": "sa.mysteralegacy.com"
},
  {
  "title": "USWest2",
  "ip": "usw2.mysteralegacy.com"
}
];

mlmeta.news = "";

if (document && document.location && document.location.search) window.history.replaceState('', '', '?');