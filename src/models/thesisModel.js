export const thesisModel = (title, fileUrl, studentId, currRoute, members, deadline) => ({
    title,
    fileUrl,
    studentId,
    currRoute,
    members,
    deadline,
    createdAt: new Date()
});