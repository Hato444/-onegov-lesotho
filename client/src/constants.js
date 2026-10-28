// UI constants copied from the prototype.
export const DEPTS = [
  {id:'homeaffairs', name:'Home Affairs', desc:'Civil registration, national ID and vital records.', color:'#153E82', soft:'#E6EDF9', icon:'idcard'},
  {id:'pension', name:'Pensions', desc:'Public service pensions, contributions and payouts.', color:'#00622F', soft:'#DFF3E7', icon:'wallet'},
  {id:'finance', name:'Finance', desc:'Salary, loan and debt verification services.', color:'#8A5A00', soft:'#FCEFD1', icon:'coins'},
  {id:'police', name:'Police', desc:'Criminal records, clearances and incident reports.', color:'#8C2A1F', soft:'#FBE3E0', icon:'shield'},
  {id:'traffic', name:'Traffic', desc:'Driver licences, vehicles, fines and roadworthiness.', color:'#1D52A8', soft:'#E6EDF9', icon:'car'},
  {id:'passport', name:'Passport', desc:'Passport applications, renewals and tracking.', color:'#5B3A8A', soft:'#EFE7F8', icon:'passport'},
];
export const NAV_MAIN = [
  {v:'dashboard', label:'Dashboard', icon:'dashboard'},
  {v:'search', label:'Citizen Search', icon:'search'},
  {v:'notifications', label:'Notification Center', icon:'bell'},
  {v:'analytics', label:'Analytics', icon:'trend'},
];
export const NAV_DEPTS = [
  {v:'homeaffairs', label:'Home Affairs', icon:'idcard'},
  {v:'pension', label:'Pensions', icon:'wallet'},
  {v:'finance', label:'Finance', icon:'coins'},
  {v:'police', label:'Police', icon:'shield'},
  {v:'traffic', label:'Traffic', icon:'car'},
  {v:'passport', label:'Passport', icon:'passport'},
];
export const VIEW_TITLES = {
  dashboard:['Dashboard', 'Overview of all departments'],
  search:['Citizen Search', 'Find a citizen record across the registry'],
  profile:['Citizen Profile', 'Unified record'],
  homeaffairs:['Home Affairs', 'Civil registration & national ID'],
  pension:['Pensions', 'Public service pension administration'],
  finance:['Finance', 'Salary, loan & debt verification'],
  police:['Police', 'Criminal records & clearances'],
  traffic:['Traffic', 'Licences, vehicles & fines'],
  passport:['Passport Services', 'Applications & renewals'],
  notifications:['Notification Center', 'Missing documents, approvals & rejections'],
  analytics:['Analytics Dashboard', 'Cross-department performance'],
};
export const PROFILE_TABS = [
  {v:'personal', label:'Personal Details'},
  {v:'finance', label:'Finance'},
  {v:'pension', label:'Pension'},
  {v:'police', label:'Police'},
  {v:'traffic', label:'Traffic'},
  {v:'passport', label:'Passport'},
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
export const DEPT_FORM_FIELDS = {
  'homeaffairs:0':[['Child full name','text',true],['Date of birth','date',true],['Place of birth','text',true],['Mother\'s National ID','text',true],['Father\'s National ID','text',false]],
  'homeaffairs:1':[['Deceased full name','text',true],['National ID','text',true],['Date of death','date',true],['Cause of death','text',true]],
  'homeaffairs:2':[['Spouse 1 National ID','text',true],['Spouse 2 National ID','text',true],['Date of marriage','date',true],['Place of marriage','text',true]],
  'homeaffairs:3':[['National ID','text',true],['Field to update','select',true,['Address','Phone number','Email','Surname']],['New value','text',true]],
  'homeaffairs:4':[['National ID','text',true],['Verification purpose','select',true,['Bank account opening','Employment','Court proceedings','Other']]],
  'pension:0':[['Employee number','text',true],['National ID','text',true],['Years of service','number',true],['Retirement date','date',true]],
  'pension:1':[['National ID','text',true],['Beneficiary full name','text',true],['Relationship','select',true,['Spouse','Child','Parent','Other']],['Allocation %','number',true]],
  'pension:2':[['Monthly salary (M)','number',true],['Years of service','number',true],['Expected retirement age','number',true]],
  'pension:3':[['Application reference','text',true],['Decision','select',true,['Approve','Return for correction','Reject']],['Comments','textarea',false]],
  'pension:4':[['National ID or fund number','text',true]],
  'finance:0':[['National ID or employee number','text',true],['Purpose of verification','select',true,['Loan application','Housing application','Visa application','Other']]],
  'finance:1':[['National ID','text',true],['Lending institution','text',true]],
  'finance:2':[['National ID','text',true],['Debt type','select',true,['Municipal rates','Utility arrears','Government loan','Other']]],
  'finance:3':[['Report type','select',true,['Monthly summary','Quarterly summary','Annual summary']],['District','select',false,['All districts','Maseru','Leribe','Berea','Mafeteng']]],
  'police:0':[['National ID','text',true],['Reason for check','select',true,['Employment','Firearm licence','Adoption','Other']]],
  'police:1':[['National ID','text',true],['Purpose','select',true,['Travel','Employment abroad','Immigration','Other']]],
  'police:2':[['Incident type','select',true,['Theft','Assault','Traffic accident','Fraud','Other']],['Date of incident','date',true],['District','text',true],['Description','textarea',true]],
  'traffic:0':[['National ID','text',true],['Action','select',true,['Issue new licence','Renew licence','Suspend licence']],['Licence class','select',true,['Code A','Code B','Code C','Code EB','Code EC']]],
  'traffic:1':[['Owner National ID','text',true],['Vehicle make & model','text',true],['Chassis number','text',true],['Registration type','select',true,['New registration','Ownership transfer']]],
  'traffic:2':[['National ID or licence plate','text',true],['Fine reference (if known)','text',false]],
  'traffic:3':[['Licence plate','text',true],['Inspection date','date',true],['Result','select',true,['Pass','Fail — reinspection required']]],
  'passport:0':[['National ID','text',true],['Passport type','select',true,['Ordinary','Official','Diplomatic']],['Urgency','select',true,['Standard (10 days)','Express (3 days)']]],
  'passport:1':[['Existing passport number','text',true],['National ID','text',true]],
  'passport:2':[['Application reference number','text',true]],
  'passport:3':[['National ID','text',true],['Verification method','select',true,['Biometric match','Document review']]],
};

export const DISTRICTS = ['Maseru', 'Leribe', 'Berea', 'Mafeteng', "Mohale's Hoek", "Qacha's Nek", 'Butha-Buthe', 'Mokhotlong', 'Quthing', 'Thaba-Tseka'];
export const SEARCH_TYPES = [['nid', 'National ID'], ['passport', 'Passport Number'], ['empNo', 'Employee Number'], ['name', 'Full Name']];
export const SEARCH_LABEL = { nid: 'National ID number', passport: 'Passport number', empNo: 'Employee number', name: 'Full name' };
export const SEARCH_PLACEHOLDER = { nid: 'e.g. 1990 0101 2345 9', passport: 'e.g. LS0012345', empNo: 'e.g. GOV-00231', name: 'e.g. Thabo Mokoena' };
export const NOTIF_STYLE = {
  amber: ['#8A5A00', '#FCEFD1', 'alert'],
  blue: ['#153E82', '#E6EDF9', 'info'],
  green: ['#00622F', '#DFF3E7', 'check'],
  red: ['#8C2A1F', '#FBE3E0', 'x'],
};

const fullName = (c) => c.firstName + ' ' + c.lastName;
// A cell can be plain text or { pill, label }.
export const MODULE_TABLE = {
  homeaffairs: { cols: ['Citizen', 'National ID', 'Event', 'District', 'Status'], rows: (c) => [fullName(c), c.nid, c.family.maritalStatus === 'Married' ? 'Marriage on file' : 'Birth record on file', c.district, c.flags.missingDocs > 0 ? { pill: 'amber', label: 'Action needed' } : { pill: 'green', label: 'Up to date' }] },
  pension: { cols: ['Citizen', 'Fund No.', 'Status', 'Monthly amount', 'Beneficiaries'], rows: (c) => [fullName(c), c.pension.fundNo, c.pension.status, c.pension.contributions, String(c.pension.beneficiaries.length)] },
  finance: { cols: ['Citizen', 'Employer', 'Salary', 'Loans', 'Debts'], rows: (c) => [fullName(c), c.employment.employer, c.finance.monthlySalary, String(c.finance.loans.length), String(c.finance.debts.length)] },
  police: { cols: ['Citizen', 'District', 'Clearance', 'Last check', 'Incidents'], rows: (c) => [fullName(c), c.district, c.police.clearance, c.police.lastCheck, String(c.police.incidents.length)] },
  traffic: { cols: ['Citizen', 'Licence', 'Class', 'Vehicles', 'Unpaid fines'], rows: (c) => [fullName(c), c.traffic.licence, c.traffic.class, String(c.traffic.vehicles.length), String(c.traffic.fines.filter((f) => f.status !== 'Paid').length)] },
  passport: { cols: ['Citizen', 'Passport No.', 'Status', 'Expiry'], rows: (c) => [fullName(c), c.passportRec.number, c.passportRec.status, c.passportRec.expiry] },
};
