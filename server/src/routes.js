import { Router } from 'express';
import {
  CITIZENS, NOTIFICATIONS_WITH_IDS, ACTIVITY, DEPTS, MODULE_ACTIONS,
  STATS, CASE_COUNTS, ANALYTICS, REQUESTS,
} from './data.js';

const router = Router();

const audit = (req, action, meta = {}) =>
  console.log(JSON.stringify({ t: new Date().toISOString(), officer: req.user.username, action, ...meta }));

const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, '');
const fullName = (c) => `${c.firstName} ${c.lastName}`;
const summary = (c) => ({
  id: c.id, nid: c.nid, passport: c.passport, empNo: c.empNo,
  firstName: c.firstName, lastName: c.lastName, district: c.district, flags: c.flags,
});

const DEPT_KEYS = { police: 'police', finance: 'finance', pension: 'pension', traffic: 'traffic', passport: 'passportRec', homeaffairs: null };
const SERVICE_DEPT = {
  'National ID Application': 'homeaffairs',
  'Birth Certificate': 'homeaffairs',
  'Passport Application': 'passport',
  'Police Clearance Request': 'police',
  'Driver Licence Renewal': 'traffic',
  'Pension Registration': 'pension',
  'Finance Service': 'finance',
};
const notif = (n) => {
  NOTIFICATIONS_WITH_IDS.unshift({ id: Date.now() + Math.random(), time: 'Just now', level: 'blue', cat: 'pending', ...n });
};

router.get('/dashboard', (req, res) => {
  res.json({ stats: STATS, caseCounts: CASE_COUNTS, activity: ACTIVITY.slice(0, 5) });
});
router.get('/analytics', (req, res) => res.json(ANALYTICS));
router.get('/notifications', (req, res) => res.json({ notifications: NOTIFICATIONS_WITH_IDS }));

router.get('/citizens', (req, res) => {
  audit(req, 'citizen.list');
  res.json({ citizens: CITIZENS });
});

router.get('/citizens/search', (req, res) => {
  const type = String(req.query.type || '');
  const q = String(req.query.q || '').trim().slice(0, 100);
  if (!['nid', 'passport', 'empNo', 'name'].includes(type)) return res.status(400).json({ error: 'Invalid search type.' });
  if (!q) return res.status(400).json({ error: 'Enter a value to search for.' });
  const { district, gender, flags } = req.query;
  const needle = norm(q);
  const results = CITIZENS.filter((c) => {
    const hit =
      type === 'nid' ? norm(c.nid).includes(needle)
      : type === 'passport' ? norm(c.passport).includes(needle)
      : type === 'empNo' ? norm(c.empNo).includes(needle)
      : norm(fullName(c)).includes(needle);
    if (!hit) return false;
    if (district && c.district !== district) return false;
    if (gender && c.gender !== gender) return false;
    if (flags === 'yes' && c.flags.missingDocs === 0) return false;
    if (flags === 'no' && c.flags.missingDocs > 0) return false;
    return true;
  });
  audit(req, 'citizen.search', { type, count: results.length });
  res.json({ results: results.map(summary) });
});

// Full detail is redacted to basic identity + the officer's own department slice.
router.get('/citizens/:id', (req, res) => {
  const citizen = CITIZENS.find((c) => c.id === req.params.id);
  if (!citizen) return res.status(404).json({ error: 'Citizen record not found.' });
  audit(req, 'citizen.view', { citizenId: citizen.id });
  if (req.user.portal === 'citizen') return res.json({ citizen });
  const own = DEPT_KEYS[req.user.deptId];
  const out = {
    id: citizen.id, nid: citizen.nid, passport: citizen.passport, empNo: citizen.empNo,
    firstName: citizen.firstName, lastName: citizen.lastName,
    dob: citizen.dob, gender: citizen.gender, district: citizen.district,
    contact: citizen.contact, family: citizen.family, employment: citizen.employment,
    flags: citizen.flags,
  };
  if (own) out[own] = citizen[own];
  res.json({ citizen: out, department: req.user.deptId });
});

// ---- Unified request model ----
// fromType: citizen|department, toType: department|citizen
const mkRequest = (o) => ({
  id: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
  response: '', priority: 'Normal', status: 'Pending',
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  ...o,
});

router.get('/citizen/requests', (req, res) => {
  if (req.user.portal !== 'citizen') return res.status(403).json({ error: 'Citizen access only.' });
  res.json({ requests: REQUESTS.filter((r) => r.citizenId === req.user.citizenId) });
});

router.post('/citizen/requests', (req, res) => {
  if (req.user.portal !== 'citizen') return res.status(403).json({ error: 'Citizen access only.' });
  const { service, message } = req.body || {};
  const toDepartment = SERVICE_DEPT[service];
  if (!toDepartment) return res.status(400).json({ error: 'Unknown service.' });
  const citizen = CITIZENS.find((c) => c.id === req.user.citizenId);
  const request = mkRequest({
    fromType: 'citizen', fromId: req.user.username, fromDepartment: null,
    toType: 'department', toId: toDepartment, toDepartment,
    citizenId: req.user.citizenId, citizenName: fullName(citizen),
    requestType: service,
    message: String(message || `Citizen applied for ${service}.`).slice(0, 1000),
  });
  REQUESTS.unshift(request);
  notif({ title: `New citizen request - ${service}`, citizen: fullName(citizen), citizenId: citizen.id, dept: DEPTS.find((d) => d.id === toDepartment)?.name });
  audit(req, 'citizen.request', { id: request.id });
  res.status(201).json({ request });
});

