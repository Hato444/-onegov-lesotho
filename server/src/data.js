// Seed data copied from the prototype. Replace with a real database later.
export const DEPTS = [
  {id:'homeaffairs', name:'Home Affairs', desc:'Civil registration, national ID and vital records.', color:'#153E82', soft:'#E6EDF9', icon:'idcard'},
  {id:'pension', name:'Pensions', desc:'Public service pensions, contributions and payouts.', color:'#00622F', soft:'#DFF3E7', icon:'wallet'},
  {id:'finance', name:'Finance', desc:'Salary, loan and debt verification services.', color:'#8A5A00', soft:'#FCEFD1', icon:'coins'},
  {id:'police', name:'Police', desc:'Criminal records, clearances and incident reports.', color:'#8C2A1F', soft:'#FBE3E0', icon:'shield'},
  {id:'traffic', name:'Traffic', desc:'Driver licences, vehicles, fines and roadworthiness.', color:'#1D52A8', soft:'#E6EDF9', icon:'car'},
  {id:'passport', name:'Passport', desc:'Passport applications, renewals and tracking.', color:'#5B3A8A', soft:'#EFE7F8', icon:'passport'},
];
export const CITIZENS = [
  {
    id:'C-1001', nid:'1990 0101 2345 9', passport:'LS0012345', empNo:'GOV-00231',
    firstName:'Thabo', lastName:'Mokoena', dob:'1990-01-01', gender:'Male', district:'Maseru',
    contact:{phone:'+266 5812 3344', email:'t.mokoena@example.ls', address:'Ha Abia, Maseru 100'},
    family:{maritalStatus:'Married', spouse:'Lineo Mokoena', children:['Katleho Mokoena (8)','Rethabile Mokoena (5)']},
    employment:{employer:'Ministry of Education', position:'Senior Education Officer', status:'Active — Permanent & Pensionable'},
    finance:{salaryVerified:true, monthlySalary:'M 14,250', loans:[{lender:'Lesotho PostBank', balance:'M 22,400', status:'Performing'}], debts:[]},
    pension:{status:'Contributing', fundNo:'PEN-88213', contributions:'M 1,710 / month', beneficiaries:['Lineo Mokoena (Spouse)','Katleho Mokoena (Child)']},
    police:{clearance:'Clean record', lastCheck:'2026-06-02', incidents:[]},
    traffic:{licence:'DL-220145', class:'Code B', vehicles:['Toyota Hilux — M 12 345'], fines:[{desc:'Speeding — Kingsway Rd', amount:'M 500', status:'Paid'}]},
    passportRec:{status:'Valid', number:'LS0012345', expiry:'2029-04-11'},
    flags:{missingDocs:0}
  },
  {
    id:'C-1002', nid:'1985 1230 9988 4', passport:'LS0089123', empNo:'GOV-00456',
    firstName:'Mamello', lastName:'Ntsihlele', dob:'1985-12-30', gender:'Female', district:'Leribe',
    contact:{phone:'+266 6221 8890', email:'m.ntsihlele@example.ls', address:'Hlotse, Leribe 300'},
    family:{maritalStatus:'Single', spouse:'—', children:['Palesa Ntsihlele (3)']},
    employment:{employer:'Ministry of Health', position:'Registered Nurse', status:'Active — Permanent & Pensionable'},
    finance:{salaryVerified:true, monthlySalary:'M 9,800', loans:[], debts:[{creditor:'Municipal Rates — Leribe', amount:'M 1,120', status:'Outstanding'}]},
    pension:{status:'Contributing', fundNo:'PEN-77042', contributions:'M 1,176 / month', beneficiaries:['Palesa Ntsihlele (Child)']},
    police:{clearance:'Clean record', lastCheck:'2026-03-19', incidents:[]},
    traffic:{licence:'DL-198872', class:'Code B', vehicles:[], fines:[]},
    passportRec:{status:'Valid', number:'LS0089123', expiry:'2027-09-02'},
    flags:{missingDocs:1}
  },
  {
    id:'C-1003', nid:'2002 0315 0021 7', passport:null, empNo:null,
    firstName:'Lehlohonolo', lastName:"Mots'oene", dob:'2002-03-15', gender:'Male', district:'Berea',
    contact:{phone:'+266 5990 1123', email:'l.motsoene@example.ls', address:'Teyateyaneng, Berea 200'},
    family:{maritalStatus:'Single', spouse:'—', children:[]},
    employment:{employer:'—', position:'Student — National University of Lesotho', status:'Not employed'},
    finance:{salaryVerified:false, monthlySalary:'—', loans:[{lender:'NMDS Student Loan', balance:'M 18,000', status:'Deferred'}], debts:[]},
    pension:{status:'Not contributing', fundNo:'—', contributions:'—', beneficiaries:[]},
    police:{clearance:'Clean record', lastCheck:'2026-01-08', incidents:[]},
    traffic:{licence:'Not issued', class:'—', vehicles:[], fines:[]},
    passportRec:{status:'No record', number:'—', expiry:'—'},
    flags:{missingDocs:2}
  },
  {
    id:'C-1004', nid:'1977 1105 4432 2', passport:'LS0055678', empNo:'GOV-01122',
    firstName:'Palesa', lastName:'Khiba', dob:'1977-11-05', gender:'Female', district:'Mafeteng',
    contact:{phone:'+266 6300 4471', email:'p.khiba@example.ls', address:'Mafeteng Camp Town'},
    family:{maritalStatus:'Widowed', spouse:'—', children:['Thato Khiba (19)','Neo Khiba (16)']},
    employment:{employer:'Ministry of Home Affairs (Retired)', position:'Former Civil Registrar', status:'Retired'},
    finance:{salaryVerified:true, monthlySalary:'M 0 (Pension)', loans:[], debts:[]},
    pension:{status:'In Payment', fundNo:'PEN-40071', contributions:'Payout: M 3,120 / month', beneficiaries:['Thato Khiba (Child)','Neo Khiba (Child)']},
    police:{clearance:'Clean record', lastCheck:'2025-11-30', incidents:[]},
    traffic:{licence:'DL-100234', class:'Code B', vehicles:['Nissan Almera — M 09 812'], fines:[]},
    passportRec:{status:'Valid', number:'LS0055678', expiry:'2028-02-17'},
    flags:{missingDocs:0}
  },
  {
    id:'C-1005', nid:'1994 0922 1190 6', passport:'LS0033201', empNo:'PVT-00987',
    firstName:'Retšelisitsoe', lastName:'Ramaili', dob:'1994-09-22', gender:'Male', district:"Mohale's Hoek",
    contact:{phone:'+266 5877 2201', email:'r.ramaili@example.ls', address:"Mohale's Hoek Town"},
    family:{maritalStatus:'Married', spouse:'Mpho Ramaili', children:[]},
    employment:{employer:'Metolong Water Co.', position:'Site Engineer', status:'Active — Private sector'},
    finance:{salaryVerified:true, monthlySalary:'M 16,900', loans:[{lender:'Standard Lesotho Bank', balance:'M 44,200', status:'Performing'}], debts:[]},
    pension:{status:'Not contributing (Private fund)', fundNo:'—', contributions:'—', beneficiaries:[]},
    police:{clearance:'Pending review', lastCheck:'2026-08-14', incidents:[{type:'Minor traffic infraction', date:'2024-02-11', status:'Closed'}]},
    traffic:{licence:'DL-233410', class:'Code B, EB', vehicles:['Isuzu D-Max — M 21 004'], fines:[{desc:'Expired disc — Moshoeshoe Rd', amount:'M 300', status:'Unpaid'}]},
    passportRec:{status:'Valid', number:'LS0033201', expiry:'2030-01-05'},
    flags:{missingDocs:1}
  },
  {
    id:'C-1006', nid:'1966 0618 1267 8', passport:'LS0011009', empNo:'GOV-00789',
    firstName:'Nthabiseng', lastName:'Mofolo', dob:'1966-06-18', gender:'Female', district:"Qacha's Nek",
    contact:{phone:'+266 6255 8834', email:'n.mofolo@example.ls', address:"Qacha's Nek Town"},
    family:{maritalStatus:'Married', spouse:'Tumelo Mofolo', children:['Karabo Mofolo (28)']},
    employment:{employer:'Ministry of Finance (Retired)', position:'Former Chief Accountant', status:'Retired'},
    finance:{salaryVerified:true, monthlySalary:'M 0 (Pension)', loans:[], debts:[]},
    pension:{status:'In Payment', fundNo:'PEN-22091', contributions:'Payout: M 4,850 / month', beneficiaries:['Tumelo Mofolo (Spouse)']},
    police:{clearance:'Clean record', lastCheck:'2026-05-22', incidents:[]},
    traffic:{licence:'DL-076621', class:'Code B', vehicles:[], fines:[]},
    passportRec:{status:'Expiring soon', number:'LS0011009', expiry:'2026-11-30'},
    flags:{missingDocs:0}
  }
];
export const NOTIFICATIONS = [
  {id:1, cat:'missing', title:'Missing document — Birth certificate scan', citizen:"Lehlohonolo Mots'oene", dept:'Home Affairs', time:'8 min ago', level:'amber'},
  {id:2, cat:'pending', title:'Pending verification — Salary confirmation', citizen:'Retšelisitsoe Ramaili', dept:'Finance', time:'42 min ago', level:'blue'},
  {id:3, cat:'approval', title:'Pension payout approved', citizen:'Nthabiseng Mofolo', dept:'Pensions', time:'1 hr ago', level:'green'},
  {id:4, cat:'rejection', title:'Passport application rejected — photo non-compliant', citizen:'Mamello Ntsihlele', dept:'Passport', time:'3 hrs ago', level:'red'},
  {id:5, cat:'pending', title:'Pending verification — Police clearance', citizen:'Retšelisitsoe Ramaili', dept:'Police', time:'5 hrs ago', level:'blue'},
  {id:6, cat:'missing', title:'Missing document — Proof of residence', citizen:'Mamello Ntsihlele', dept:'Home Affairs', time:'Yesterday', level:'amber'},
  {id:7, cat:'approval', title:'Driver licence renewal approved', citizen:'Thabo Mokoena', dept:'Traffic', time:'Yesterday', level:'green'},
  {id:8, cat:'rejection', title:'Loan verification declined — insufficient records', citizen:"Lehlohonolo Mots'oene", dept:'Finance', time:'2 days ago', level:'red'},
];
export const ACTIVITY = [
  {who:'Officer M. Lerotholi', what:'registered a birth for a newborn in Maseru district', time:'12 min ago'},
  {who:'Officer T. Phakisi', what:'issued a police clearance certificate for Nthabiseng Mofolo', time:'55 min ago'},
  {who:'System', what:'auto-synced updated address for Mamello Ntsihlele to Traffic & Passport records', time:'1 hr ago'},
  {who:'Officer L. Thabane', what:'approved pension application PEN-22091', time:'2 hrs ago'},
  {who:'Officer K. Mahao', what:'flagged an unpaid traffic fine for Retšelisitsoe Ramaili', time:'3 hrs ago'},
  {who:'System', what:'ran nightly reconciliation across 14,203 citizen records', time:'Today, 04:00'},
];
export const MODULE_ACTIONS = {
  homeaffairs:[
    {icon:'baby', title:'Register Birth', desc:'Capture a new birth record and issue a birth certificate.'},
    {icon:'doc', title:'Register Death', desc:'Record a death and update the citizen\'s civil status.'},
    {icon:'heart', title:'Register Marriage', desc:'Record a marriage and link both parties\' records.'},
    {icon:'edit', title:'Update Personal Information', desc:'Amend name, address or contact details on file.'},
    {icon:'scan', title:'ID Verification', desc:'Verify a national ID against the civil registry.'},
  ],
  pension:[
    {icon:'doc', title:'Pension Application', desc:'Submit a new public service pension application.'},
    {icon:'users', title:'Beneficiary Management', desc:'Add, remove or update registered beneficiaries.'},
    {icon:'calc', title:'Pension Calculator', desc:'Estimate contributions and projected payout.'},
    {icon:'flow', title:'Pension Approval Workflow', desc:'Review and approve pending pension applications.'},
    {icon:'tracking', title:'Pension Status Tracking', desc:'Track the progress of a submitted application.'},
  ],
  finance:[
    {icon:'money', title:'Salary Verification', desc:'Confirm employment income for loans or applications.'},
    {icon:'coins', title:'Loan Verification', desc:'Verify active loan balances and repayment status.'},
    {icon:'alert', title:'Debt Verification', desc:'Check outstanding government or municipal debts.'},
    {icon:'report', title:'Financial Reports', desc:'Generate departmental financial summary reports.'},
  ],
  police:[
    {icon:'fingerprint', title:'Criminal Record Verification', desc:'Search the criminal record database by ID.'},
    {icon:'stamp', title:'Police Clearance Requests', desc:'Process a request for a police clearance certificate.'},
    {icon:'incident', title:'Incident Records', desc:'Log or review recorded incidents and case files.'},
  ],
  traffic:[
    {icon:'licence', title:'Driver Licence Management', desc:'Issue, renew or suspend a driver\'s licence.'},
    {icon:'car', title:'Vehicle Registration', desc:'Register a new vehicle or transfer ownership.'},
    {icon:'ticket', title:'Traffic Fines', desc:'View, contest or process payment of traffic fines.'},
    {icon:'wrench', title:'Roadworthiness Records', desc:'Log and review vehicle roadworthiness inspections.'},
  ],
  passport:[
    {icon:'passport', title:'Passport Application', desc:'Start a new ordinary, official or diplomatic passport application.'},
    {icon:'doc', title:'Passport Renewal', desc:'Renew an existing passport nearing expiry.'},
    {icon:'tracking', title:'Application Tracking', desc:'Track the status of a submitted application.'},
    {icon:'verify', title:'Identity Verification', desc:'Verify identity against Home Affairs civil records.'},
  ],
};

