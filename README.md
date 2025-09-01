## first part


## Cursor Prompt – React Native Expo Orphanage App (Login, Logout, Dashboard)

**Project context**: React Native Expo app (already initialized)
**Design requirements**: Professional, modern, attractive, mobile-first. Use **NativeWind / TailwindCSS**, **React Navigation**, **charts for statistics**, clean cards, and responsive layout. Follow a healthcare/charity visual style.

**Instructions for Cursor**:

---

### **Step 1 – Login Screen**

**Goal**: Implement the login functionality only. Registration is **just a placeholder tab/button**, no implementation yet.

**API Endpoint**:

```
POST https://gbcvxntommivvndxqemz.supabase.co/functions/v1/login
Body JSON:
{
  "email": "lumiere@centre.cd",
  "password": ".wus6d66x75p"
}
```

**Expected Response**:

* Contains `access_token`, `refresh_token`, user info.
* On success → navigate to Dashboard.

**Requirements**:

* Input fields: Email, Password
* Login Button → call API, handle loading & errors
* Placeholder "Register" tab/button (no functionality yet)
* Store token securely (SecureStore / AsyncStorage)
* Design: professional, modern, clean, visually attractive.

**Important**: After this step, **ask for validation** before proceeding.

---

### **Step 2 – Logout**

**Goal**: Implement logout functionality.

**Requirements**:

* Logout button in the dashboard
* Clear stored tokens and user info
* Navigate back to login screen
* Show confirmation or toast message
* UX: smooth, intuitive

**Important**: Wait for validation before moving to the next step.

---

### **Step 3 – Dashboard / Orphanage Statistics**

**Goal**: Display orphanage statistics from API after successful login.

**API Endpoint**:

```
GET https://gbcvxntommivvndxqemz.supabase.co/functions/v1/orphanage-stats
```

**Expected Data to Display**:

here is the json format response : 

{
    "orphanage": {
        "id": "a1210e88-384f-406e-8531-17c68498eec8",
        "name": "Maison Lumière",
        "province": "Kasaï Oriental",
        "city": "Mbuji-Mayi",
        "province_id": "ce6ea4ea-ed7c-4e62-b7bb-600a0f7ef510",
        "city_id": "52535e71-4c18-432b-b66b-3d92e3543304",
        "address": "Rue Tshikapa 45, Quartier Diulu",
        "location_gps": null,
        "contact_person": "Jean-Claude Ilunga",
        "phone": "+243 997 654 321",
        "email": "lumiere@centre.cd",
        "description": "Prend en charge les enfants abandonnés ou en détresse sociale.",
        "legal_status": "verified",
        "documents": {
            "legal_document": {
                "url": "https://gbcvxntommivvndxqemz.supabase.co/storage/v1/object/public/orphanage-documents/temp/1752262418246-nehrh5ys7.jpg",
                "path": "temp/1752262418246-nehrh5ys7.jpg",
                "file_name": "help.jpg",
                "file_size": 129336,
                "file_type": "image",
                "uploaded_at": "2025-07-11T19:33:54.830Z"
            }
        },
        "photo_url": null,
        "dhis2_orgunit_id": null,
        "created_by": null,
        "created_at": "2025-07-11T19:33:55.087995+00:00",
        "updated_at": "2025-07-11T19:42:49.232643+00:00",
        "child_capacity": 110,
        "children_total": 110,
        "boys_count": 60,
        "girls_count": 50,
        "schooling_rate": null,
        "annual_disease_rate": null,
        "meals_per_day": null
    },
    "children": {
        "total": 2,
        "byGender": {
            "boys": 0,
            "girls": 0
        },
        "byAgeGroup": {
            "0-2": 0,
            "3-5": 0,
            "6-12": 2,
            "13-17": 0,
            "18+": 0
        },
        "newThisMonth": 0
    },
    "nutrition": {
        "malnutritionRate": 100,
        "byStatus": {
            "malnourished": 1
        },
        "averageBMI": 9.5
    },
    "health": {
        "vaccinationCoverage": 0,
        "commonDiseases": [
            {
                "name": "Malnutrition",
                "count": 1
            },
            {
                "name": "Dermatite",
                "count": 1
            }
        ],
        "chronicConditions": 1
    },
    "capacity": {
        "current": 2,
        "max": 110,
        "utilizationRate": 1.8181818181818181
    },
    "trends": {
        "monthlyGrowth": [
            {
                "month": "Apr 2025",
                "count": 0
            },
            {
                "month": "May 2025",
                "count": 0
            },
            {
                "month": "Jun 2025",
                "count": 0
            },
            {
                "month": "Jul 2025",
                "count": 1
            },
            {
                "month": "Aug 2025",
                "count": 1
            },
            {
                "month": "Sep 2025",
                "count": 0
            }
        ],
        "nutritionTrend": [
            {
                "month": "Jul",
                "rate": 100
            },
            {
                "month": "Aug",
                "rate": 0
            },
            {
                "month": "Sep",
                "rate": 0
            }
        ]
    }
}

1. **Orphanage info**:

   * Name, province, city, address, contact, description, legal status
   * Capacity: current, max, utilization rate

2. **Children stats**:

   * Total, by gender, by age group, new this month

3. **Nutrition stats**:

   * Malnutrition rate, number malnourished, average BMI

4. **Health stats**:

   * Vaccination coverage
   * Common diseases with count
   * Chronic conditions count

5. **Trends**:

   * Monthly growth (bar/line chart)
   * Nutrition trends (line chart)

**Design Requirements**:

* Use **cards, charts, and tables** for clarity
* Use **react-native-chart-kit** or similar for visual trends
* Loading states, error handling, pull-to-refresh
* Mobile-first, clean layout, professional and attractive visual style

**Important**: Display only relevant statistics, keep UX intuitive. Wait for validation after implementation.

---

### **Step by Step Flow**

1. Login screen → wait for validation
2. Logout → wait for validation
3. Dashboard statistics → wait for validation

**Additional Instructions**:

* Ask for confirmation after each step before generating the next
* Use modern professional design patterns
* Make the UI responsive for mobile
* Ensure smooth navigation with **React Navigation**

---