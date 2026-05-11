# Current Workflow — Summit Resources

This document captures the existing automation workflow operated by **Joshua Shields**, owner of an Australia-based labour resourcing and workforce-planning business serving construction projects. It is the source-of-truth reference for the current state, and will inform the PRD for the new web application.

---

## Business Context

- **Operator:** Joshua Shields
- **Region:** Australia (operates in QLD, WA, VIC, NSW, SA, NT, TAS)
- **Domain:** Labour resourcing and workforce planning for construction projects
- **Roles allocated:** Dogmen, Riggers, Crane Operators, and other site personnel
- **Current stack:** Google Sheets, Airtable, Tally.so, Make.com, Superchat, Twilio

---

## Core Systems & Databases

### 1. Google Sheets — "Work Order Form" (Master Work Order Database)

- URL: `https://docs.google.com/spreadsheets/d/1yaCAF0cdbMQNX42Ria1Jh6Usb-RhN5WiOAa8Gp5qWAM`
- Every Work Order is stored here. Each record contains:
  - Unique Work Order ID (e.g. `WO12`)
  - Client details and email addresses
  - Project name *(the construction-project name supplied by the client)*
  - Start and end dates
  - Shift information
  - Required labour roles and licences
  - Pay rates
  - Rosters
  - Additional Work-Order-specific notes and operational details

### 2. Airtable — Labour Database

- URL: `https://airtable.com/appaPYQN8e2GhEhH1`
- Stores all labour contacts. Each record contains:
  - Personal and contact information
  - Skill types and crane/labour licences
  - Licence images and uploaded documents
  - Labour ratings / performance scores
  - Licence-for-hire PDFs
  - Employment status and other workforce-related data

---

## Phase 1 — Labour Outreach & Availability Collection

Triggered when Joshua secures a new Work Order.

### Step 1 — Work Order Creation

1. Joshua manually enters all Work Order information into the **Work Order Form** Google Sheet.
2. Joshua opens a **Tally.so form** built specifically for initiating labour outreach.
3. The form requires:
   - **Work Order ID** (e.g. `WO12`)
   - **Preferred employee state/location** — one of: QLD, WA, VIC, NSW, SA, NT, TAS
   - **Required employee skills / licence types** for the Work Order

### Step 2 — Make.com Automation Trigger

Submitting the Tally form fires a webhook into a Make.com scenario, which performs the following:

#### A. Retrieve Work Order Information
- Looks up the **Work Order Form** Google Sheet using the submitted Work Order ID.
- Pulls all related Work Order details into the automation.

#### B. Create a Client-Specific Google Spreadsheet
- Creates (or reuses) a spreadsheet dedicated to the client/Work Order workflow:
  - **New client:** a brand new spreadsheet is created.
  - **Existing client:** a new tab is added inside the client's existing spreadsheet.
- The tab is named using the **Work Order ID** (e.g. `WO12`).
- Used to track labour outreach and responses for that specific Work Order.

#### C. Generate a Unique Tally Availability Form
- A new Tally form is dynamically generated per Work Order.
- The form asks a single question: *"Will you be available for this job?"*
- Response options:
  - Yes
  - No
  - Not Relevant to Me
  - I Don't Work Anymore
- The form URL is **pre-filled via query parameters** with each labourer's:
  - Email address
  - Phone number
- This allows the system to identify exactly which worker submitted each response.

#### D. Bulk SMS Outreach to Qualified Labourers
- A second Make.com workflow handles labour outreach.
- It searches the **Airtable** labour database and filters labourers by:
  - Required skills / licences
  - Preferred state / location
- Sends bulk SMS via **Superchat** + **Twilio** integration.
- SMS payload contains:
  - Work Order details
  - Dates and requirements
  - The unique Tally availability form link

### Step 3 — Labour Availability Responses

- Labourer receives the SMS and submits their response via the Tally form.
- Each submission triggers another Make.com automation.
- That automation updates the **client-specific Google Sheet** for the Work Order.

#### Response-driven side effects

The automation also reacts to specific response options beyond logging them in the Work Order sheet:

- **"I Don't Work Anymore"**
  - The labour contact is automatically marked as **Inactive** in the Airtable labour database.
  - Inactive contacts are excluded from all future SMS campaigns and Work Order outreach.

