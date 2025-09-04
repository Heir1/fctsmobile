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
Body JSON example:
{
  "email": "test@centre.cd",
  "password": "test"
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

### 4. Health records CRUD Screen 

In our React Native + Tailwind (NativeWind) project, extend the sidebar navigation by adding a new link called **"Health"**.  

### Functional Goal
We want to implement full **CRUD operations** for children's health records. The app already has the "Get children" API integrated, so leverage that to first **select a child** and then manage their health records (create, view, delete). Each child can have multiple health records.

### Sidebar
- Add a new "Health" link in the sidebar.
- When selected, it should navigate to a screen where we can:
  1. Choose a child (list fetched from `GET /children`)
  2. Once a child is selected → display their health records.
  3. Allow adding, viewing details, and deleting health records.

### API Endpoints
- **Get children**  
  `GET https://gbcvxntommivvndxqemz.supabase.co/functions/v1/children` : 

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

- **Get health records of a child**  
  `GET https://gbcvxntommivvndxqemz.supabase.co/functions/v1/get-health-records/{child_id}` : 

  {
    "success": true,
    "data": {
        "health_records": [
            {
                "id": "ad378b7a-e9c7-4a9c-b58f-09a712d09dcf",
                "child_id": "7a875e9e-5eaa-4089-a11f-58b417aa9027",
                "date": "2025-09-03",
                "vaccination_status": "DTC-HepB-Hib reçu à 2 mois, Rougeole manquante",
                "chronic_conditions": "Test",
                "medications": "Test",
                "remarks": "Test",
                "dhis2_event_id": null,
                "synced": false,
                "created_at": "2025-09-03T11:23:01.460874+00:00",
                "updated_at": "2025-09-03T11:23:01.460874+00:00",
                "vaccination_status_structured": {
                    "status": "not_vaccinated",  
                    "vaccines": [],
                    "last_updated": "2025-09-03T11:22:06.084Z"
                },
                "diseases": [
                    {
                        "id": "8945a57d-6fc1-4015-a3f6-b3f25734d068",
                        "disease_id": "93820d2c-4ffb-41fe-afdf-6938138fbb77",
                        "diagnosed_date": "2025-09-03",
                        "severity": "moderate",
                        "notes": "Test",
                        "disease_name": "Rougeole",
                        "disease_description": "Maladie virale très contagieuse provoquant fièvre, éruption cutanée et toux."
                    },
                    {
                        "id": "9281622d-d7c8-4707-a9d0-c314ed94da29",
                        "disease_id": "f12dc361-6566-4186-8af3-e2733901f93c",
                        "diagnosed_date": "2025-09-03",
                        "severity": "moderate",
                        "notes": "Test",
                        "disease_name": "Diarrhée aiguë",
                        "disease_description": "Perte importante d’eau et de sels minéraux, souvent liée à l’eau ou à l’alimentation contaminée."
                    }
                ]
            },
            {
                "id": "53cb65cf-b843-4b5f-b5c3-3e6e0e74b309",
                "child_id": "7a875e9e-5eaa-4089-a11f-58b417aa9027",
                "date": "2024-01-15",
                "vaccination_status": "À jour",
                "chronic_conditions": "Asthme léger",
                "medications": "Ventoline au besoin",
                "remarks": "En bonne santé générale",
                "dhis2_event_id": null,
                "synced": false,
                "created_at": "2025-09-03T11:26:57.523407+00:00",
                "updated_at": "2025-09-03T11:26:57.523407+00:00",
                "vaccination_status_structured": {
                    "status": "partially_vaccinated",
                    "vaccines": [
                        "BCG",
                        "Polio",
                        "Rougeole"
                    ],
                    "last_updated": "2024-01-15"
                },
                "diseases": [
                    {
                        "id": "6e72279e-43ba-4402-82b8-9b669fe0db8a",
                        "disease_id": "00f6d9fb-bad0-4f18-9b07-55f360341461",
                        "diagnosed_date": "2024-01-15",
                        "severity": null,
                        "notes": "Traitement antibiotique complet",
                        "disease_name": "Anémie",
                        "disease_description": "Taux anormalement bas d’hémoglobine, souvent causé par une carence en fer."
                    }
                ]
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
        "child": {
            "id": "7a875e9e-5eaa-4089-a11f-58b417aa9027",
            "full_name": "David Tshibola"
        },
        "filters": {
            "start_date": null,
            "end_date": null
        }
    }
}

- **Create health record for a child**  
  `POST https://gbcvxntommivvndxqemz.supabase.co/functions/v1/create-health-record/{child_id}`  
  JSON body example:  

  ```
  {
  "date": "2024-01-15",
  "vaccination_status": "À jour",
  "vaccination_status_structured": {
    "status": "partially_vaccinated", // (status: z.enum(['vaccinated', 'partially_vaccinated', 'not_vaccinated', 'unknown']),)
    "vaccines": ["BCG", "Polio", "Rougeole"],
    "last_updated": "2024-01-15"
  },
  "chronic_conditions": "Asthme léger",
  "medications": "Ventoline au besoin",
  "remarks": "En bonne santé générale",
  "selectedDiseases": [
    {
      "disease_id": "00f6d9fb-bad0-4f18-9b07-55f360341461",
      "severity": "moderate",
      "notes": "Traitement antibiotique complet"
    }
  ] le endpoint à utiliser pour get les différentes maladies déjà seed dans la base des ( get : https://gbcvxntommivvndxqemz.supabase.co/functions/v1/diseases)
  quand on sélectionne une maladie une section "Détails des maladies sélectionnées" doit apparait pour faire la selection "Sévérité Léger Notes" 
}

response après création : "{
    "success": true,
    "message": "Dossier médical créé avec succès",
    "data": {
        "health_record": {
            "id": "53cb65cf-b843-4b5f-b5c3-3e6e0e74b309",
            "child_id": "7a875e9e-5eaa-4089-a11f-58b417aa9027",
            "date": "2024-01-15",
            "vaccination_status": "À jour",
            "chronic_conditions": "Asthme léger",
            "medications": "Ventoline au besoin",
            "remarks": "En bonne santé générale",
            "dhis2_event_id": null,
            "synced": false,
            "created_at": "2025-09-03T11:26:57.523407+00:00",
            "updated_at": "2025-09-03T11:26:57.523407+00:00",
            "vaccination_status_structured": {
                "status": "partially_vaccinated",
                "vaccines": [
                    "BCG",
                    "Polio",
                    "Rougeole"
                ],
                "last_updated": "2024-01-15"
            }
        },
        "diseases_count": 1,
        "child_name": "David Tshibola"
    }
}"

Exempla comme implémenté dans react : 
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-center">
          {/* <Stethoscope className="w-5 h-5" /> */}
          Nouveau dossier médical <br /> {childName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date">Date de consultation</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setValue('date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vaccination_status_select">Statut vaccinal</Label>
            <Select
              value={vaccinationStatusStructured.status}
              onValueChange={handleVaccinationStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le statut vaccinal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vaccinated">Vacciné</SelectItem>
                <SelectItem value="partially_vaccinated">Partiellement vacciné</SelectItem>
                <SelectItem value="not_vaccinated">Non vacciné</SelectItem>
                <SelectItem value="unknown">Inconnu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vaccination_status">Détails du statut vaccinal</Label>
            <Textarea
              id="vaccination_status"
              placeholder="Ex: BCG à jour, DTC-HepB-Hib reçu à 2 mois, Rougeole prévue à 9 mois, En attente du carnet vaccinal..."
              {...register('vaccination_status')}
              className="min-h-[80px]"
            />
          </div>

          <DiseaseSelector
            selectedDiseases={selectedDiseases}
            onDiseasesChange={setSelectedDiseases}
          />

          <div className="space-y-2">
            <Label htmlFor="chronic_conditions">Conditions chroniques</Label>
            <Textarea
              id="chronic_conditions"
              placeholder="Ex: Antécédents d'otites fréquentes, Allergie aux arachides, Asthme léger, Eczéma atopique, Aucune condition particulière..."
              {...register('chronic_conditions')}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">Médicaments</Label>
            <Textarea
              id="medications"
              placeholder="Ex: Amoxicilline 250mg 3x/jour pendant 7 jours, Paracétamol si fièvre >38.5°C, Sérum physiologique 2x/jour, Aucun médicament..."
              {...register('medications')}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarques médicales</Label>
            <Textarea
              id="remarks"
              placeholder="Ex: Éviter l'eau dans les oreilles, Surveiller la température, Contrôle dans 1 semaine, Bon état général, Référer si aggravation..."
              {...register('remarks')}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2"
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-1/2"
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <div className="space-y-4">
      <Label>Maladies diagnostiquées</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto border rounded-lg p-4">
        {diseases.map((disease) => {
          const isSelected = selectedDiseases.some(d => d.disease_id === disease.id);
          
          return (
            <div key={disease.id} className="flex items-center space-x-2">
              <Checkbox
                id={disease.id}
                checked={isSelected}
                onCheckedChange={(checked) => handleDiseaseToggle(disease.id, !!checked)}
              />
              <Label htmlFor={disease.id} className="text-sm cursor-pointer">
                {disease.name}
              </Label>
            </div>
          );
        })}
      </div>

      {selectedDiseases.length > 0 && (
        <div className="space-y-4">
          <Label>Détails des maladies sélectionnées</Label>
          {selectedDiseases.map((selectedDisease) => {
            const disease = diseases.find(d => d.id === selectedDisease.disease_id);
            
            return (
              <Card key={selectedDisease.disease_id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {getSeverityIcon(selectedDisease.severity)}
                    {disease?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`severity-${selectedDisease.disease_id}`}>Sévérité</Label>
                    <Select
                      value={selectedDisease.severity}
                      onValueChange={(value) => handleSeverityChange(selectedDisease.disease_id, value as 'mild' | 'moderate' | 'severe')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Léger</SelectItem>
                        <SelectItem value="moderate">Modéré</SelectItem>
                        <SelectItem value="severe">Sévère</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`notes-${selectedDisease.disease_id}`}>Notes</Label>
                    <Textarea
                      id={`notes-${selectedDisease.disease_id}`}
                      placeholder="Notes spécifiques à cette maladie..."
                      value={selectedDisease.notes}
                      onChange={(e) => handleNotesChange(selectedDisease.disease_id, e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>



  const onSubmit = async (data: HealthRecordFormData) => {
    // Ensure all required properties are present
    const submissionData = {
      date: data.date,
      vaccination_status: data.vaccination_status,
      vaccination_status_structured: {
        status: data.vaccination_status_structured.status,
        vaccines: data.vaccination_status_structured.vaccines,
        last_updated: data.vaccination_status_structured.last_updated,
      },
      chronic_conditions: data.chronic_conditions,
      medications: data.medications,
      remarks: data.remarks,
      selectedDiseases,
    };


````

* **Get health record details**
  `GET https://gbcvxntommivvndxqemz.supabase.co/functions/v1/get-health-record/{record_id}`

response json "{
    "success": true,
    "data": {
        "id": "53cb65cf-b843-4b5f-b5c3-3e6e0e74b309",
        "child_id": "7a875e9e-5eaa-4089-a11f-58b417aa9027",
        "date": "2024-01-15",
        "vaccination_status": "À jour",
        "chronic_conditions": "Asthme léger",
        "medications": "Ventoline au besoin",
        "remarks": "En bonne santé générale",
        "dhis2_event_id": null,
        "synced": false,
        "created_at": "2025-09-03T11:26:57.523407+00:00",
        "updated_at": "2025-09-03T11:26:57.523407+00:00",
        "vaccination_status_structured": {
            "status": "partially_vaccinated",
            "vaccines": [
                "BCG",
                "Polio",
                "Rougeole"
            ],
            "last_updated": "2024-01-15"
        },
        "child": {
            "id": "7a875e9e-5eaa-4089-a11f-58b417aa9027",
            "full_name": "David Tshibola",
            "orphanage_id": "a1210e88-384f-406e-8531-17c68498eec8"
        },
        "diseases": [
            {
                "id": "6e72279e-43ba-4402-82b8-9b669fe0db8a",
                "disease_id": "00f6d9fb-bad0-4f18-9b07-55f360341461",
                "diagnosed_date": "2024-01-15",
                "severity": null,
                "notes": "Traitement antibiotique complet",
                "disease_name": "Anémie",
                "disease_description": "Taux anormalement bas d’hémoglobine, souvent causé par une carence en fer."
            }
        ]
    }
}"

* **Update health record details**
  `PUT https://gbcvxntommivvndxqemz.supabase.co/functions/v1/update-health-record/{record_id}`

  json body : {
  "date": "2024-01-15",
  "vaccination_status": "Partiellement à jour",
  "vaccination_status_structured": {
    "status": "partially_vaccinated",
    "vaccines": ["Toutes les vaccinations obligatoires"],
    "last_updated": "2024-01-10"
  },
  "chronic_conditions": "Problèmes dermatologiques chroniques",
  "medications": "Crème corticoïde, antibiotiques",
  "remarks": "Nécessite un suivi dermatologique mensuel",
  "selectedDiseases": [
    {
      "disease_id": "00f6d9fb-bad0-4f18-9b07-55f360341461",
      "severity": "moderate",
      "notes": "Poussées fréquentes en période de stress"
    }
    ,
    {
      "disease_id": "23f504fd-69ca-4d04-bd6f-9bb42da601d9",
      "severity": "severe",
      "notes": "Sous contrôle avec traitement"
    },
    {
      "disease_id": "2f0cb68a-8094-4770-8269-0ee58a6c1e3b",
      "severity": "moderate",
      "notes": "Nécessite une surveillance rapprochée"
    }
  ]
}

* **Delete health record**
  `DELETE https://gbcvxntommivvndxqemz.supabase.co/functions/v1/delete-health-record/{record_id}`



  create nutrition


### 5. Nutrition records CRUD Screen 

In our React Native + Tailwind (NativeWind) project, extend the sidebar navigation by adding a new link called **"Nutrition"**.  

### Functional Goal
We want to implement full **CRUD operations** for children's nutrition records. The app already has the "Get children" API integrated, so leverage that to first **select a child** and then manage their health records (create, view, delete). Each child can have multiple nutrition records.

### Sidebar
- Add a new "Nutrition" link in the sidebar.
- When selected, it should navigate to a screen where we can:
  1. Choose a child (list fetched from `GET /children`)
  2. Once a child is selected → display their nutrition records.
  3. Allow adding, viewing details, and deleting nutrition records.

### API Endpoints
- **Get children**  
  `GET https://gbcvxntommivvndxqemz.supabase.co/functions/v1/children` : 

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

- **Get nutrition records of a child**
  
  `GET https://gbcvxntommivvndxqemz.supabase.co/functions/v1/nutrition-records/{child_id}` : 

{
    "success": true,
    "data": {
        "records": [
            {
                "id": "3794a8c1-fa4e-4a7d-aec8-9aadf38deaf1",
                "child_id": "57c2e86c-6d60-470f-bc18-b78ca5c85e9d",
                "date": "2025-09-04",
                "weight_kg": 70,
                "height_cm": 160,
                "bmi": 27.34,
                "nutrition_status": "normal",
                "dhis2_event_id": null,
                "synced": false,
                "created_at": "2025-09-04T13:31:50.962154+00:00",
                "updated_at": "2025-09-04T13:31:50.962154+00:00",
                "child": {
                    "full_name": "Sephora Tshiyombo",
                    "birth_date": "2020-09-01"
                }
            }
        ],
        "metrics": {
            "total_count": 1,
            "current_page": 1,
            "total_pages": 1,
            "has_next_page": false,
            "has_prev_page": false,
            "page_size": 10
        },
        "child": {
            "id": "57c2e86c-6d60-470f-bc18-b78ca5c85e9d",
            "full_name": "Sephora Tshiyombo"
        }
    }
}

- **Create nutrition record for a child**  
  `POST https://gbcvxntommivvndxqemz.supabase.co/functions/v1/create-nutrition-record/{child_id}`  
  JSON body example:  

  ```
{
  "date": "2024-01-15T10:30:00.000Z",
  "weight_kg": 25.5,
  "height_cm": 120.5,
  "nutrition_status": "normal"
}

````

* **Get health record details**
  `GET https://gbcvxntommivvndxqemz.supabase.co/functions/v1/nutrition-record/{record_id}`

response json "{
    "success": true,
    "data": {
        "id": "3794a8c1-fa4e-4a7d-aec8-9aadf38deaf1",
        "child_id": "57c2e86c-6d60-470f-bc18-b78ca5c85e9d",
        "date": "2025-09-04",
        "weight_kg": 70,
        "height_cm": 160,
        "bmi": 27.34,
        "nutrition_status": "normal",
        "dhis2_event_id": null,
        "synced": false,
        "created_at": "2025-09-04T13:31:50.962154+00:00",
        "updated_at": "2025-09-04T13:31:50.962154+00:00",
        "child": {
            "id": "57c2e86c-6d60-470f-bc18-b78ca5c85e9d",
            "full_name": "Sephora Tshiyombo",
            "birth_date": "2020-09-01",
            "orphanage_id": "a1210e88-384f-406e-8531-17c68498eec8"
        },
        "bmi_interpretation": "Surpoids"
    }
}"

* **Update health record details**
  `PUT https://gbcvxntommivvndxqemz.supabase.co/functions/v1/update-nutrition-record/{record_id}`

  json body : {
    "weight_kg": 26.8,
    "height_cm": 121.2,
    "nutrition_status": "normal"
  }

* **Delete health record**
  `DELETE https://gbcvxntommivvndxqemz.supabase.co/functions/v1/delete-nutrition-record/{record_id}`