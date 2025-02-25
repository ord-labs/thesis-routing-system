export const thesisModel = (title, fileUrl, studentId, currRoute, members, deadline) => ({
    title,
    fileUrl,
    studentId,
    currRoute,
    // deadline,
    createdAt: new Date()
});