- **"Not Relevant to Me"**
  - The system sends the labourer a follow-up SMS containing a link to a **profile update form** (this form is hosted on **Airtable** — not Tally — so submissions write straight back into the Airtable labour database without a separate webhook step).
  - The profile update form lets the labourer update:
    - General details
    - Current location / state
    - Skillsets and licences
    - Availability preferences
    - Other workforce-related information
  - Submissions automatically update the Airtable labour database, improving future labour matching so labourers only receive opportunities relevant to their current skills and preferences.

- **"Yes"** / **"No"**
  - Logged on the Work Order spreadsheet for shortlisting (see Step 4).

### Step 4 — Workforce Shortlisting

- Every contacted labourer is auto-logged in the Work Order spreadsheet.
  - Example: messages sent to Tom, Dick, Harry → rows for each appear automatically with their response status.
- Joshua then:
  1. Opens the specific Work Order sheet.
  2. Filters labourers who responded **"Yes"**.
  3. Reviews worker details.
  4. Decides who to assign to the Work Order.

### Step 5 — Manual SMS Intervention via Superchat

The ideal flow is that labourers receive the SMS, open the Tally form, and submit availability through the automated path. In practice that does not always happen — labourers often reply directly to the SMS instead of using the form. Their replies may include:

- Questions about the job
- Requests for additional information
- Negotiations or special requests
- Direct availability responses via SMS (instead of the form)
- General conversation or support enquiries

When this happens, Joshua or members of his team manually step in to manage the conversation. **Superchat** is the tool used for this.

- **Superchat** is integrated with **Twilio SMS** and acts as the central communication hub for all SMS conversations.
- It allows Joshua and his team to:
  - View incoming SMS replies
  - Communicate directly with labourers
  - Answer job-related questions
  - Handle exceptions or special requests
  - Manually update or action decisions when required

**Role:** while the majority of Phase 1 is automated, **Superchat is the manual communication layer** whenever human intervention is needed.

**Phase 1 summary:** automates labour sourcing, outreach, availability collection, and response tracking, with Superchat acting as the human-in-the-loop layer for conversational replies.

---

## Phase 2 — Hiring, Contracts & Performance Evaluation

### Phase 2.1 — Hiring & Contract Generation

Once Joshua reviews the list of available labourers and decides who should be hired for the Work Order, he completes another Tally form. The form requires:

- The **Work Order ID** number
- The **email addresses** of the labourers selected for the job

#### Step 1 — Contract Automation Trigger

Form submission fires a Make.com automation, which:

- Locates the correct Work Order inside the **Work Order Form** Google Sheet using the Work Order ID
- Retrieves all associated Work Order information
- Retrieves the selected labourer details
- Populates a **contract template** stored as a Google Doc

The template contains dynamic variables which are automatically replaced with:

- Work Order details
- Client information
- Labourer details
- Dates
- Pay rates
- Other job-specific information

#### Step 2 — Contract File Creation & Storage

Once generated, the system automatically:

- Saves the **Google Docs** version of the contract into a designated Google Drive folder
- Generates and saves a **PDF** version into a separate "PDF Contracts" folder

At the same time, the automation updates a dedicated tab inside the main **Work Order Form** spreadsheet called **"Hiring Log"**. A new row is created containing:

- Work Order ID
- Labourer name
- Email address
- Contact number
- Hiring status
- Work Order start date

#### Hiring Status Tracking

The **Hiring Status** column tracks each contract through the hiring pipeline. Typical statuses:

- Created
- Sent
- Signed
- Rejected

Currently, once the PDF contract is generated, **Joshua manually sends it to the selected labourers via Adobe Sign** for e-signature.

---

### Phase 2.2 — Signed Contracts & Performance Evaluation

#### Step 1 — Signed Contract Detection

Once a labourer signs the contract, another Make.com automation is triggered via an **email listener** that monitors incoming emails for signed contract documents. When a signed contract is detected, the system:

- Updates the relevant entry in the **Hiring Log**
- Marks the contract as **Signed**

#### Step 2 — Evaluation Log Creation

The **Work Order Form** spreadsheet contains another tab called **"Evaluation Log"**. When a contract is signed, the automation creates a new row in this log with the labourer's details and the following evaluation categories (each scored 0 / 0.5 / 1):

- Fitness for Work
- Presentation
- Attitude & Adaptability
- Punctuality
- Performance
- Additional Comments (free text)

