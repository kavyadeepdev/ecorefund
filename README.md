# Eco Refund: Tech-Enabled Deposit Refund Scheme (DRS)

Eco Refund is a modernized, tech-enabled deposit refund scheme (DRS). It provides a policy framework and interactive experience designed to incentivize proper waste disposal and recycling across India's unique socio-economic landscape.

The application serves as both a policy proposal dashboard and an interactive **Digital Twin Simulator** showing how Reverse Vending Machines (RVMs), micro-depots, dynamic UPI payouts, and Edge AI can operate in harmony to achieve 100% source-segregated waste recycling.

---

## 🌟 The Vision: Incentivizing Segregated Recycling

Traditional waste management often struggles with low recycling rates and high sorting costs because waste is mixed at the source. 

**Eco Refund** addresses this by creating a direct financial incentive for citizens to sort and return clean recyclables:
*   **Instant UPI Payouts:** Citizens receive instant cash payouts directly to their bank accounts via UPI micro-transactions upon depositing waste.
*   **100% Source Segregation:** Only clean, pre-segregated waste (Plastic, Glass, Paper, Compostable) is accepted. Mixed waste is rejected, avoiding expensive municipal sorting.
*   **Inclusive Economic Model:** Co-opting the informal waste sector (kabadiwalas) as micro-depot operators rather than displacing them.

---

## 🛠️ System Architecture & Features

The project is structured into two main components: a **Policy Proposal & Valuation Dashboard** and a high-fidelity **DRS Digital Twin Simulator**.

### 1. Interactive Landing Page & Policy Framework
*   **Vision & Mechanism:** A detailed breakdown of the three-stage loop: Source Segregation ➔ RVM/Depot Drop-off ➔ Dynamic UPI Payout.
*   **Earnings Estimator (Calculator):** A real-time calculator utilizing localized scrap value metrics:
    *   **Plastic Waste:** ₹2.0 / 100g (₹20/kg)
    *   **Glass Waste:** ₹1.0 / 100g (₹10/kg)
    *   **Paper Waste:** ₹0.5 / 100g (₹5/kg)
    *   **Compostable (Organic) Waste:** ₹0.1 / 100g (₹1/kg)

### 2. The DRS Digital Twin Simulator
Clicking the **"Launch Digital Twin"** button replaces the dashboard with an immersive, full-screen simulator modeling a live IoT-enabled RVM loop. The simulator features three interconnected panels:

#### 📱 Citizen Mobile App (Left Panel)
*   **Dynamic QR Code:** Generates short-lived, TOTP-based authentication QR tokens (e.g., `ECO-XXXX-UPI`) to unlock RVM chutes.
*   **UPI Wallet & Carbon Tracking:** Tracks live earnings (in ₹) and calculates carbon savings offset by the user (`0.0016 kg` of CO₂ saved per gram of waste).
*   **Real-time Ledger:** Shows transactional history of successful UPI payouts.

#### 🤖 Smart Reverse Vending Machine (RVM) Cabinet (Center Panel)
*   **Optical Camera Chute:** A simulated viewport showing physical waste objects. It supports:
    *   **Dragging/Uploading Custom Images:** Upload a photo of trash to test the vision engine.
    *   **Interactive Presets:** One-click presets (e.g., Clean PET Bottle, Glass Soda Bottle, Newspaper, Banana Peel, or unsupported/contaminated items like a metal can or a plastic bottle loaded with sand).
*   **AI Visual Classification:**
    *   Uses **OpenAI's GPT-4o-mini** (if API key is provided) to analyze image shape, material type, estimated weight, and contamination levels.
    *   Falls back to high-fidelity **regex/keyword-based local rules** if the API key is absent.
*   **Fraud & Contamination Detection:** Detects and rejects objects containing hidden sand/water (weight mismatch) or unsupported materials (e.g., aluminum cans).
*   **Sensor Uncertainty Fallback:** Prompts the operator for manual calibration if AI confidence drops below a threshold.
*   **Chute Security:** Emulates a physically locking/unlocking safety door based on user authentication.

#### 🛠️ Operator IoT Console (Right Panel)
*   **Telemetry Metrics:** Real-time feedback on Node Status, Temp/Humidity, and compaction capacity.
*   **Compaction Capacity Monitor:** Warns of machine fullness and locks the chute when capacity exceeds 90% until a purge command is sent.
*   **Remote Control Overrides:** Enables manual locking/unlocking of the chute door and bin purges.
*   **Live MQTT Stream Log:** Displays active sensor events and published JSON payloads on MQTT topics (`rvm/001/session`, `rvm/001/deposit`, `rvm/001/reject`, `rvm/001/payout_status`, etc.).

---

## 📈 Economic Sustainability Model

The framework operates on a self-sustaining tripartite financial system:
1.  **Extended Producer Responsibility (EPR) Subsidies (60%):** FMCG brands pay a premium to acquire verifiable, high-purity EPR Credits to comply with plastic waste management laws.
2.  **Clean Raw Material Sales (30%):** Because waste is segregated at source, clean PET, glass, and paper command a 30-50% price premium from industrial recyclers (no cleaning/sorting overheads).
3.  **Grants & Carbon Credits (10%):** Government funding under waste management missions combined with voluntary carbon credits.

---

## 🛡️ Key Challenges & Strategic Mitigations

*   **Livelihood Displacement:** Instead of eliminating informal workers ("kabadiwalas"), they are integrated as certified micro-depot operators, earning commissions and digital scale access.
*   **System Fraud:** Addressed via precision IoT load-cells (to detect density anomalies like water/stones inside bottles) and Computer Vision edge checking.
*   **Vandalism:** RVM deployment is targeted for controlled environments (Metro stations, corporate tech parks, gated apartments, partnered local Kirana stores) rather than unmonitored roads.

---

## 🚀 Running the App Locally

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+)
*   Any package manager (`npm`, `pnpm`, or `yarn`)

### Installation & Run

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/kavyadeepdev/ecorefund.git
    cd ecorefund-india-drs
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Setup Environment Variables (Optional):**
    To enable real-time GPT-4o-mini analysis for custom waste image uploads, create a `.env.local` file in the root directory:
    ```env
    VITE_OPENAI_API_KEY=your_openai_api_key_here
    ```
    *If no key is provided, the simulator will automatically use local heuristic rules to analyze and classify uploaded files/presets.*

4.  **Run Development Server:**
    ```bash
    npm run dev
    # or
    pnpm dev
    ```

5.  **Open the Web Application:**
    Navigate to `http://localhost:5173` (or the port specified in terminal) in your browser.

---

## 📁 File Structure

*   `src/App.tsx` - Main dashboard layouts, landing sections, and application state.
*   `src/components/Calculator.tsx` - Pricing rates and weight payout estimation math.
*   `src/components/DigitalTwin.tsx` - Digital Twin core logic (App simulator, RVM machine, IoT logs, OpenAI Vision connection).
*   `src/index.css` - Custom styling utilities.
