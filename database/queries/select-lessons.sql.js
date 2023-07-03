'use strict';

const query = {};

/**
 * Select query for to get all lessons.
 */
query.selectBlock = function() {
    return `
    SELECT l.id, CAST(l.date AS text), l.title, l.status,
        CAST(
                COUNT(DISTINCT ls.student_id) FILTER (WHERE ls.visit='t')
            AS integer)
        AS visitCount,

        COALESCE(
            ARRAY_AGG(DISTINCT jsonb_build_object(
                    'id', ls.student_id,
                    'name', s.name,
                    'visit', ls.visit))
                FILTER (WHERE ls.student_id IS NOT NULL),
            ARRAY[]::jsonb[])
        AS students,

        COALESCE(
            ARRAY_AGG(DISTINCT jsonb_build_object(
                    'id', lt.teacher_id,
                    'name', t.name))
                FILTER (WHERE lt.teacher_id IS NOT NULL),
            ARRAY[]::jsonb[])
        AS teachers

    FROM lessons AS l
    LEFT JOIN lesson_teachers AS lt ON l.id=lt.lesson_id
    LEFT JOIN lesson_students AS ls ON l.id=ls.lesson_id
    LEFT JOIN teachers AS t ON t.id=lt.teacher_id
    LEFT JOIN students AS s ON s.id=ls.student_id`;
};
query.whereBlock = function() {
    return `
    WHERE true`;
};
query.whereDate1Param = function({date1}) {
    return `
    AND date >= $${date1}::date`;
};
query.whereDate2Param = function({date2}) {
    return `
    AND date <= $${date2}::date`;
};
query.whereStatusParam = function({status}) {
    return `
    AND status=$${status}::integer`;
};
query.groupByBlock = function() {
    return `
    GROUP BY l.id`;
};
query.havingBlock = function() {
    return `
    HAVING true`;
};
query.havingStudentsCountParam = function({studentsCount}) {
    return `
    AND COUNT(DISTINCT ls.student_id)=$${studentsCount}::integer`;
};
query.havingTeacherIdsParam = function({teacherIds}) {
    return `
    AND (COALESCE(
        ARRAY_AGG(DISTINCT lt.teacher_id)
            FILTER (WHERE lt.teacher_id IS NOT NULL),
        ARRAY[]::integer[]) && $${teacherIds}::integer[])`;
};
query.orderByBlock = function() {
    return `
    ORDER BY l.id ASC, date ASC`;
};
query.limitOffsetBlock = function({lessonsPerPage, page}) {
    return `
    LIMIT $${lessonsPerPage}::integer
    OFFSET $${lessonsPerPage}::integer * ($${page}::integer - 1)`;
};

Object.freeze(query);

module.exports = query;