The scores are totalled to produce an overall **"Job Rating"** for that labourer on that specific Work Order.

#### Labour Rating System

The evaluation process links back to the **Labour Rating** field stored on each labourer in the Airtable database. Long-term objective: build a performance profile for every labourer based on completed jobs.

After each completed Work Order:

- The new job rating is added to the labourer's history
- Airtable recalculates the labourer's overall **average Labour Rating**

Business outcomes:

- Identify high-performing labourers
- Prioritise reliable workers for future Work Orders
- Build a data-driven workforce allocation system over time

#### Step 3 — Client Evaluation Request

A scheduled automation collects feedback from Joshua's clients.

- Trigger: exactly **5 days after a Work Order start date**
- Action: automatically emails the client with a **Tally evaluation form link**

Example email:

```
Hi,

Please provide feedback on Tom's recent work performance by completing the following form:

[Evaluation Form URL]

Regards,
Summit Cranes
```

#### Step 4 — Client Feedback Processing

When the client completes the evaluation form, the response fires another Make.com automation, which:

- Updates the **Evaluation Log** tab inside the Work Order Form spreadsheet
- Stores the submitted performance scores and comments
- Recalculates and updates the labourer's average **Labour Rating** in the Airtable database

This closes the feedback loop and continuously improves the quality and accuracy of the labour workforce database over time.

**Phase 2 summary:** automates contract generation, hiring-pipeline tracking, signed-contract detection, internal evaluations on signature, and client-side performance feedback after Work Order start — all feeding back into the labour-rating profile in Airtable.

---

## Phase 3 — Client Handoff & Compliance Documentation

After Joshua receives all signed contracts from the selected labourers, he must notify his client about which workers will be assigned to the Work Order. The exact communication method may vary, but it is most likely done via **email**.

The handoff communication needs to include:

- Details of the labourers assigned to the Work Order
- A **PDF "Licence Profile"** for each assigned labourer

These licence profiles are critical operational documents — they are what Joshua sends clients as proof that the assigned labourers meet the Work Order's compliance and licensing requirements.

### Labourer PDF Licence Profiles

Each labourer has a generated PDF profile containing their employment and compliance information.

**Profile fields:**

- Full name
- Email address
- Location
- Gender
- Emergency contact details
- Skill types
- Crane licences
- Other certifications and qualifications

**Image content (front and back where applicable):**

- White Card
- High Risk Work Licence
- Driver's Licence
- Other trade or safety-related licences

**"Other Licences" — Work-Order-dependent additional certifications:**

- Trade Licences
- Working at Heights
- Confined Spaces
- First Aid
- MSIC
- Other site-specific certifications

These may exist as physical cards, certificates, or uploaded documents, all grouped under the **"Other Licences"** section of the labourer's profile.

### Automated PDF Licence Generation

Once a labourer's information is updated in Airtable, an automated process generates their PDF licence profile.

**Stack:**

- **Airtable** — data source (labourer info + uploaded licence images)
- **Documint** — PDF generation platform (template engine)
- **Make.com** — orchestration layer

**Flow:**

1. Labourer information and uploaded licence images live in Airtable.
2. Make.com pulls the relevant data.
3. The data is injected into a Documint template.
4. Documint generates the completed PDF licence profile.
5. The generated PDF is saved back into Airtable against the labourer's record.

This allows Joshua and his team to quickly retrieve a ready-to-send compliance profile whenever a labourer is assigned to a Work Order.

---

## Cross-Cutting: Labour Database Health & Data Quality

One of the biggest operational issues Joshua's business faces is **maintaining the quality and accuracy of the labour database**. Over time, many labour contacts become outdated due to:

- No longer responding to SMS outreach
- Expired licences or certifications
- Changed skillsets or locations
- No longer working in the industry
- Retired or deceased workers
- Incorrect or incomplete information

### Existing self-cleaning mechanisms

Several mechanisms already exist in the workflow to continuously improve and maintain the database:

- **"I Don't Work Anymore"** response → labourer is auto-marked **Inactive** and excluded from future SMS campaigns.
- **"Not Relevant to Me"** response → labourer is auto-sent a profile update form (hosted on **Airtable**, writing directly back to the Airtable labour database) covering:
  - Skills
  - Licences
  - Availability
  - Location
  - Other workforce details

This helps ensure future job opportunities are sent to the most relevant workers.

### Why continuous information updates are critical

