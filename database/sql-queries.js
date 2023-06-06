'use strict';

const queries = {};

queries.s_lesson_1 = `
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
queries.s_lesson_where = `WHERE true
`;
queries.s_lesson_where_date = function(id1, id2) {
    return `AND (date BETWEEN $${id1}::date AND $${id2}::date)
    `;
};
queries.s_lesson_where_status = function(id) {
    return `AND status=$${id}::integer
    `;
};
queries.s_lesson_2 = `
GROUP BY l.id
`;
queries.s_lesson_having = `HAVING true
`;
queries.s_lesson_having_studentsCount = function(id) {
    return `AND COUNT(DISTINCT ls.student_id)=$${id}::integer
    `;
};
queries.s_lesson_having_teacherIds = function(id) {
    return `AND (COALESCE(
                ARRAY_AGG(DISTINCT lt.teacher_id)
                    FILTER (WHERE lt.teacher_id IS NOT NULL),
                ARRAY[]::integer[]) && $${id}::integer[])
    `;
};
queries.s_lesson_3 = `
ORDER BY l.id ASC, date ASC
LIMIT $2::integer OFFSET $2::integer * ($1::integer - 1);
;
`;

queries.i_lesson_1 = `INSERT INTO lessons(title, date, status) VALUES
`;
queries.i_lesson_values = function(id1, id2, id3) {
    return `${ id1 !== 1 ? ',' : '' }
    ($${id1}::text, $${id2}::date, $${id3}::integer)`;
};
queries.i_lesson_2 = 'RETURNING id;';

queries.i_lesson_teachers_1 = `
INSERT INTO lesson_teachers(lesson_id,teacher_id) VALUES
`;
queries.i_lesson_teachers_values = function(id1, id2) {
    return `${ id1 !== 1 ? ',' : '' }
    ($${id1}::integer, $${id2}::integer)`;
};

queries.check_teachers = `
SELECT COUNT(*) FROM teachers
WHERE ARRAY[teachers.id] <@ $1::integer[];
`;

Object.freeze(queries);
module.exports = queries;
