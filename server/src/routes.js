import { Router } from 'express';
import {
  CITIZENS, NOTIFICATIONS_WITH_IDS, ACTIVITY, DEPTS, MODULE_ACTIONS,
  STATS, CASE_COUNTS, ANALYTICS, REQUESTS,
} from './data.js';

const router = Router();

const audit = (req, action, meta = {}) =>
  console.log(JSON.stringify({ t: new Date().toISOString(), officer: req.officer.username, action, ...meta }));

const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, '');
const fullName = (c) => `${c.firstName} ${c.lastName}`;
const summary = (c) => ({
  id: c.id, nid: c.nid, passport: c.passport, empNo: c.empNo,
  firstName: c.firstName, lastName: c.lastName, district: c.district, flags: c.flags,
});

router.get('/dashboard', (req, res) => {
  res.json({ stats: STATS, caseCounts: CASE_COUNTS, activity: ACTIVITY.slice(0, 5) });
});

router.get('/analytics', (req, res) => res.json(ANALYTICS));

router.get('/notifications', (req, res) => res.json({ notifications: NOTIFICATIONS_WITH_IDS }));

// Full records for the department tables.
router.get('/citizens', (req, res) => {
  audit(req, 'citizen.list');
  res.json({ citizens: CITIZENS });
});

// Must be declared before /citizens/:id
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
  // The search text is not logged because it can be an ID number.
  audit(req, 'citizen.search', { type, count: results.length });
  res.json({ results: results.map(summary) });
});

router.get('/citizens/:id', (req, res) => {
  const citizen = CITIZENS.find((c) => c.id === req.params.id);
  if (!citizen) return res.status(404).json({ error: 'Citizen record not found.' });
  audit(req, 'citizen.view', { citizenId: citizen.id });
  res.json({ citizen });
});

router.post('/requests', (req, res) => {
  const { deptId, actionIndex, fields } = req.body || {};
  const dept = DEPTS.find((d) => d.id === deptId);
  const action = dept && Number.isInteger(actionIndex) ? MODULE_ACTIONS[deptId][actionIndex] : null;
  if (!dept || !action) return res.status(400).json({ error: 'Unknown service request.' });
  if (
    !Array.isArray(fields) || fields.length > 20 ||
    fields.some((f) => typeof f?.label !== 'string' || typeof f?.value !== 'string' || f.label.length > 200 || f.value.length > 1000)
  ) {
    return res.status(400).json({ error: 'Invalid form data.' });
  }

  const reference = `${dept.name.slice(0, 2).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  REQUESTS.push({ reference, deptId, action: action.title, fields, by: req.officer.username, at: new Date().toISOString() });
  const short = req.officer.name.split(' ').map((s, i) => (i === 0 ? `${s[0]}.` : s)).join(' ');
  ACTIVITY.unshift({ who: `Officer ${short}`, what: `submitted "${action.title}" via ${dept.name}`, time: 'Just now' });
  audit(req, 'request.submit', { reference, deptId });
  res.status(201).json({ reference });
});

export default router;
