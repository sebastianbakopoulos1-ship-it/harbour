/* Fictional seed data. Every person, number, notice and service here is invented.
   Dates are generated relative to "today" so statuses stay meaningful. */
(function () {
  // Local calendar date (not UTC) — toISOString() would shift dates by a day in AEST/AEDT.
  const iso = (offsetDays) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + offsetDays); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const ago = (mins) => new Date(Date.now() - mins * 60000).toISOString();

  window.HARBOUR_SEED = () => ({
    version: 2,
    profile: {
      firstName: "Alex",
      lastName: "Morgan",
      email: "alex.morgan@example.com",
      phone: "0400 000 000",
      address: "12 Example Street, Sampleton NSW 2000",
      dob: "1994-03-14",
    },
    settings: {
      theme: "system",
      appLock: true,
      pin: "1234", // demo only — the Expo app will keep a hashed PIN in SecureStore
      biometrics: true,
      analytics: false,
      personalised: true,
      prefs: { registration: true, expiry: true, fines: true, announcements: false },
      homeOrder: ["vehicles", "fines", "notifications", "wallet", "account"],
    },
    credentials: [
      { id: "c1", kind: "Demo driver card", title: "Driver Card", style: "teal", fav: true, inWallet: true,
        number: "DEMO-DC-4821 0193", expiry: iso(612), issued: iso(-483),
        fields: [["Class", "C · Car"], ["Conditions", "None"], ["Status", "Demo — not valid"], ["Card type", "Demonstration"]], photo: true },
      { id: "c2", kind: "Demo photo card", title: "Photo Card", style: "slate", fav: false, inWallet: true,
        number: "DEMO-PC-7730 5512", expiry: iso(1420), issued: iso(-405),
        fields: [["Purpose", "Demo proof of age"], ["Status", "Demo — not valid"]], photo: true },
      { id: "c3", kind: "Demo recreational licence", title: "Fishing Licence", style: "kelp", fav: true, inWallet: true,
        number: "DEMO-RF-0042 8810", expiry: iso(48), issued: iso(-317),
        fields: [["Type", "Recreational · 1 year"], ["Waters", "Fictional — all"], ["Status", "Demo — not valid"]], photo: false },
      { id: "c4", kind: "Demo membership", title: "Harbourside Library", style: "sand", fav: false, inWallet: true,
        number: "DEMO-LIB-118 204", expiry: iso(905), issued: iso(-900),
        fields: [["Tier", "Standard"], ["Branch", "Fictional Central"]], photo: false },
      { id: "c5", kind: "Demo membership", title: "Coastal Swim Club", style: "ink", fav: false, inWallet: true,
        number: "DEMO-SWM-55 019", expiry: iso(210), issued: iso(-155),
        fields: [["Tier", "Adult"], ["Lanes", "Unlimited (fictional)"]], photo: false },
      { id: "c6", kind: "Demo vessel licence", title: "Boat Licence", style: "ocean", fav: false, inWallet: false,
        number: "DEMO-BL-6021 7745", expiry: iso(1004), issued: iso(-91),
        fields: [["Type", "General · Demo"], ["Status", "Demo — not valid"]], photo: true },
      { id: "c7", kind: "Demo membership", title: "Eastside Climbing Gym", style: "plum", fav: false, inWallet: false,
        number: "DEMO-GYM-30 118", expiry: iso(330), issued: iso(-35),
        fields: [["Tier", "Casual"], ["Visits", "10-pass (fictional)"]], photo: false },
    ],
    vehicles: [
      { id: "v1", plate: "DEM 01A", make: "Toyota", model: "Corolla Hatch", year: 2021, colour: "Silver", body: "Hatchback", expiry: iso(19), ctp: "Demo Insurer A" },
      { id: "v2", plate: "XMP 42", make: "Mazda", model: "CX-5", year: 2019, colour: "Soul Red", body: "SUV", expiry: iso(204), ctp: "Demo Insurer B" },
      { id: "v3", plate: "TST 99Z", make: "Honda", model: "CB500X", year: 2017, colour: "Black", body: "Motorcycle", expiry: iso(-6), ctp: "Demo Insurer A" },
    ],
    fines: [
      { id: "f1", ref: "DEMO-PN-30418", offence: "Exceed speed limit by 10 km/h or less", place: "Example Road, Sampleton", date: iso(-12), due: iso(16), amount: 145, points: 1, status: "unpaid", plate: "DEM 01A" },
      { id: "f2", ref: "DEMO-PN-29871", offence: "Stop in a no stopping zone", place: "Fiction Lane, Demoville", date: iso(-44), due: iso(-2), amount: 228, points: 0, status: "overdue", plate: "XMP 42" },
      { id: "f3", ref: "DEMO-PN-27002", offence: "Use mobile phone while driving", place: "Placeholder Highway", date: iso(-210), due: iso(-182), amount: 410, points: 5, status: "paid", plate: "DEM 01A" },
      { id: "f4", ref: "DEMO-PN-25540", offence: "Parking meter expired", place: "Sample Street, Testbury", date: iso(-330), due: iso(-302), amount: 98, points: 0, status: "paid", plate: "XMP 42" },
    ],
    demerits: { limit: 13 },
    feedback: [],
    notifications: [
      { id: "n1", type: "registration", title: "Registration due soon", body: "DEM 01A expires in 19 days. Renew now to avoid a late fee (simulated).", at: ago(42), read: false, link: { screen: "vehicle", id: "v1" } },
      { id: "n2", type: "fines", title: "Penalty notice overdue", body: "DEMO-PN-29871 is past its due date. This is fictional demo data.", at: ago(60 * 5), read: false, link: { screen: "fine", id: "f2" } },
      { id: "n3", type: "expiry", title: "Fishing licence expiring", body: "Your demo recreational licence expires in 48 days.", at: ago(60 * 26), read: false, link: { screen: "cred", id: "c3" } },
      { id: "n4", type: "announcements", title: "New: Services directory", body: "Browse every demo service by topic from the new Services tab.", at: ago(60 * 24 * 4), read: true },
      { id: "n5", type: "registration", title: "Registration expired", body: "TST 99Z expired 6 days ago. Driving an unregistered vehicle is an offence.", at: ago(60 * 24 * 6), read: true, link: { screen: "vehicle", id: "v3" } },
      { id: "n6", type: "announcements", title: "Welcome to Harbour", body: "Everything in this app is fictional demonstration data.", at: ago(60 * 24 * 30), read: true },
    ],
  });

  /* Services directory — original copy. "go" targets open real prototype screens;
     everything else is a placeholder that explains it's not part of the demo. */
  window.HARBOUR_CATEGORIES = [
    { id: "all", title: "Browse everything", blurb: "Every demo service in one A–Z list.", hue: 188, icon: "grid",
      items: [] },
    { id: "driving", title: "Cars, bikes and boats", blurb: "Registration, fines, demerits and the demo licences in your wallet.", hue: 200, icon: "car",
      items: [["Check or renew registration", "vehicles"], ["Pay a penalty notice", "fines"], ["See demerit points", "fines"], ["Add a vehicle", "addVehicle"], ["Your demo boat licence", "cred:c6"]] },
    { id: "savings", title: "Save on the everyday", blurb: "Find the discounts and rebates you might be missing, in one checklist.", hue: 32, icon: "piggy",
      items: [["Savings checklist", null], ["Energy bill rebates", null], ["Transport cost relief", null]] },
    { id: "work", title: "Work and trades", blurb: "Licences, tickets and checks for the job you do.", hue: 220, icon: "briefcase",
      items: [["Trade licence lookup", null], ["Workplace safety tickets", null], ["Background checks", null]] },
    { id: "learning", title: "Learning and childcare", blurb: "From first playgroup to finishing an apprenticeship.", hue: 280, icon: "book",
      items: [["Childcare finder", null], ["School enrolment", null], ["Apprenticeship support", null]] },
    { id: "home", title: "Renting and owning", blurb: "Bonds, building, buying and help finding a place to stay.", hue: 150, icon: "house",
      items: [["Rental bond", null], ["Building approvals", null], ["Housing support", null]] },
    { id: "outdoors", title: "Outdoors and on the water", blurb: "Fishing and boating licences, park passes and campsites.", hue: 170, icon: "fish",
      items: [["Your demo fishing licence", "cred:c3"], ["Your demo boat licence", "cred:c6"], ["Park passes", null], ["Book a campsite", null]] },
    { id: "health", title: "Health and wellbeing", blurb: "Where to start when you or someone you care for needs support.", hue: 345, icon: "heart",
      items: [["Find a clinic", null], ["Mental health support", null], ["Carer resources", null]] },
    { id: "business", title: "Running a business", blurb: "Start, grow and stay compliant, with help along the way.", hue: 245, icon: "store",
      items: [["Register a business name", null], ["Business grants", null], ["Supplier registration", null]] },
    { id: "emergency", title: "Emergencies and recovery", blurb: "Get ready for storms, fires and floods, and find help afterwards.", hue: 12, icon: "alert",
      items: [["Make an emergency plan", null], ["Recovery grants", null], ["Replace lost documents", null]] },
    { id: "life", title: "Life events", blurb: "New babies, new names, marriages and saying goodbye.", hue: 300, icon: "sparkle",
      items: [["Register a birth", null], ["Change your name", null], ["Certificates", null]] },
    { id: "community", title: "Community and safety", blurb: "Find a JP, sign a statutory declaration, or register a defibrillator.", hue: 130, icon: "shield",
      items: [["Find a JP", null], ["Statutory declarations", null], ["Register a defibrillator", null]] },
  ];

  window.HARBOUR_FEATURED = [
    { id: "ft1", title: "Rego due? Renew in a tap", hue: 200, icon: "car", go: "vehicle:v1" },
    { id: "ft2", title: "Star cards for your home screen", hue: 170, icon: "star", go: "tab:wallet" },
    { id: "ft3", title: "Set reminders your way", hue: 32, icon: "bell", go: "sheet:notifPrefs" },
    { id: "ft4", title: "Tell us how we're doing", hue: 280, icon: "message", go: "help" },
  ];
})();
