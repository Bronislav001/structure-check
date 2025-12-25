const { httpError } = require('../middleware/errors');
const { makeId, now } = require('../util');
const { getDefaultTemplate } = require('./templateService');
const { analyzeTextAgainstTemplate } = require('./aiService');

function createChecksService(db) {
  const insertStmt = db.prepare(`
    INSERT INTO checks (
      id, userId, label, text, notes, createdAt, updatedAt,
      inputLength, ok, templateJson, foundJson, missingJson, orderIssuesJson
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const listStmt = db.prepare(`
    SELECT id, userId, label, notes, createdAt, updatedAt, inputLength, ok,
           templateJson, foundJson, missingJson, orderIssuesJson
    FROM checks
    WHERE userId = ?
    ORDER BY createdAt DESC
  `);

  const getStmt = db.prepare(`
    SELECT id, userId, label, notes, createdAt, updatedAt, inputLength, ok,
           templateJson, foundJson, missingJson, orderIssuesJson
    FROM checks
    WHERE id = ?
  `);

  const updateStmt = db.prepare(`
    UPDATE checks
    SET label = COALESCE(?, label),
        notes = COALESCE(?, notes),
        updatedAt = ?
    WHERE id = ?
  `);

  const deleteStmt = db.prepare(`DELETE FROM checks WHERE id = ?`);

  function toDto(row) {
    return {
      id: row.id,
      userId: row.userId,
      label: row.label,
      notes: row.notes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      inputLength: row.inputLength,
      ok: !!row.ok,
      template: JSON.parse(row.templateJson),
      found: JSON.parse(row.foundJson),
      missing: JSON.parse(row.missingJson),
      orderIssues: JSON.parse(row.orderIssuesJson)
    };
  }

  function validateCreate({ label, text }) {
    const l = String(label || '').trim();
    const t = String(text || '');
    if (!l || l.length < 2) throw httpError(400, 'VALIDATION_ERROR', 'label is required (min 2 chars)');
    if (!t || t.trim().length < 10) throw httpError(400, 'VALIDATION_ERROR', 'text is required (min 10 chars)');
    return { label: l, text: t };
  }

  function assertOwner(userId, row) {
    if (!row) throw httpError(404, 'NOT_FOUND', 'check not found');
    if (row.userId !== userId) throw httpError(403, 'FORBIDDEN', 'no access to this resource');
  }

  function createCheck(userId, { label, text }) {
    const v = validateCreate({ label, text });

    const template = getDefaultTemplate();
    const analysis = analyzeTextAgainstTemplate(v.text, template);

    const check = {
      id: makeId('chk'),
      userId,
      label: v.label,
      text: v.text,
      notes: '',
      createdAt: now(),
      updatedAt: now(),
      inputLength: v.text.length,
      ok: analysis.ok ? 1 : 0,
      templateJson: JSON.stringify(analysis.template),
      foundJson: JSON.stringify(analysis.found),
      missingJson: JSON.stringify(analysis.missing),
      orderIssuesJson: JSON.stringify(analysis.orderIssues)
    };

    insertStmt.run(
      check.id, check.userId, check.label, check.text, check.notes,
      check.createdAt, check.updatedAt, check.inputLength, check.ok,
      check.templateJson, check.foundJson, check.missingJson, check.orderIssuesJson
    );

    return toDto(check);
  }

  function listChecks(userId) {
    return listStmt.all(userId).map(toDto);
  }

  function getCheck(userId, id) {
    const row = getStmt.get(id);
    assertOwner(userId, row);
    return toDto(row);
  }

  function updateCheck(userId, id, patch) {
    const row = getStmt.get(id);
    assertOwner(userId, row);

    const label = patch && patch.label != null ? String(patch.label).trim() : null;
    const notes = patch && patch.notes != null ? String(patch.notes) : null;

    if (label != null && label.length < 2) throw httpError(400, 'VALIDATION_ERROR', 'label must be min 2 chars');

    updateStmt.run(label, notes, now(), id);
    const updated = getStmt.get(id);
    return toDto(updated);
  }

  function deleteCheck(userId, id) {
    const row = getStmt.get(id);
    assertOwner(userId, row);
    deleteStmt.run(id);
    return { deleted: id };
  }

  return { createCheck, listChecks, getCheck, updateCheck, deleteCheck };
}

module.exports = { createChecksService };