The labourer update forms require uploads of:

- Updated licence photos
- Certificates
- Identification documents
- Other compliance-related files

Keeping this information current is essential because **clients often require verified documentation before labourers are approved to work on-site**.

---

## Pain Points & Streamlining Opportunities

### Major Operational Pain Point — Missing or Outdated Compliance Documents

The most significant bottleneck occurs when a labourer:

- Responds **"Yes"** to job availability,
- Is **selected** for the Work Order,
- But does **not have updated information or valid licence documents** stored in the system.

In these situations, Joshua and his team must manually intervene by:

- Contacting the labourer directly
- Requesting updated licences and certifications
- Collecting missing documents
- Manually updating records
- Manually generating or correcting the PDF licence profile

This is extremely time-consuming and creates operational bottlenecks, especially when Work Orders need to be staffed quickly. The ability to generate accurate and complete PDF licence profiles is critical because these documents are what Joshua sends clients as proof of compliance.

### Pain point relative weighting

Per Joshua, the major pain points are **comparable** in operational drag:

- Yes-but-no-docs compliance gap
- Superchat conversation triage
- Manual handoff email to client
- Hiring Status updates

**Adobe Sign manual send is currently acceptable** — Joshua is fine continuing manual e-sign in the new app for now.

### Other observations

- Workflow is split across many platforms — Google Sheets, Airtable, Tally.so, Make.com, Documint, Superchat, Twilio, Adobe Sign, Google Drive, Gmail.
- Manual handoff steps remain at: Adobe Sign send, Superchat conversations, client handoff email.
- Hiring Status updates are partially manual.

---

## Strategic Direction for the New Web App

**Why a web app:** the existing process has too many moving parts and platform dependencies for what is, at its core, a simple business workflow. Consolidating this into a centralised web app gives Joshua a single operational surface and a foundation that future capabilities can be built on.

### Replacement Scope

**Replace in v1 (consolidated into the web app):**

- Google Sheets — Work Order Form, Hiring Log, Evaluation Log, per-Work-Order response sheets
- Airtable — labour database (contacts, licences, ratings, status)
- Tally.so — all forms (outreach trigger, availability response, profile update, client evaluation, hiring selection)

**Keep external in v1, integrate via API:**

- **Twilio** — SMS delivery (outbound + inbound webhook)
- **Superchat** — manual conversation layer for inbound SMS replies (kept in the loop)
- **Adobe Sign** — manual contract send / e-signature (Joshua is OK with this remaining manual)

**Decision — Documint (PDF licence profiles):**

- v1 will render PDFs **in-app** (HTML → PDF via headless Chromium) so the licence-profile template lives in the app repo.
- The PDF layer sits **behind an interface** so the implementation can fall back to Documint (or any other provider) via API call if needed without touching call sites.

### v1 Success Criterion (locked)

**Joshua runs an entire Work Order end-to-end — from Work Order entry to client handoff — using only the web app + Superchat (for manual SMS conversation handling) + Adobe Sign (for e-signature). No Sheets, no Airtable, no Tally, no Make.com. Day-one labour database is the existing Airtable/Sheets data, migrated in.**

*Twilio is the SMS delivery service the web app calls and that Superchat is integrated with — it is not a user-facing tool, so Joshua never opens it directly.*

**Future scope (not v1, but the architecture should not preclude it):**

- AI-assisted SMS conversation handling — Joshua is interested but **parked** because full LLM-driven SMS conversations over Twilio carry meaningful per-message cost. The system should be designed so this can be layered in later without re-architecting the SMS pipeline.
- Replacement of Superchat / Adobe Sign at a later phase.

### User Model

- **Primary user:** Joshua Shields (operator/owner).
- **Secondary users:** team members as the business expands. The app must support multi-user access from day one (auth, roles, audit) even if Joshua is the only active user at launch.

### Architectural Implications (to feed into the PRD)

- Multi-tenant-ready data model (users, roles, scoping) even if single-org at launch.
- Pluggable SMS layer — Twilio first, but the conversation surface should accommodate an AI agent later.
- Pluggable PDF layer — whether we keep Documint or render in-app, the contract and licence-profile generators should sit behind a clean interface.
- Webhook-friendly inbound surface for Twilio (and optionally Adobe Sign signed-doc events) so the email-listener-on-signed-contract pattern can move to a proper webhook.