export const STATS = [
  { num: '14,203', lbl: 'Total citizen records', delta: '+128 this week', dir: 'up' },
  { num: '482', lbl: 'Applications in progress', delta: '+36 since yesterday', dir: 'up' },
  { num: '97.2%', lbl: 'Service uptime (30 days)', delta: '+0.4%', dir: 'up' },
  { num: '2.1 days', lbl: 'Avg. turnaround time', delta: '-0.6 days', dir: 'up' },
];
export const CASE_COUNTS = { homeaffairs: 7, pension: 5, finance: 9, police: 3, traffic: 12, passport: 6 };

export const ANALYTICS = {
  kpis: [
    { num: '4,912', lbl: 'Applications this month', delta: '+8.4%', dir: 'up' },
    { num: '2.7 days', lbl: 'Avg. turnaround, all depts', delta: '-0.3 days', dir: 'up' },
    { num: '89%', lbl: 'Overall approval rate', delta: '+1.1%', dir: 'up' },
    { num: '11%', lbl: 'Rejection / return rate', delta: '+0.4%', dir: 'down' },
  ],
  perf: [
    { name: 'Home Affairs', val: 94, color: '#153E82' },
    { name: 'Pensions', val: 88, color: '#00622F' },
    { name: 'Finance', val: 91, color: '#8A5A00' },
    { name: 'Police', val: 97, color: '#8C2A1F' },
    { name: 'Traffic', val: 83, color: '#1D52A8' },
    { name: 'Passport', val: 79, color: '#5B3A8A' },
  ],
  turnaround: [
    { name: 'Home Affairs', days: 1.2 }, { name: 'Pensions', days: 5.4 }, { name: 'Finance', days: 0.8 },
    { name: 'Police', days: 2.1 }, { name: 'Traffic', days: 0.5 }, { name: 'Passport', days: 6.7 },
  ],
  trend: [62, 68, 71, 66, 74, 80, 77, 85, 88, 84, 90, 96],
};

// Notifications link to a citizen id so the UI does not match on names.
export const NOTIFICATIONS_WITH_IDS = NOTIFICATIONS.map((n) => ({
  ...n,
  citizenId: CITIZENS.find((c) => `${c.firstName} ${c.lastName}` === n.citizen)?.id || null,
}));

export const REQUESTS = [];
