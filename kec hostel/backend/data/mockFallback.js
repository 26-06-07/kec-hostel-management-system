// In-memory fallback dataset mirroring the college database schema
// Used seamlessly when the MySQL database is pending setup by the teammate

const fallbackData = {
  users: [
    {
      id: 1,
      name: "Swaathi",
      username: "swaathi",
      roll_no: "22ITR088",
      email: "swaathi.22itr@kongu.edu",
      role: "student",
      hostel: "Amaravathi Hostel",
      room_no: "204",
      department: "Information Technology",
      year_of_study: "III Year",
      phone: "+91 94433 11223",
      parent_phone: "+91 94433 99887",
      password_hash: "$2a$10$wN1Q/X3mRsmH091v7BZZye7Fqj02yM35WqY8C7cWz0n2Z4rO6y6S." // student123
    },
    {
      id: 2,
      name: "M. Selvam",
      username: "caretaker.amaravathi",
      roll_no: null,
      email: "caretaker.amaravathi@kongu.edu",
      role: "caretaker",
      hostel: "Amaravathi Hostel",
      room_no: null,
      department: "Hostel Administration",
      year_of_study: null,
      phone: "+91 98421 33445",
      parent_phone: null,
      password_hash: "$2a$10$wN1Q/X3mRsmH091v7BZZye7Fqj02yM35WqY8C7cWz0n2Z4rO6y6S." // caretaker123
    },
    {
      id: 3,
      name: "Dr. K. Senthil",
      username: "warden",
      roll_no: null,
      email: "warden@kongu.edu",
      role: "warden",
      hostel: "All Hostels",
      room_no: null,
      department: "Chief Warden Office",
      year_of_study: null,
      phone: "+91 98421 22222",
      parent_phone: null,
      password_hash: "$2a$10$wN1Q/X3mRsmH091v7BZZye7Fqj02yM35WqY8C7cWz0n2Z4rO6y6S." // warden123
    },
    {
      id: 4,
      name: "Hostel Chief Administrator",
      username: "admin.hostel",
      roll_no: null,
      email: "admin.hostel@kongu.edu",
      role: "admin",
      hostel: "Campus Administration",
      room_no: null,
      department: "Office of the Principal",
      year_of_study: null,
      phone: "+91 4294 226555",
      parent_phone: null,
      password_hash: "$2a$10$wN1Q/X3mRsmH091v7BZZye7Fqj02yM35WqY8C7cWz0n2Z4rO6y6S." // admin123
    }
  ],

  hostels: [
    {
      id: "amaravathi",
      name: "Amaravathi Hostel",
      tagline: "Eco-friendly, modern amenities with disciplined study halls and hygienic dining.",
      capacity: 450,
      occupied: 420,
      floors: 4,
      caretaker_name: "M. Selvam",
      caretaker_contact: "+91 98421 33445",
      facilities: [
        "24x7 Purified RO Drinking Water",
        "Wi-Fi Enabled Study Halls",
        "Steam-Powered Hygienic Dining Hall",
        "Solar Water Heaters",
        "Indoor Badminton & Table Tennis"
      ],
      image: "assets/hostel-amaravathi.png"
    },
    {
      id: "bhavani",
      name: "Bhavani Hostel",
      tagline: "Spacious multi-sharing rooms surrounded by green flora and round-the-clock security.",
      capacity: 500,
      occupied: 468,
      floors: 4,
      caretaker_name: "P. Murugesan",
      caretaker_contact: "+91 98421 44556",
      facilities: [
        "High-Speed Campus LAN & Wi-Fi",
        "Modern Gymnasium & Fitness Corner",
        "Continuous CCTV Surveillance",
        "Round-the-Clock Ambulance Support",
        "Spacious Reading Room"
      ],
      image: "assets/hostel-bhavani.png"
    },
    {
      id: "kaveri",
      name: "Kaveri Hostel",
      tagline: "Peaceful environment optimized for academic excellence and collaborative learning.",
      capacity: 420,
      occupied: 395,
      floors: 3,
      caretaker_name: "S. Dharmaraj",
      caretaker_contact: "+91 98421 55667",
      facilities: [
        "Quiet Library Annex with e-Journals",
        "Automated Laundry Stations",
        "Doctor-on-Call & Health Post",
        "Uninterrupted Power Backup (100 kVA DG)",
        "Spacious Dining Complex"
      ],
      image: "assets/hostel-kaveri.png"
    }
  ],

  leaves: [
    {
      id: "LV-2026-081",
      student_id: 1,
      student_name: "Swaathi",
      roll_no: "22ITR088",
      hostel: "Amaravathi Hostel",
      room_no: "204",
      type: "Home Leave",
      from_date: "2026-10-14",
      to_date: "2026-10-18",
      purpose: "Attending elder brother's wedding ceremony at Coimbatore",
      parent_contact: "+91 94433 99887",
      status: "Approved",
      applied_at: "2026-10-10 11:20 AM",
      approved_by: "Dr. K. Senthil",
      remarks: "Permission granted. Ensure return to hostel before 6:30 PM on Sunday."
    },
    {
      id: "LV-2026-082",
      student_id: 1,
      student_name: "Swaathi",
      roll_no: "22ITR088",
      hostel: "Amaravathi Hostel",
      room_no: "204",
      type: "Weekend Outing",
      from_date: "2026-10-11",
      to_date: "2026-10-11",
      purpose: "Purchasing semester textbooks and stationery at Erode town market",
      parent_contact: "+91 94433 99887",
      status: "Pending",
      applied_at: "2026-10-11 08:30 AM",
      approved_by: null,
      remarks: null
    }
  ],

  complaints: [
    {
      id: "CMP-2026-101",
      student_id: 1,
      student_name: "Swaathi",
      roll_no: "22ITR088",
      hostel: "Amaravathi Hostel",
      room_no: "204",
      category: "Electrical",
      title: "Reading table LED light fixture replacement",
      description: "The LED tube light above desk 2 flickers intermittently and requires driver inspection.",
      status: "In Progress",
      assigned_to: "R. Kannan (Electrician)",
      created_at: "2026-10-09 04:15 PM"
    },
    {
      id: "CMP-2026-102",
      student_id: 1,
      student_name: "Swaathi",
      roll_no: "22ITR088",
      hostel: "Amaravathi Hostel",
      room_no: "204",
      category: "Wi-Fi / Internet",
      title: "Wi-Fi access point weak signal in Wing B",
      description: "Signal drops frequently during peak study hours between 8 PM and 10 PM.",
      status: "Pending",
      assigned_to: "Campus Network Team",
      created_at: "2026-10-11 09:10 AM"
    }
  ],

  notices: [
    {
      id: 1,
      title: "Weekend Outing Cutoff Time Notification",
      category: "General",
      published_by: "Dr. K. Senthil (Chief Warden)",
      date: "2026-10-10",
      content: "All resident students are hereby informed that Weekend Outing requests must be formally submitted through the portal before Friday 5:00 PM for warden approval. Entry gate closes at 7:00 PM strictly."
    },
    {
      id: 2,
      title: "Special Festive Dinner at Mess Dining Halls",
      category: "Mess Dining",
      published_by: "Mess Committee",
      date: "2026-10-08",
      content: "A special traditional feast will be served on Saturday evening across all three hostels (Amaravathi, Bhavani, Kaveri). Dinner service hours extended until 9:30 PM."
    },
    {
      id: 3,
      title: "Annual Preventative Electrical & RO Plant Maintenance",
      category: "Maintenance",
      published_by: "Campus Maintenance Cell",
      date: "2026-10-05",
      content: "Routine RO water filter overhaul will be conducted between 10:00 AM and 1:00 PM on Tuesday. Adequate clean water storage has been pre-arranged in each wing."
    }
  ],

  rooms: [
    { room_no: "201", hostel: "Amaravathi Hostel", floor: 2, capacity: 4, occupied: 4, status: "Full" },
    { room_no: "202", hostel: "Amaravathi Hostel", floor: 2, capacity: 4, occupied: 3, status: "Available (1 Bed)" },
    { room_no: "203", hostel: "Amaravathi Hostel", floor: 2, capacity: 4, occupied: 4, status: "Full" },
    { room_no: "204", hostel: "Amaravathi Hostel", floor: 2, capacity: 4, occupied: 4, status: "Full" },
    { room_no: "205", hostel: "Amaravathi Hostel", floor: 2, capacity: 4, occupied: 2, status: "Available (2 Beds)" }
  ],

  messMenu: {
    monday: {
      breakfast: "Idli, Medu Vada, Sambar, Coconut Chutney, Tea/Coffee",
      lunch: "Steamed Rice, Drumstick Sambar, Cabbage Poriyal, Rasam, Curd",
      snacks: "Sundal, Tea/Coffee",
      dinner: "Chapati, Vegetable Kurma, Variety Rice, Milk"
    },
    tuesday: {
      breakfast: "Poori, Potato Masala, Tomato Chutney, Tea/Coffee",
      lunch: "Steamed Rice, Tomato Rasam, Potato Fry, Mor Kuzhambu, Appalam",
      snacks: "Samosa / Bajji, Tea/Coffee",
      dinner: "Dosa, Sambar, Coriander Chutney, Lemon Rice"
    },
    wednesday: {
      breakfast: "Pongal, Medu Vada, Gothsu, Tea/Coffee",
      lunch: "Steamed Rice, Mysore Rasam, Cauliflower Curry, Veg Poriyal, Curd",
      snacks: "Sweet Corn / Veg Cutlet, Tea/Coffee",
      dinner: "Veg Pulao, Raita, Idiyappam with Coconut Milk"
    },
    thursday: {
      breakfast: "Rava Upma, Coconut Chutney, Banana, Tea/Coffee",
      lunch: "Steamed Rice, Poondu Rasam, Beans Usili, Kara Kuzhambu, Curd",
      snacks: "Pani Puri / Masala Vada, Tea",
      dinner: "Parotta, Salna, Jeera Rice, Dal Fry"
    },
    friday: {
      breakfast: "Kitchadi, Coconut Chutney, Medu Vada, Tea/Coffee",
      lunch: "Steamed Rice, Mango Dal, Beetroot Poriyal, Jeera Rasam, Payasam",
      snacks: "Veg Puff / Biscuit, Tea",
      dinner: "Chapati, Mixed Veg Subzi, Curd Rice with Pickle"
    },
    saturday: {
      breakfast: "Uthappam, Mint Chutney, Sambar, Tea/Coffee",
      lunch: "Special South Indian Meals: Sweet, Aviyal, Vatha Kuzhambu, Rasam, Curd",
      snacks: "Onion Pakoda, Masala Chai",
      dinner: "Fried Rice, Gobi Manchurian, Fresh Seasonal Fruit"
    },
    sunday: {
      breakfast: "Rava Dosa, Onion Chutney, Sambar, Tea/Coffee",
      lunch: "Special Biryani, Onion Raita, Dalcha, Paneer Butter Masala, Ice Cream",
      snacks: "Cake / Biscuits, Coffee",
      dinner: "Idli, Dosai, Hotel Sambar, Chutney, Warm Milk"
    }
  }
};

module.exports = fallbackData;
