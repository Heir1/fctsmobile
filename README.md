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


## Segond part


In my **React Native + Tailwind (NativeWind)** project, I want you to build a professional header, sidebar, and CRUD flow for managing "children". Please follow these detailed steps:

---

### 1. Header with Breadcrumb
- Add a breadcrumb icon (menu icon ☰) at the far left of the header.
- When pressed, it should open a sidebar sliding in **from the left**.
- Sidebar should cover **75% of the screen width** with a smooth `ease-in-out` transition.
- The rest of the screen (25%) should have a **dark semi-transparent overlay**. Clicking/tapping on it closes the sidebar.

---

### 2. Sidebar Component
- At the top of the sidebar, display the **app logo in /assets/images/logo.png **.
- Add navigation links:
  - `Home` → navigates to the **Dashboard** screen.
  - `Children` → navigates to a new **Children CRUD** screen.
- Style: modern Tailwind UI with `rounded-2xl`, `shadow-md`, padding, and hover/active effects.

---


### 3. Children CRUD Screen

I want the Children page implemented in **four steps** (one for each CRUD operation), with the proper **Supabase Edge Function endpoints**:

#### 3.1. **Read (GET all + GET by ID)**
- Display a **list of all children** in a scrollable view.
- Use endpoint:  
  - `GET all`: https://gbcvxntommivvndxqemz.supabase.co/functions/v1/children with response : 
   {
    "success": true,
    "data": {
        "children": [
            {
                "id": "7a875e9e-5eaa-4089-a11f-58b417aa9027",
                "orphanage_id": "a1210e88-384f-406e-8531-17c68498eec8",
                "full_name": "David Tshibola",
                "gender": "M",
                "birth_date": "2014-03-09",
                "estimated_age": 11,
                "entry_date": "2025-08-09",
                "photo_url": null,
                "parent_status": "partial_orphan",
                "internal_code": "CH-2025-002",
                "dhis2_tracked_entity_id": null,
                "created_at": "2025-08-09T14:04:45.543739+00:00",
                "updated_at": "2025-08-09T14:06:28.088482+00:00",
                "orphanage": {
                    "name": "Maison Lumière"
                }
            },
            {
                "id": "01451a68-437d-4e7b-affd-3e7ce8e8856d",
                "orphanage_id": "a1210e88-384f-406e-8531-17c68498eec8",
                "full_name": "Grace Mbayo",
                "gender": "F",
                "birth_date": "2017-06-15",
                "estimated_age": 8,
                "entry_date": "2025-07-12",
                "photo_url": null,
                "parent_status": "partial_orphan",
                "internal_code": "CH-2025-001",
                "dhis2_tracked_entity_id": null,
                "created_at": "2025-07-12T17:44:48.215967+00:00",
                "updated_at": "2025-08-08T15:17:32.61318+00:00",
                "orphanage": {
                    "name": "Maison Lumière"
                }
            }
        ],
        "metrics": {
            "total_count": 2,
            "current_page": 1,
            "total_pages": 1,
            "has_next_page": false,
            "has_prev_page": false,
            "page_size": 10
        },
        "filters": {
            "search": null,
            "gender": null,
            "parent_status": null
        }
    }
   }  
  - `GET by id`: https://gbcvxntommivvndxqemz.supabase.co/functions/v1/child/{id}  with response :
{
    "id": "01451a68-437d-4e7b-affd-3e7ce8e8856d",
    "orphanage_id": "a1210e88-384f-406e-8531-17c68498eec8",
    "full_name": "Grace Mbayo",
    "gender": "F",
    "birth_date": "2017-06-15",
    "estimated_age": 8,
    "entry_date": "2025-07-12",
    "photo_url": null,
    "parent_status": "partial_orphan",
    "internal_code": "CH-2025-001",
    "dhis2_tracked_entity_id": null,
    "created_at": "2025-07-12T17:44:48.215967+00:00",
    "updated_at": "2025-08-08T15:17:32.61318+00:00",
    "nutrition_records": [
        {
            "id": "f6ea1944-4c3c-4321-a85c-8a2c30367c8e",
            "bmi": 9.5,
            "date": "2025-07-12",
            "synced": false,
            "child_id": "01451a68-437d-4e7b-affd-3e7ce8e8856d",
            "height_cm": 110,
            "weight_kg": 11.5,
            "created_at": "2025-07-12T17:48:57.061794+00:00",
            "updated_at": "2025-08-25T18:42:01.454939+00:00",
            "dhis2_event_id": null,
            "nutrition_status": "malnourished"
        }
    ],
    "health_records": [
        {
            "id": "2ad54764-3f7e-4253-98d2-c15ceaad57aa",
            "date": "2025-07-12",
            "synced": false,
            "remarks": "Suivi nutritionnel conseillé",
            "child_id": "01451a68-437d-4e7b-affd-3e7ce8e8856d",
            "created_at": "2025-07-12T17:47:07.018148+00:00",
            "updated_at": "2025-07-12T17:47:07.018148+00:00",
            "medications": "Complément nutritionnel, crème dermatologique",
            "dhis2_event_id": null,
            "chronic_conditions": "Aucune",
            "vaccination_status": "DTC-HepB-Hib reçu à 2 mois, Rougeole manquante",
            "vaccination_status_structured": {
                "status": "partially_vaccinated",
                "vaccines": [],
                "last_updated": "2025-07-12T17:45:50.699Z"
            }
        }
    ],
    "child_diseases": [
        {
            "notes": null,
            "diseases": {
                "name": "Malnutrition"
            },
            "severity": "severe",
            "diagnosed_date": "2025-07-12"
        },
        {
            "notes": null,
            "diseases": {
                "name": "Dermatite"
            },
            "severity": "moderate",
            "diagnosed_date": "2025-07-12"
        }
    ]
}

