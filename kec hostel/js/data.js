/**
 * KEC HOSTELS - Hostel Management System
 * Initial Mock Data for Kongu Engineering College
 */

const DEFAULT_DATA = {
  hostels: [
    {
      id: "amaravathi",
      name: "Amaravathi Hostel",
      tagline: "Serene Living & Academic Excellence",
      image: "assets/hostel-amaravathi.png",
      description: "Amaravathi Hostel offers spacious rooms, lush green surroundings, and modern amenities designed to foster focused academic performance and collaborative campus living.",
      blocks: ["Block A", "Block B", "Block C"],
      floors: 4,
      totalRooms: 120,
      totalCapacity: 420,
      occupied: 388,
      availableBeds: 32,
      warden: "Dr. K. Senthil, M.E., Ph.D.",
      wardenPhone: "+91 98421 22222",
      caretaker: "M. Selvam",
      caretakerPhone: "+91 98421 11111",
      email: "amaravathi.hostel@kongu.edu",
      facilities: [
        "High-Speed Wi-Fi (1 Gbps)",
        "24x7 Solar Hot Water",
        "RO Purified Drinking Water",
        "Air-Conditioned Study Hall",
        "Indoor Gym & Fitness Zone",
        "Table Tennis & Badminton Court",
        "Power Backup with 250kVA Generator",
        "24x7 CCTV Surveillance & Security",
        "Hygienic Steam-Cooking Mess",
        "First Aid & Health Centre Tie-up"
      ],
      roomTypes: [
        { type: "4-Sharing Standard", count: 70, fee: "₹38,000 / year", features: "Individual wooden cot, study table with bookshelf, steel wardrobe, ceiling fan." },
        { type: "3-Sharing Deluxe", count: 35, fee: "₹44,000 / year", features: "Spacious layout, attached balcony, study desk, ergonomic chair, wardrobe." },
        { type: "2-Sharing Executive", count: 15, fee: "₹52,000 / year", features: "Attached washroom, premium furnishing, study lamps, individual cupboards." }
      ]
    },
    {
      id: "bhavani",
      name: "Bhavani Hostel",
      tagline: "Comfort, Community & Well-being",
      image: "assets/hostel-bhavani.png",
      description: "Bhavani Hostel provides a vibrant collegiate atmosphere with open quadrangle courtyards, modern dining halls, and dedicated recreation areas for round-the-clock comfort.",
      blocks: ["Block 1", "Block 2", "Block 3"],
      floors: 4,
      totalRooms: 110,
      totalCapacity: 380,
      occupied: 352,
      availableBeds: 28,
      warden: "Dr. P. Balasubramanian, M.Tech., Ph.D.",
      wardenPhone: "+91 98421 22223",
      caretaker: "S. Kumar",
      caretakerPhone: "+91 98421 11112",
      email: "bhavani.hostel@kongu.edu",
      facilities: [
        "Campus-wide High-Speed Wi-Fi",
        "Dedicated Reading & Digital Library",
        "RO Water Dispensers on every floor",
        "Solar Water Heating System",
        "Modern Recreation & TV Lounge",
        "Indoor Sports & Carrom/Chess Area",
        "Daily Housekeeping & Sanitization",
        "Biometric Attendance Entry",
        "Catering with North & South Indian Menu",
        "24/7 Security Patrol"
      ],
      roomTypes: [
        { type: "4-Sharing Standard", count: 65, fee: "₹38,000 / year", features: "Comfortable steel cots, dedicated study desks, storage cabinets, power points." },
        { type: "3-Sharing Deluxe", count: 30, fee: "₹44,000 / year", features: "Extra ventilation, study rack, individual locked cupboards, balcony access." },
        { type: "2-Sharing Executive", count: 15, fee: "₹52,000 / year", features: "Attached modern restroom, study cubicle, wooden finish wardrobes." }
      ]
    },
    {
      id: "kaveri",
      name: "Kaveri Hostel",
      tagline: "State-of-the-Art Student Residence",
      image: "assets/hostel-kaveri.png",
      description: "Kaveri Hostel is designed with contemporary architectural ergonomics, featuring scenic garden courtyards, quiet study nooks, and top-tier student living amenities.",
      blocks: ["North Wing", "South Wing"],
      floors: 4,
      totalRooms: 115,
      totalCapacity: 400,
      occupied: 366,
      availableBeds: 34,
      warden: "Dr. V. Kavitha, M.Sc., Ph.D.",
      wardenPhone: "+91 98421 22224",
      caretaker: "R. Murali",
      caretakerPhone: "+91 98421 11113",
      email: "kaveri.hostel@kongu.edu",
      facilities: [
        "Optical Fibre Wi-Fi Access Points",
        "Quiet Zone Reading & Seminar Hall",
        "Continuous Hot Water via Solar Grid",
        "UV + RO Multi-Stage Purified Water",
        "Fitness Gymnasium with Trainer",
        "Recreational Quadrangle & Badminton",
        "Automated Laundry Station (Optional)",
        "Round-the-clock Guard & CCTV",
        "Nutritious Balanced Diet Mess",
        "Resident Medical Assistant"
      ],
      roomTypes: [
        { type: "4-Sharing Standard", count: 70, fee: "₹38,000 / year", features: "Heavy-duty cots, partitioned study stations, book ledges, wardrobes." },
        { type: "3-Sharing Deluxe", count: 30, fee: "₹44,000 / year", features: "Large airy windows, personalized storage, spacious layout." },
        { type: "2-Sharing Executive", count: 15, fee: "₹52,000 / year", features: "Executive furnishings, attached bath, separate study corners." }
      ]
    }
  ],

  // Mess Timings & Weekly Menu
  mess: {
    timings: {
      breakfast: "07:00 AM - 08:30 AM",
      lunch: "12:15 PM - 01:45 PM",
      snacks: "04:30 PM - 05:30 PM",
      dinner: "07:30 PM - 09:00 PM"
    },
    weeklyMenu: {
      monday: {
        breakfast: "Idli, Medu Vadai, Coconut Chutney, Tomato Chutney, Piping Hot Sambar, Filter Coffee / Tea / Milk",
        lunch: "Steamed Ponni Rice, Murungakkai Sambar, Rasam, Cabbage Poriyal, Appalam, Curd, Pickle",
        snacks: "Sundal, Sweet Bun, Masala Tea, Coffee",
        dinner: "Soft Chapati, Vegetable Kurma, Ghee Rice, Dal Tadka, Fruit Salad"
      },
      tuesday: {
        breakfast: "Ven Pongal, Crispy Vadai, Gothsu, Coconut Chutney, Tea, Coffee",
        lunch: "Steamed Rice, Poondu Kuzhambu, Beetroot Poriyal, Jeera Rasam, Curd, Fryums",
        snacks: "Onion Pakoda, Ginger Tea, Milk",
        dinner: "Kal Dosa, Tomato Chutney, Sambar, Steamed Rice, Butter Milk"
      },
      wednesday: {
        breakfast: "Poori, Potato Masala, Rava Kichadi, Chutney, Tea, Coffee",
        lunch: "Vegetable Biryani / Chicken Gravy (Spl Token), Brinjal Pachadi, Onion Raitha, Steamed Rice, Rasam, Curd",
        snacks: "Parippu Vadai, Sweet Corn, Hot Tea, Coffee",
        dinner: "Wheat Idiyappam, Coconut Milk / Veg Kurma, Steamed Rice, Sambar, Banana"
      },
      thursday: {
        breakfast: "Rava Upma, Coconut Chutney, Idli, Sambar, Coffee, Tea",
        lunch: "Steamed Rice, Drumstick Keerai Sambar, Potato Varuval, Tomato Rasam, Mor Kuzhambu, Curd",
        snacks: "Mysore Bonda, Chutney, Masala Chai, Milk",
        dinner: "Phulka Roti, Paneer Butter Masala, Veg Pulao, Curd Rice, Seasonal Fruits"
      },
      friday: {
        breakfast: "Podi Dosa, Sambar, Coriander Chutney, Vadai, Filter Coffee, Tea",
        lunch: "South Indian Special Feast: Steamed Rice, Paruppu, Ghee, Avial, Appalam, Paruppu Payasam, Rasam, Curd",
        snacks: "Banana Fritters (Pazham Pori), Tea, Coffee",
        dinner: "Uthappam, Sambar, Kara Chutney, Rice, Pepper Rasam, Fresh Milk"
      },
      saturday: {
        breakfast: "Aloo Paratha with Curd & Pickle, Bread Toast, Butter, Jam, Boiled Egg (Opt), Tea, Coffee",
        lunch: "Steamed Rice, Vatha Kuzhambu, Beans Carrot Poriyal, Lemon Rasam, Curd, Crispy Appalam",
        snacks: "Vegetable Cutlet, Mint Chutney, Tea, Coffee",
        dinner: "Veg Fried Rice, Gobi Manchurian, Schezwan Sauce, Steamed Rice, Rasam, Ice Cream"
      },
      sunday: {
        breakfast: "Masala Dosa, Sambar, Onion Chutney, Coffee, Tea",
        lunch: "Special Sunday Biryani (Veg/Chicken Spl), Boiled Egg, Raita, Kathirikai Curry, Sweet, Ice Cream",
        snacks: "Puffs (Veg/Egg), Tea, Coffee",
        dinner: "Chapati, Mixed Veg Gravy, Jeera Pulao, Curd Rice, Pickle"
      }
    },
    announcements: [
      { id: "m1", title: "Special College Day Feast", date: "Oct 14, 2026", details: "A grand South Indian traditional feast will be served on Friday lunch with payasam and special delicacies." },
      { id: "m2", title: "Mess Timings Update for Exams", date: "Oct 10, 2026", details: "Dinner service is extended till 09:30 PM throughout the mid-semester examination week." },
      { id: "m3", title: "Student Mess Committee Meeting", date: "Oct 08, 2026", details: "Monthly hostel mess committee review will be held this Saturday at 5 PM in the Dining Boardroom." }
    ],
    feedbackList: [
      { id: "fb1", studentName: "Swaathi", rollNo: "22ITR088", hostel: "Amaravathi Hostel", meal: "Lunch", rating: 5, category: "Food Quality", comment: "The Wednesday Biryani and paneer gravy were exceptionally good and fresh.", date: "2026-10-10", status: "Reviewed" },
      { id: "fb2", studentName: "Praveen Raj", rollNo: "22CSR045", hostel: "Bhavani Hostel", meal: "Snacks", rating: 4, category: "Timeliness", comment: "Please ensure hot tea is served precisely by 4:30 PM on Block 2 counter.", date: "2026-10-09", status: "Addressed" },
      { id: "fb3", studentName: "Sneha M", rollNo: "23ECR102", hostel: "Kaveri Hostel", meal: "Dinner", rating: 4, category: "Cleanliness", comment: "Dining tables and hand wash area are well maintained.", date: "2026-10-08", status: "Reviewed" }
    ]
  },

  // Rooms Data for Room Availability feature
  rooms: [
    // Amaravathi Hostel Rooms
    { id: "r101", hostel: "Amaravathi Hostel", block: "Block A", roomNumber: "A-101", floor: 1, capacity: 4, occupied: 4, available: 0, status: "Full", residents: ["Karthik R (22ITR012)", "Dinesh S (22ITR015)", "Manoj K (22ITR018)", "Vignesh T (22ITR020)"] },
    { id: "r102", hostel: "Amaravathi Hostel", block: "Block A", roomNumber: "A-102", floor: 1, capacity: 4, occupied: 3, available: 1, status: "Partially Occupied", residents: ["Sanjay P (22CSR031)", "Gowtham M (22CSR032)", "Kishore B (22CSR033)"] },
    { id: "r103", hostel: "Amaravathi Hostel", block: "Block A", roomNumber: "A-103", floor: 1, capacity: 4, occupied: 2, available: 2, status: "Partially Occupied", residents: ["Arun V (22MER011)", "Ranjith S (22MER014)"] },
    { id: "r104", hostel: "Amaravathi Hostel", block: "Block A", roomNumber: "A-104", floor: 1, capacity: 3, occupied: 0, available: 3, status: "Available", residents: [] },
    { id: "r201", hostel: "Amaravathi Hostel", block: "Block B", roomNumber: "B-201", floor: 2, capacity: 3, occupied: 3, available: 0, status: "Full", residents: ["Prashanth L (22ECR051)", "Harish K (22ECR055)", "Ramesh C (22ECR058)"] },
    { id: "r204", hostel: "Amaravathi Hostel", block: "Block B", roomNumber: "B-204", floor: 2, capacity: 4, occupied: 3, available: 1, status: "Partially Occupied", residents: ["Swaathi (22ITR088)", "Kavin Raj (22ITR089)", "Deepak S (22ITR090)"] },
    { id: "r301", hostel: "Amaravathi Hostel", block: "Block C", roomNumber: "C-301", floor: 3, capacity: 2, occupied: 1, available: 1, status: "Partially Occupied", residents: ["Vijay Anand (21AIR004)"] },
    { id: "r305", hostel: "Amaravathi Hostel", block: "Block C", roomNumber: "C-305", floor: 3, capacity: 2, occupied: 0, available: 2, status: "Available", residents: [] },

    // Bhavani Hostel Rooms
    { id: "rb101", hostel: "Bhavani Hostel", block: "Block 1", roomNumber: "1-101", floor: 1, capacity: 4, occupied: 4, available: 0, status: "Full", residents: ["Praveen Raj (22CSR045)", "Sundar M (22CSR046)", "Jagan S (22CSR047)", "Ajith R (22CSR048)"] },
    { id: "rb102", hostel: "Bhavani Hostel", block: "Block 1", roomNumber: "1-102", floor: 1, capacity: 4, occupied: 2, available: 2, status: "Partially Occupied", residents: ["Logesh P (23EER021)", "Vasanth V (23EER022)"] },
    { id: "rb201", hostel: "Bhavani Hostel", block: "Block 2", roomNumber: "2-201", floor: 2, capacity: 3, occupied: 0, available: 3, status: "Available", residents: [] },
    { id: "rb202", hostel: "Bhavani Hostel", block: "Block 2", roomNumber: "2-202", floor: 2, capacity: 3, occupied: 2, available: 1, status: "Partially Occupied", residents: ["Dharun G (23ADR010)", "Nithin S (23ADR011)"] },
    { id: "rb301", hostel: "Bhavani Hostel", block: "Block 3", roomNumber: "3-301", floor: 3, capacity: 2, occupied: 1, available: 1, status: "Partially Occupied", residents: ["Siddharth R (21MTR003)"] },

    // Kaveri Hostel Rooms
    { id: "rk101", hostel: "Kaveri Hostel", block: "North Wing", roomNumber: "NW-101", floor: 1, capacity: 4, occupied: 4, available: 0, status: "Full", residents: ["Sneha M (23ECR102)", "Ananya S (23ECR103)", "Divya K (23ECR104)", "Pooja V (23ECR105)"] },
    { id: "rk102", hostel: "Kaveri Hostel", block: "North Wing", roomNumber: "NW-102", floor: 1, capacity: 4, occupied: 3, available: 1, status: "Partially Occupied", residents: ["Harini R (23ITR045)", "Pavithra M (23ITR046)", "Keerthana C (23ITR047)"] },
    { id: "rk201", hostel: "Kaveri Hostel", block: "South Wing", roomNumber: "SW-201", floor: 2, capacity: 3, occupied: 0, available: 3, status: "Available", residents: [] },
    { id: "rk202", hostel: "Kaveri Hostel", block: "South Wing", roomNumber: "SW-202", floor: 2, capacity: 3, occupied: 2, available: 1, status: "Partially Occupied", residents: ["Lavanya P (22CSR080)", "Monisha T (22CSR081)"] },
    { id: "rk301", hostel: "Kaveri Hostel", block: "South Wing", roomNumber: "SW-301", floor: 3, capacity: 2, occupied: 1, available: 1, status: "Partially Occupied", residents: ["Swetha N (21ADR012)"] }
  ],

  // Pre-configured Users (Student, Caretaker, Warden, Admin)
  users: [
    {
      id: "u_std_1",
      role: "student",
      name: "Swaathi",
      rollNo: "22ITR088",
      department: "Information Technology",
      hostel: "Amaravathi Hostel",
      roomNumber: "B-204",
      email: "swaathi.22it@kongu.edu",
      phone: "+91 98421 00001",
      password: "student123",
      year: "3rd Year",
      registeredAt: "2024-08-10"
    },
    {
      id: "u_std_2",
      role: "student",
      name: "Praveen Raj",
      rollNo: "22CSR045",
      department: "Computer Science and Engineering",
      hostel: "Bhavani Hostel",
      roomNumber: "1-101",
      email: "praveen.22cs@kongu.edu",
      phone: "+91 98421 00002",
      password: "student123",
      year: "3rd Year",
      registeredAt: "2024-08-11"
    },
    {
      id: "u_std_3",
      role: "student",
      name: "Sneha M",
      rollNo: "23ECR102",
      department: "Electronics & Communication Engg",
      hostel: "Kaveri Hostel",
      roomNumber: "NW-101",
      email: "sneha.23ec@kongu.edu",
      phone: "+91 98421 00003",
      password: "student123",
      year: "2nd Year",
      registeredAt: "2024-08-12"
    },
    {
      id: "u_care_1",
      role: "caretaker",
      name: "M. Selvam",
      phone: "+91 98421 11111",
      email: "caretaker.amaravathi@kongu.edu",
      hostel: "Amaravathi Hostel",
      password: "caretaker123",
      department: "Hostel Facilities & Maintenance",
      registeredAt: "2023-01-15"
    },
    {
      id: "u_care_2",
      role: "caretaker",
      name: "S. Kumar",
      phone: "+91 98421 11112",
      email: "caretaker.bhavani@kongu.edu",
      hostel: "Bhavani Hostel",
      password: "caretaker123",
      department: "Hostel Facilities & Maintenance",
      registeredAt: "2023-03-20"
    },
    {
      id: "u_warden_1",
      role: "warden",
      name: "Dr. K. Senthil",
      phone: "+91 98421 22222",
      email: "warden@kongu.edu",
      designation: "Chief Warden & Professor",
      hostel: "All Hostels",
      password: "warden123",
      department: "Department of Mechatronics",
      registeredAt: "2022-06-01"
    },
    {
      id: "u_admin_1",
      role: "admin",
      name: "Hostel Administrative Office",
      phone: "+91 98421 33333",
      email: "admin.hostel@kongu.edu",
      designation: "System Administrator",
      hostel: "Central Admin",
      password: "admin123",
      department: "KEC Hostel Directorate",
      registeredAt: "2022-01-01"
    }
  ],

  // Leave and Outing Requests
  leaves: [
    {
      id: "LV-2026-081",
      studentId: "u_std_1",
      studentName: "Swaathi",
      rollNo: "22ITR088",
      hostel: "Amaravathi Hostel",
      roomNumber: "B-204",
      type: "Home Leave",
      startDate: "2026-10-16",
      endDate: "2026-10-19",
      destination: "Coimbatore, Tamil Nadu",
      reason: "Attending cousin wedding and family gathering with parents permission",
      parentPhone: "+91 98421 99990",
      status: "Approved",
      appliedOn: "2026-10-10 11:20 AM",
      reviewedBy: "Dr. K. Senthil",
      wardenRemarks: "Approved. Make sure to return before 6:30 PM on Monday."
    },
    {
      id: "LV-2026-082",
      studentId: "u_std_1",
      studentName: "Swaathi",
      rollNo: "22ITR088",
      hostel: "Amaravathi Hostel",
      roomNumber: "B-204",
      type: "City Outing",
      startDate: "2026-10-12 04:30 PM",
      endDate: "2026-10-12 07:30 PM",
      destination: "Perundurai / Erode City",
      reason: "Purchasing project hardware components from electronics vendor",
      parentPhone: "+91 98421 99990",
      status: "Pending",
      appliedOn: "2026-10-11 02:15 PM",
      reviewedBy: null,
      wardenRemarks: null
    },
    {
      id: "LV-2026-079",
      studentId: "u_std_2",
      studentName: "Praveen Raj",
      rollNo: "22CSR045",
      hostel: "Bhavani Hostel",
      roomNumber: "1-101",
      type: "Home Leave",
      startDate: "2026-10-15",
      endDate: "2026-10-18",
      destination: "Salem",
      reason: "Health checkup and medical appointment",
      parentPhone: "+91 98421 88880",
      status: "Pending",
      appliedOn: "2026-10-11 09:30 AM",
      reviewedBy: null,
      wardenRemarks: null
    },
    {
      id: "LV-2026-075",
      studentId: "u_std_3",
      studentName: "Sneha M",
      rollNo: "23ECR102",
      hostel: "Kaveri Hostel",
      roomNumber: "NW-101",
      type: "Academic Outing",
      startDate: "2026-10-08",
      endDate: "2026-10-09",
      destination: "PSG Tech, Coimbatore",
      reason: "Presenting technical research paper at national symposium",
      parentPhone: "+91 98421 77770",
      status: "Approved",
      appliedOn: "2026-10-06 04:00 PM",
      reviewedBy: "Dr. K. Senthil",
      wardenRemarks: "Permission granted. Carry college ID."
    }
  ],

  // Complaints and Maintenance Requests (Managed by Caretaker)
  complaints: [
    {
      id: "CMP-401",
      studentName: "Swaathi",
      rollNo: "22ITR088",
      hostel: "Amaravathi Hostel",
      roomNumber: "B-204",
      category: "Electrical",
      title: "Ceiling fan regulator not working smoothly",
      description: "The fan runs only at maximum speed (step 5). Speed control knob needs replacement.",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "M. Selvam (Caretaker)",
      technician: "R. Prakash (Electrician)",
      filedOn: "2026-10-10 10:15 AM",
      notes: "Electrician dispatched. Spare parts indented."
    },
    {
      id: "CMP-402",
      studentName: "Karthik R",
      rollNo: "22ITR012",
      hostel: "Amaravathi Hostel",
      roomNumber: "A-101",
      category: "Plumbing",
      title: "Water tap leakage in washroom basin",
      description: "Washbasin tap has slow continuous dripping causing water wastage.",
      priority: "Low",
      status: "Pending",
      assignedTo: "M. Selvam (Caretaker)",
      technician: null,
      filedOn: "2026-10-11 08:30 AM",
      notes: "Awaiting plumber inspection."
    },
    {
      id: "CMP-403",
      studentName: "Praveen Raj",
      rollNo: "22CSR045",
      hostel: "Bhavani Hostel",
      roomNumber: "1-101",
      category: "Wi-Fi & Internet",
      title: "Wi-Fi access point frequent disconnects",
      description: "Corridor AP 2G signal drops frequently around 9 PM during online classes.",
      priority: "High",
      status: "In Progress",
      assignedTo: "S. Kumar (Caretaker)",
      technician: "Network Team",
      filedOn: "2026-10-09 09:00 PM",
      notes: "Network switch rebooted and channel configured. Monitoring bandwidth."
    },
    {
      id: "CMP-399",
      studentName: "Sneha M",
      rollNo: "23ECR102",
      hostel: "Kaveri Hostel",
      roomNumber: "NW-101",
      category: "Carpentry",
      title: "Cupboard door hinge loose",
      description: "Left door of student wardrobe requires screw tightening.",
      priority: "Low",
      status: "Completed",
      assignedTo: "R. Murali (Caretaker)",
      technician: "Carpenter Murugan",
      filedOn: "2026-10-07 03:00 PM",
      notes: "Hinge aligned and screws replaced. Verified with student."
    }
  ],

  // Announcements (General, Mess, Maintenance, Leave, Emergency)
  announcements: [
    {
      id: "ANN-101",
      title: "Diwali Vacation Leave Guidelines & Bus Bookings",
      category: "Leave Notice",
      hostel: "All Hostels",
      date: "Oct 11, 2026",
      author: "Chief Warden Office",
      priority: "Important",
      content: "All hostel students planning to travel for Diwali holidays must submit their leave requests before Oct 25, 2026, 05:00 PM through this portal. Special college transit buses to Erode Railway Station and Tiruppur will be arranged."
    },
    {
      id: "ANN-102",
      title: "Solar Water Heater Periodic Maintenance – Amaravathi Block B",
      category: "Maintenance",
      hostel: "Amaravathi Hostel",
      date: "Oct 10, 2026",
      author: "Caretaker Office",
      priority: "Normal",
      content: "Routine cleaning of solar heat collector panels will take place on Tuesday between 10:00 AM and 02:00 PM. Alternative hot water supply will be routed through the auxiliary boiler."
    },
    {
      id: "ANN-103",
      title: "Special Grand Dinner Feast on College Day",
      category: "Mess Update",
      hostel: "All Hostels",
      date: "Oct 09, 2026",
      author: "Mess Committee",
      priority: "Normal",
      content: "The annual festive dinner will feature a multi-course vegetarian feast, sweet dishes, and ice creams. Students are requested to bring their hostel ID cards for tokenless dining."
    },
    {
      id: "ANN-104",
      title: "General Hostel Cleanliness & Segregated Waste Management",
      category: "General",
      hostel: "All Hostels",
      date: "Oct 05, 2026",
      author: "Hostel Administration",
      priority: "Normal",
      content: "Color-coded waste bins (Blue for Dry, Green for Wet) are installed across all floor landings. Please support the Green Campus initiative by keeping corridors clear."
    },
    {
      id: "ANN-105",
      title: "Emergency 24x7 Campus Medical Helpline",
      category: "Emergency",
      hostel: "All Hostels",
      date: "Sep 28, 2026",
      author: "Health Centre & Administration",
      priority: "Urgent",
      content: "KEC Health Centre operates round the clock with resident medical officers and on-campus ambulance. In case of any health emergencies or first aid, contact Ext: 2200 or 98421 55555."
    }
  ]
};