router.post('/citizen/requests/:id/respond', (req, res) => {
  if (req.user.portal !== 'citizen') return res.status(403).json({ error: 'Citizen access only.' });
  const r = REQUESTS.find((x) => x.id === req.params.id && x.citizenId === req.user.citizenId);
  if (!r) return res.status(404).json({ error: 'Request not found.' });
  const text = String(req.body?.message || '').slice(0, 1000);
  if (!text) return res.status(400).json({ error: 'Enter a response.' });
  r.response = r.response ? r.response + '\nCitizen: ' + text : 'Citizen: ' + text;
  r.status = 'In Progress';
  r.updatedAt = new Date().toISOString();
  res.json({ request: r });
});

router.get('/dept/requests', (req, res) => {
  if (req.user.portal === 'citizen') return res.status(403).json({ error: 'Staff access only.' });
  const dept = req.user.deptId;
  res.json({
    received: REQUESTS.filter((r) => r.toType === 'department' && r.toDepartment === dept),
    sent: REQUESTS.filter((r) => r.fromType === 'department' && r.fromDepartment === dept),
  });
});

router.post('/dept/requests', (req, res) => {
  if (req.user.portal === 'citizen') return res.status(403).json({ error: 'Staff access only.' });
  const { toDepartment, citizenId, requestType, message, priority } = req.body || {};
  if (!DEPTS.some((d) => d.id === toDepartment)) return res.status(400).json({ error: 'Choose a valid department.' });
  if (toDepartment === req.user.deptId) return res.status(400).json({ error: 'Choose another department.' });
  const citizen = CITIZENS.find((c) => c.id === citizenId);
  if (!citizen) return res.status(400).json({ error: 'Select a citizen first.' });
  if (!String(requestType || '').trim() || !String(message || '').trim()) return res.status(400).json({ error: 'Enter a request type and message.' });
  const request = mkRequest({
    fromType: 'department', fromId: req.user.username, fromDepartment: req.user.deptId,
    toType: 'department', toId: toDepartment, toDepartment,
    citizenId: citizen.id, citizenName: fullName(citizen),
    requestType: String(requestType).slice(0, 200), message: String(message).slice(0, 1000),
    priority: priority === 'Urgent' ? 'Urgent' : 'Normal',
  });
  REQUESTS.unshift(request);
  notif({ title: `Department request - ${request.requestType}`, citizen: fullName(citizen), citizenId: citizen.id, dept: DEPTS.find((d) => d.id === toDepartment)?.name });
  audit(req, 'dept.request', { id: request.id, to: toDepartment });
  res.status(201).json({ request });
});

router.patch('/dept/requests/:id', (req, res) => {
  const r = REQUESTS.find((x) => x.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Request not found.' });
  const isRecipient = req.user.portal !== 'citizen' && r.toDepartment === req.user.deptId;
  const isCitizenOwner = req.user.portal === 'citizen' && r.citizenId === req.user.citizenId;
  if (!isRecipient && !isCitizenOwner) return res.status(403).json({ error: 'You cannot update this request.' });
  const { status, response } = req.body || {};
  if (isRecipient && status) {
    if (!['Pending', 'In Progress', 'Information Required', 'Completed', 'Rejected'].includes(status))
      return res.status(400).json({ error: 'Invalid status.' });
    r.status = status;
    if (response !== undefined) r.response = String(response).slice(0, 2000);
    r.updatedAt = new Date().toISOString();
    notif({ title: `Request ${r.id} ${status}`, citizen: r.citizenName, citizenId: r.citizenId, dept: DEPTS.find((d) => d.id === r.fromDepartment)?.name });
  } else if (isCitizenOwner && response !== undefined) {
    r.response = String(response).slice(0, 2000);
    r.status = 'Pending';
    r.updatedAt = new Date().toISOString();
  }
  audit(req, 'dept.request.update', { id: r.id, status: r.status });
  res.json({ request: r });
});

// Legacy officer service form still works.
router.post('/requests', (req, res) => {
  const { deptId, actionIndex, fields } = req.body || {};
  const dept = DEPTS.find((d) => d.id === deptId);
  const action = dept && Number.isInteger(actionIndex) ? MODULE_ACTIONS[deptId][actionIndex] : null;
  if (!dept || !action) return res.status(400).json({ error: 'Unknown service request.' });
  if (
    !Array.isArray(fields) || fields.length > 20 ||
    fields.some((f) => typeof f?.label !== 'string' || typeof f?.value !== 'string' || f.label.length > 200 || f.value.length > 1000)
  ) return res.status(400).json({ error: 'Invalid form data.' });
  const reference = `${dept.name.slice(0, 2).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  REQUESTS.push({ reference, deptId, action: action.title, fields, by: req.user.username, at: new Date().toISOString() });
  const short = req.user.name.split(' ').map((s, i) => (i === 0 ? `${s[0]}.` : s)).join(' ');
  ACTIVITY.unshift({ who: `Officer ${short}`, what: `submitted "${action.title}" via ${dept.name}`, time: 'Just now' });
  audit(req, 'request.submit', { reference, deptId });
  res.status(201).json({ reference });
});

export default router;