- Show children in a styled `FlatList` with name, age, and actions (`Edit`, `Delete`).

#### 3.2. **Create (POST)**
- Add a **floating action button** (`+`) at bottom-right.
- When tapped, open a **modal form** (name, age, etc.).
- On submit, call endpoint:  
  - `POST create`: https://gbcvxntommivvndxqemz.supabase.co/functions/v1/children-create 
  body json : {
   "full_name": "Jeanne Dupont",
   "gender": "F",
   "birth_date": "2018-05-15",
   "estimated_age": 6,
   "entry_date": "2024-01-15",
   "parent_status": "abandoned",
   "internal_code": "JD-2024-003" // optional
}

response json : 
{
    "success": true,
    "message": "Enfant ajouté avec succès",
    "data": {
        "id": "b2e48fc5-3847-4f27-b448-067ff4c09254",
        "orphanage_id": "a1210e88-384f-406e-8531-17c68498eec8",
        "full_name": "Jeanne Dupont",
        "gender": "F",
        "birth_date": "2018-05-15",
        "estimated_age": 6,
        "entry_date": "2024-01-15",
        "photo_url": null,
        "parent_status": "abandoned",
        "internal_code": "JD-2024-003",
        "dhis2_tracked_entity_id": null,
        "created_at": "2025-09-02T14:24:31.926372+00:00",
        "updated_at": "2025-09-02T14:24:31.926372+00:00"
    }
}

- After success, close modal and refresh list.

#### 3.3. **Update (PUT)**
- Each child item should have an `Edit` button.
- When tapped, open a pre-filled modal with child info.
- On save, call endpoint:  
  - `PUT update`: https://gbcvxntommivvndxqemz.supabase.co/functions/v1/update-child/{id}  
- Show success/failure toasts and refresh list.

  body json : {
   "full_name": "Jeanne Dupont",
   "gender": "F",
   "birth_date": "2018-05-15",
   "estimated_age": 6,
   "entry_date": "2024-01-15",
   "parent_status": "abandoned",
   "internal_code": "JD-2024-003" // optional
}

response json : 
{
    "success": true,
    "message": "Enfant ajouté avec succès",
    "data": {
        "id": "b2e48fc5-3847-4f27-b448-067ff4c09254",
        "orphanage_id": "a1210e88-384f-406e-8531-17c68498eec8",
        "full_name": "Jeanne Dupont",
        "gender": "F",
        "birth_date": "2018-05-15",
        "estimated_age": 6,
        "entry_date": "2024-01-15",
        "photo_url": null,
        "parent_status": "abandoned",
        "internal_code": "JD-2024-003",
        "dhis2_tracked_entity_id": null,
        "created_at": "2025-09-02T14:24:31.926372+00:00",
        "updated_at": "2025-09-02T14:24:31.926372+00:00"
    }
}

#### 3.4. **Delete (DELETE)**
- Each child item should also have a `Delete` button.
- When tapped, show a confirmation dialog (`Are you sure you want to delete this child?`).
- If confirmed, call endpoint:  
  - `DELETE`: https://gbcvxntommivvndxqemz.supabase.co/functions/v1/delete-child/{id}  
- Refresh list after deletion.

---