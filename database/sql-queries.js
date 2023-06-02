'use strict';

const queries = {};

queries.lesson_1 = `
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
LEFT JOIN students AS s ON s.id=ls.student_id
`;
queries.lesson_where = `WHERE true
`;
queries.lesson_where_date = function(id1, id2) {
    return `AND (date BETWEEN $${id1}::date AND $${id2}::date)
    `;
};
queries.lesson_where_status = function(id) {
    return `AND status=$${id}::integer
    `;
};
queries.lesson_2 = `
GROUP BY l.id
`;
queries.lesson_having = `HAVING true
`;
queries.lesson_having_studentsCount = function(id) {
    return `AND COUNT(DISTINCT ls.student_id)=$${id}::integer
    `;
};
queries.lesson_having_teacherIds = function(id) {
    return `AND (COALESCE(
                ARRAY_AGG(DISTINCT lt.teacher_id)
                    FILTER (WHERE lt.teacher_id IS NOT NULL),
                ARRAY[]::integer[]) && $${id}::int[])
    `;
};
queries.lesson_3 = `
ORDER BY l.id ASC, date ASC
LIMIT $2::integer OFFSET $2::integer * ($1::integer - 1);
;
`;

Object.freeze(queries);
module.exports = queries;
